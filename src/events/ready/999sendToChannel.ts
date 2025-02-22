import {
  AttachmentBuilder,
  Client,
  EmbedBuilder,
  Events,
  TextChannel,
} from "discord.js";
import { config } from "dotenv";
config();

export default async (bot: Client) => {
  const rulesChannel = await bot.channels.fetch(process.env.RULES_CHANNEL_ID);

  await (rulesChannel as TextChannel).bulkDelete(100, true);

  const rulesImage = new AttachmentBuilder("./assets/rules.png");

  const rulesComponents = [
    new EmbedBuilder().setColor("#FF0000").setImage("attachment://rules.png"),
    new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle(
        "**Welcome to the official MegaNibby server! Please follow the rules when engaging here.**\n\n"
      )
      .setDescription(
        "Make sure to always follow discords own [TOS](https://discord.com/terms)."
      )
      .addFields([
        {
          name: "**`1)`Don't use language that can be perceived as offensive or disrespectful**",
          value:
            "Swearing, cursing, or using derogatory language is not allowed. Treat everyone like you want to be treated.\n",
        },
      ]),
  ];

  await (rulesChannel as TextChannel).send({
    embeds: rulesComponents,
    files: [rulesImage],
  });
};
