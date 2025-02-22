import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
} from "discord.js";

export default {
  name: "panel",
  description: "Get the status of the bot.",
  callback: async (bot: Client, interaction: CommandInteraction) => {
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("panel")
        .setLabel("Panel")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ components: [button] });
  },
};
