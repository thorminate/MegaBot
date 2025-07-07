import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import calculateLevelExp from "../../utils/calculateLevelExp.js";
import Player from "../../models/Player.js";

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
  callback: async (bot: Client, interaction: ChatInputCommandInteraction) => {
    const player = await Player.load(interaction.user.username);

    if (!player) {
      await interaction.reply({
        content: "You are not registered.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const isEphemeral = interaction.options.get("show-others")
      ? (!interaction.options.get("show-others").value as boolean)
      : true;

    await interaction.reply({
      content: `You are at level ${player.level} and you have ${
        player.xp
      } xp. You need ${calculateLevelExp(player.level)} xp to level up.`,
      flags: isEphemeral ? MessageFlags.Ephemeral : undefined,
    });
  },
};
