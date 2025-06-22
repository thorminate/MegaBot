import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  Embed,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import buttonWrapper from "../../utils/buttonWrapper.js";
import ms from "ms";

export default {
  name: "report",
  description: "Report a user",
  options: [
    {
      name: "user",
      description: "The user to report",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the report",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (bot: Client, interaction: CommandInteraction) => {
    const user = interaction.options.get("user").user;
    const reason = interaction.options.get("reason").value.toString();

    const member = await interaction.guild.members.fetch(user.id);

    if (!member || !reason) return;

    if (member.id === interaction.user.id) {
      await interaction.reply({
        content: "You can't report yourself.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (member.id === bot.user.id) {
      await interaction.reply({
        content: "You can't report me.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (member.id === interaction.guild.ownerId) {
      await interaction.reply({
        content: "You can't report MegaNibby.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (member.permissions.has("Administrator")) {
      await interaction.reply({
        content: "You can't report an admin.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const reportChannel = await interaction.guild.channels.fetch(
      process.env.REPORT_CHANNEL_ID
    );

    if (!reportChannel) {
      await interaction.reply({
        content: "Report channel not found. Contact an admin.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const latestMessage = (
      await interaction.channel.messages.fetch({
        limit: 1,
      })
    ).first();

    const reportMessage = await (reportChannel as TextChannel).send({
      embeds: [
        {
          title: "Report",
          fields: [
            {
              name: "User",
              value: `<@${user.id}>`,
            },
            {
              name: "Reason",
              value: reason,
            },
            {
              name: "Reporter",
              value: `<@${interaction.user.id}>`,
            },
            {
              name: "Report Link",
              value:
                latestMessage?.url ??
                interaction?.channel?.url ??
                "No link available",
            },
          ],
          color: 0xff0000,
        },
      ],
      components: buttonWrapper([
        new ButtonBuilder()
          .setCustomId(`report_actions-${user.id}`)
          .setLabel("Actions")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`report_dismiss-${user.id}`)
          .setLabel("Dismiss")
          .setStyle(ButtonStyle.Secondary),
      ]),
    });

    if (!reportMessage) {
      await interaction.reply({
        content: "Failed to send report message. Contact an admin.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const collector = reportMessage.createMessageComponentCollector();

    collector.on("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId.startsWith("report_actions-")) {
        const targetUserId = buttonInteraction.customId.split("-")[1];

        await buttonInteraction.update({
          components: buttonWrapper([
            new ButtonBuilder()
              .setCustomId(`report_action_ban-${targetUserId}`)
              .setLabel("Ban User")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`report_action_kick-${targetUserId}`)
              .setLabel("Kick User")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`report_action_timeout-${targetUserId}`)
              .setLabel("Timeout User")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`report_action_back-${targetUserId}`)
              .setLabel("Back")
              .setStyle(ButtonStyle.Secondary),
          ]),
        });
      } else if (buttonInteraction.customId.startsWith("report_action_ban-")) {
        const targetUserId = buttonInteraction.customId.split("-")[1];
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
          await buttonInteraction.reply({
            content: "User not found.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (!targetUser.bannable) {
          await buttonInteraction.reply({
            content: "I cannot ban this user.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await targetUser.ban({
          reason: `Reported by ${interaction.user.username}: ${reason}`,
        });

        await buttonInteraction.update({
          components: [],
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: buttonInteraction.user.username,
                iconURL: buttonInteraction.user.displayAvatarURL(),
              })
              .setTitle("User Banned")
              .setDescription(`Banned <@${targetUserId}> for: ${reason}`),
          ],
        });
      } else if (buttonInteraction.customId.startsWith("report_action_kick-")) {
        const targetUserId = buttonInteraction.customId.split("-")[1];
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
          await buttonInteraction.reply({
            content: "User not found.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (!targetUser.kickable) {
          await buttonInteraction.reply({
            content: "I cannot kick this user.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await targetUser.kick(
          `Reported by ${interaction.user.username}: ${reason}`
        );

        await buttonInteraction.update({
          components: [],
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: buttonInteraction.user.username,
                iconURL: buttonInteraction.user.displayAvatarURL(),
              })
              .setTitle("User Kicked")
              .setDescription(`Kicked <@${targetUserId}> for: ${reason}`),
          ],
        });
      } else if (
        buttonInteraction.customId.startsWith("report_action_timeout-")
      ) {
        const targetUserId = buttonInteraction.customId.split("-")[1];

        const modal = new ModalBuilder()
          .setCustomId(`report_timeout_modal-${targetUserId}`)
          .setTitle("Timeout User")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("timeout_duration")
                .setLabel("Duration")
                .setPlaceholder(
                  "3h 4m 9s (to use multiple units, place spaces between them)"
                )
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );

        await buttonInteraction.showModal(modal);

        const modalInteraction = await buttonInteraction.awaitModalSubmit({
          time: 60_000,
        });

        if (!modalInteraction) {
          await buttonInteraction.reply({
            content: "Timeout modal timed out.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const duration = modalInteraction.fields
          .getTextInputValue("timeout_duration")
          .split(" ")
          .reduce((acc, val) => {
            const msValue = ms(val);

            if (isNaN(msValue)) {
              modalInteraction.reply({
                content: `Invalid duration value: ${val}. Please enter a valid time format.`,
                flags: MessageFlags.Ephemeral,
              });
              return acc;
            }

            return acc + (msValue || 0);
          }, 0);

        if (isNaN(duration) || duration <= 0) {
          await modalInteraction.reply({
            content: "Invalid duration. Please enter a valid number.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
          await modalInteraction.reply({
            content: "User not found.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (!targetUser.manageable) {
          await modalInteraction.reply({
            content: "I cannot timeout this user.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await targetUser.timeout(
          duration,
          `Reported by ${interaction.user.username}: ${reason}`
        );

        if (!modalInteraction.isFromMessage()) {
          await modalInteraction.reply({
            content: "This should not happen.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await modalInteraction.update({
          components: [],
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: modalInteraction.user.username,
                iconURL: modalInteraction.user.displayAvatarURL(),
              })
              .setTitle("User Timed Out")
              .setDescription(
                `Timed out <@${targetUserId}> for: ${reason} (${ms(duration, {
                  long: true,
                })} duration)`
              ),
          ],
        });
      } else if (buttonInteraction.customId.startsWith("report_action_back-")) {
        const targetUserId = buttonInteraction.customId.split("-")[1];
        await buttonInteraction.update({
          embeds: [
            {
              title: "Report",
              fields: [
                {
                  name: "User",
                  value: `<@${user.id}>`,
                },
                {
                  name: "Reason",
                  value: reason,
                },
                {
                  name: "Reporter",
                  value: `<@${interaction.user.id}>`,
                },
                {
                  name: "Report Link",
                  value:
                    latestMessage?.url ??
                    interaction?.channel?.url ??
                    "No link available",
                },
              ],
              color: 0xff0000,
            },
          ],
          components: buttonWrapper([
            new ButtonBuilder()
              .setCustomId(`report_actions-${targetUserId}`)
              .setLabel("Actions")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId(`report_dismiss-${targetUserId}`)
              .setLabel("Dismiss")
              .setStyle(ButtonStyle.Secondary),
          ]),
        });
      } else if (buttonInteraction.customId.startsWith("report_dismiss-")) {
        const targetUserId = buttonInteraction.customId.split("-")[1];
        await buttonInteraction.update({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: buttonInteraction.user.username,
                iconURL: buttonInteraction.user.displayAvatarURL(),
              })
              .setTitle("Report Dismissed")
              .setDescription(
                `The report for <@${targetUserId}> has been dismissed.`
              )
              .setColor(0x00ff00),
          ],
          components: [],
        });

        setTimeout(async () => {
          try {
            await buttonInteraction.deleteReply();
          } catch (error) {
            console.error("Failed to delete report message:", error);
          }
        }, 5_000);
      }
    });

    await interaction.reply({
      content: `Report for <@${user.id}> has been filed successfully.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
