import { CommandInteraction, MessageFlags } from "discord.js";
import commandVerify from "./commandVerify.js";

interface Options {
  ephemeral: boolean;
}

export default async (interaction: CommandInteraction, Options?: Options) => {
  if (!Options) {
    Options = {
      ephemeral: true,
    };
  }

  const isCommandValid = await commandVerify(interaction);

  if (!isCommandValid) {
    await interaction.reply({
      content: "Invalid command.",
      flags: Options.ephemeral ? MessageFlags.Ephemeral : undefined,
    });
    return;
  }

  await interaction.deferReply({
    flags: Options.ephemeral ? MessageFlags.Ephemeral : undefined,
  });
};
