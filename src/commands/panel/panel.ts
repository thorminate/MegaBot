import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
} from "discord.js";
import Player from "../../models/Player";

export default {
  name: "panel",
  description: "Get the status of the bot.",
  options: [
    {
      name: "show-others",
      description: "Do you want others to see your stats?",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
  callback: async (bot: Client, interaction: CommandInteraction) => {
    const player = await Player.load(interaction.user.username);

    if (!player) {
      await interaction.reply({
        content: "You are not registered.",
        ephemeral: true,
      });
      return;
    }

    const isEphemeral = interaction.options.get("show-others")
      ? (interaction.options.get("show-others").value as boolean)
      : true;

    await interaction.reply({
      content: `You have ${player.xp} xp and are at level ${player.level}.`,
      ephemeral: isEphemeral,
    });
  },
};
