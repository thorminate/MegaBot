import { Client, Message, PermissionsBitField, TextChannel } from "discord.js";
import Player from "../../models/Player";

export default async (bot: Client, message: Message) => {
  const player = await Player.loadOrCreate(message.author.username); // Get the player.

  if (!message.guild) return;

  const member = await message.guild.members.fetch(message.author.id);

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
