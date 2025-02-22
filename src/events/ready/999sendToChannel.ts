import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import { config } from "dotenv";
config();

export default async (bot: Client) => {
  const rulesChannel = await bot.channels.fetch(process.env.RULES_CHANNEL_ID);

  await (rulesChannel as TextChannel).bulkDelete(100, true);

  await (rulesChannel as TextChannel).send({
    files: [
      {
        attachment: "./assets/rules.png",
        name: "rules.png",
      },
    ],
  });

  const rulesComponents = [
    new EmbedBuilder()
      .setTitle("Rules")
      .setDescription(
        `Welcome to my server! Please follow the rules when engaging here.\n\n` +
        "**`1)`Don't use language that can be percieved as offensive or disrespectfull** \n" +
        "**`2)`**"
      )
      .setColor("#FF0000"),
  ];

  await (rulesChannel as TextChannel).send({
    embeds: rulesComponents,
  });
};
