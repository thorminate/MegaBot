import { Client, Message, TextChannel } from "discord.js";
import Player from "../../models/Player";

export default async (bot: Client, message: Message) => {
  let player = await Player.load(message.author.username); // Get the player.

  if (!player) player = new Player(message.author.username);

  if (!message.guild) return;

  const member = await message.guild.members.fetch(message.author.id);

  const min = 1;
  const max = 3;

  await player.giveXpFromRange(
    min,
    max,
    member,
    true,
    message.channel as TextChannel
  );
};
