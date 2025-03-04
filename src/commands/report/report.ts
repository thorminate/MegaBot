import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import { config } from "dotenv";
config();

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
        ephemeral: true,
      });
      return;
    }

    if (member.id === bot.user.id) {
      await interaction.reply({
        content: "You can't report me.",
        ephemeral: true,
      });
      return;
    }

    if (member.id === interaction.guild.ownerId) {
      await interaction.reply({
        content: "You can't report MegaNibby.",
        ephemeral: true,
      });
      return;
    }

    if (member.permissions.has("Administrator")) {
      await interaction.reply({
        content: "You can't report an admin.",
        ephemeral: true,
      });
      return;
    }

    const reportChannel = await interaction.guild.channels.fetch(
      process.env.REPORT_CHANNEL_ID
    );

    if (!reportChannel) {
      await interaction.reply({
        content: "Report channel not found. Contact an admin.",
        ephemeral: true,
      });
      return;
    }

    const latestMessage = (
      await interaction.channel.messages.fetch({
        limit: 1,
      })
    ).first();

    await (reportChannel as TextChannel).send({
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
              value: latestMessage.url,
            },
          ],
          color: 0xff0000,
        },
      ],
    });

    await interaction.reply({
      content: `Reported ${user.username} for ${reason}`,
      ephemeral: true,
    });
  },
};
