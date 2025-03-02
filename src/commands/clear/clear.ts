import { Client, CommandInteraction } from "discord.js";

export default {
  name: "clear",
  description: "Clears the chat",
  adminOnly: true,
  callback: async (bot: Client, interaction: CommandInteraction) => {
    await interaction.channel.bulkDelete(100, true);

    await interaction.reply({
      content: "Chat cleared.",
      ephemeral: true,
    });
  },
};
