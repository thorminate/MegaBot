import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

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
          name: "**`1.` Be Respectful**",
          value:
            "Treat everyone with kindness. No bullying, hate speech, discrimination, or personal attacks. \n",
        },
        {
          name: "**`2.` No Spamming**",
          value:
            "No flooding chats with messages, emojis, or random content. Keep it cool. \n",
        },
        {
          name: "**`3.` Keep it Clean**",
          value:
            "No NSFW, overly violent, or disturbing content. This is a community for all ages. \n",
        },
        {
          name: "**`4.` Stay on Topic**",
          value:
            "Post in the correct channels. Gaming talk in #gaming-chat, memes in #memes, etc. \n",
        },
        {
          name: "**`5.` No Self-Promo (Without Permission)**",
          value:
            "Don’t promote your server, YouTube, or socials unless you're allowed. Use the right channels if available. \n",
        },
        {
          name: "**`6.` Follow Discord’s Terms of Service**",
          value:
            "No cheating, hacking, illegal activities, or anything that breaks Discord rules. \n",
        },
        {
          name: "**`7.` Listen to staff**",
          value:
            "Moderators and Admins are here to help. If they ask you to stop, please do. \n",
        },
        {
          name: "**`8.` No Drama**",
          value:
            "Take heated arguments or sensitive topics elsewhere. Keep this place friendly and fun. \n",
        },
        {
          name: "**`9.` Think Before You Post**",
          value:
            "If you’re not sure if something is okay to say or do, it’s probably best not to. Use good judgement and don’t try to bend the rules. \n",
        },
        {
          name: "**`10.` Have Fun! 🎉**",
          value:
            "This is a place to hang out, talk games, share content, and enjoy the community. \n",
        },
      ])
      .setFooter({
        text: "⚠️ Breaking the rules may result in warnings, mutes, kicks, or bans — depending on the situation. \n\nYou can report someone with the /report command.",
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
