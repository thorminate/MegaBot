import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  GuildMemberRoleManager,
  MessageFlags,
} from "discord.js";
import buttonWrapper from "../../utils/buttonWrapper.js";
import Player from "../../models/Player.js";

export default async (bot: Client, interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    case "onboarding-verify":
      if (await Player.load(interaction.user.username)) {
        await interaction.reply({
          content: "You are already registered.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const onboardingVerifyButtons = buttonWrapper([
        new ButtonBuilder()
          .setCustomId("onboarding-continue")
          .setLabel("Continue...")
          .setStyle(ButtonStyle.Success),
      ]);

      await interaction.reply({
        content:
          "Before we continue, please read through these <#1366452300016779304>",
        flags: MessageFlags.Ephemeral,
        components: onboardingVerifyButtons,
      });
      break;
    case "onboarding-continue":
      if (await Player.load(interaction.user.username)) {
        await interaction.reply({
          content: "You are already registered.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const onboardingContinueButtons = buttonWrapper([
        new ButtonBuilder()
          .setCustomId("onboarding-done")
          .setLabel("Yup!")
          .setStyle(ButtonStyle.Success),
      ]);

      await interaction.reply({
        content:
          "Now, make sure you have subscribed to MegaNibby on [YouTube](https://www.youtube.com/@MegaNibby)!",
        flags: MessageFlags.Ephemeral,
        components: onboardingContinueButtons,
      });
      break;
    case "onboarding-done":
      if (await Player.load(interaction.user.username)) {
        await interaction.reply({
          content: "You are already registered.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const newPlayer = new Player(interaction.user.username);

      await newPlayer.save();

      await (interaction.member.roles as GuildMemberRoleManager).add(
        process.env.VERIFIED_ROLE_ID
      );

      await interaction.reply({
        content:
          "You have been verified, welcome to the server! :) You are currently level 1, level up to level 2 to unlock all channels.",
        flags: MessageFlags.Ephemeral,
      });
      break;
  }
};
