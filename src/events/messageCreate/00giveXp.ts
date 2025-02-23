import { Client, Message, PermissionsBitField, TextChannel } from "discord.js";
import Player from "../../models/Player";

export default async (bot: Client, message: Message) => {
  const player = await Player.load(message.author.username); // Get the player.

  const member = await message.guild.members.fetch(message.author.id);

  if (!player) {
    if (message.author.dmChannel) {
      await message.author.dmChannel.send(
        "You are not registered, this is a technical problem. I have reset your roles, please head to the onboarding channel."
      );
    } else {
      await message.author
        .createDM()
        .then((dm) =>
          dm.send(
            "You are not registered, this is a technical problem. I have reset your roles, please head to the onboarding channel."
          )
        );
    }

    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    await member.roles.set([]);

    return;
  }

  const min = 1;
  const max = 3;

  player.giveXpFromRange(
    min,
    max,
    member,
    true,
    message.channel as TextChannel
  );
};
