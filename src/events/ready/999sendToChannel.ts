import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import { config } from "dotenv";
config();

export default async (bot: Client) => {
  const rulesChannel = await bot.channels.fetch(process.env.RULES_CHANNEL_ID);

  const rulesComponents = [
    new EmbedBuilder()
      .setTitle("Rules")
      .setDescription(
        `Welcome to my server! Please follow the rules when engaging here.\n\n` +
          ``
      )
      .setColor("#FF0000")
      .setImage("attachment:/dev/MegaBot/assets/rules.png"),
  ];

  await (rulesChannel as TextChannel).send({
    embeds: rulesComponents,
  });
};
