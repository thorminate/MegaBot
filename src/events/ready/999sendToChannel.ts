import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { config } from "dotenv";
import buttonWrapper from "../../utils/buttonWrapper";
config();

export default async (bot: Client) => {
  const rulesChannel = await bot.channels.fetch(process.env.RULES_CHANNEL_ID);

  await (rulesChannel as TextChannel).bulkDelete(100, true);

  const rulesImage = new AttachmentBuilder("./assets/rules.png");

  const rulesEmbeds = [
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
          name: "**`1)`Behavior in the server.**",
          value:
            "Swearing, cursing, or using derogatory language is not allowed. Treat everyone like you want to be treated.\n",
        },
        {
          name: "**`2)`Keep this server clean**",
          value:
            "Keep everything family friendly and non controversial. This means no swearing. Please keep topic relevant to the channel. No topic meant to incite a negative response. \n",
        },
        {
          name: "**`3)`Profiles and usernames**",
          value:
            "Usernames, nicknames and profile pictures are subject to the same rules as chat. Please keep these family friendly. This also means no impersonation! \n",
        },
        {
          name: "**`4)`Advertising**",
          value:
            "Advertising other servers is not allowed, nor is advertising your services or products allowed. Linking other youtube channels is also not allowed.\n",
        },
        {
          name: "**`5)`Staff's word**",
          value:
            "If a staff member asks you to stop doing something, you should STOP. All staff have the final say on what is allowed and what is not! They can override the rules if they see something inherently wrong. Therefore loopholes within the rules are not allowed.\n",
        },
      ])
      .setFooter({
        text: "You can report someone with the /report command.",
      }),
  ];

  await (rulesChannel as TextChannel).send({
    embeds: rulesEmbeds,
    files: [rulesImage],
  });

  const onboardingChannel = await bot.channels.fetch(
    process.env.ONBOARDING_CHANNEL_ID
  );

  await (onboardingChannel as TextChannel).bulkDelete(100, true);

  const onboardingEmbeds = [
    new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("***Welcome***")
      .setDescription("Please press 'verify' to gain access to the server."),
  ];

  const onboardingButtons = new ActionRowBuilder<ButtonBuilder>({
    components: [
      new ButtonBuilder()
        .setCustomId("onboarding-verify")
        .setLabel("Verify")
        .setStyle(ButtonStyle.Success),
    ],
  });

  await (onboardingChannel as TextChannel).send({
    embeds: onboardingEmbeds,
    components: [onboardingButtons],
  });
};
