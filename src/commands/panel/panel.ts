import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
} from "discord.js";
import calculateLevelExp from "../../utils/calculateLevelExp";
import Player from "../../models/Player";

export default {
  name: "panel",
  description: "Get your level and xp.",
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
      ? (!interaction.options.get("show-others").value as boolean)
      : true;

    await interaction.reply({
      content: `You are at level ${player.level} and you have ${player.xp} xp. You need ${calculateLevelExp(player.level)} xp to level up.`,
      ephemeral: isEphemeral,
    });
  },
};
