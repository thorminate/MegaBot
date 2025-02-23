import mongoose from "mongoose";
import Saveable from "./utils/Saveable";
import { GuildMember, TextChannel } from "discord.js";
import calculateLevelExp from "../utils/calculateLevelExp";
import { config } from "dotenv";
config();

interface IPlayer extends mongoose.Document {
  username: string;
  level: number;
  xp: number;
}

export interface InventoryEntry {
  name: string;
  quantity: number;
  state: string;
}

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  level: { type: Number, required: true, default: 1 },
  xp: { type: Number, required: true, default: 0 },
});

const checkRole = async (member: GuildMember, player: Player) => {
  const currentRoles = await member.roles.cache;

  if (
    player.level >= 1 &&
    !currentRoles.find((role) => role.id === process.env.COMMON_FAN_ROLE_ID)
  ) {
    await member.roles.add(process.env.COMMON_FAN_ROLE_ID);
  }

  if (
    player.level >= 5 &&
    !currentRoles.find((role) => role.id === process.env.LVL5_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL5_ROLE_ID);
  }

  if (
    player.level >= 10 &&
    !currentRoles.find((role) => role.id === process.env.LVL10_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL10_ROLE_ID);
  }

  if (
    player.level >= 15 &&
    !currentRoles.find((role) => role.id === process.env.LVL15_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL15_ROLE_ID);
  }

  if (
    player.level >= 20 &&
    !currentRoles.find((role) => role.id === process.env.LVL20_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL20_ROLE_ID);
  }

  if (
    player.level >= 25 &&
    !currentRoles.find((role) => role.id === process.env.LVL25_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL25_ROLE_ID);
  }

  if (
    player.level >= 25 &&
    !currentRoles.find((role) => role.id === process.env.UNCOMMON_FAN_ROLE_ID)
  ) {
    await member.roles.add(process.env.UNCOMMON_ROLE_ID);
  }

  if (
    player.level >= 30 &&
    !currentRoles.find((role) => role.id === process.env.LVL30_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL30_ROLE_ID);
  }

  if (
    player.level >= 35 &&
    !currentRoles.find((role) => role.id === process.env.LVL35_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL35_ROLE_ID);
  }

  if (
    player.level >= 40 &&
    !currentRoles.find((role) => role.id === process.env.LVL40_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL40_ROLE_ID);
  }

  if (
    player.level >= 45 &&
    !currentRoles.find((role) => role.id === process.env.LVL45_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL45_ROLE_ID);
  }

  if (
    player.level >= 50 &&
    !currentRoles.find((role) => role.id === process.env.LVL50_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL50_ROLE_ID);
  }

  if (
    player.level >= 50 &&
    !currentRoles.find((role) => role.id === process.env.RARE_FAN_ROLE_ID)
  ) {
    await member.roles.add(process.env.RARE_FAN_ID);
  }

  if (
    player.level >= 60 &&
    !currentRoles.find((role) => role.id === process.env.LVL60_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL60_ROLE_ID);
  }

  if (
    player.level >= 70 &&
    !currentRoles.find((role) => role.id === process.env.LVL70_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL70_ROLE_ID);
  }

  if (
    player.level >= 75 &&
    !currentRoles.find((role) => role.id === process.env.EPIC_FAN_ROLE_ID)
  ) {
    await member.roles.add(process.env.EPIC_FAN_ROLE_ID);
  }

  if (
    player.level >= 80 &&
    !currentRoles.find((role) => role.id === process.env.LVL80_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL80_ROLE_ID);
  }

  if (
    player.level >= 90 &&
    !currentRoles.find((role) => role.id === process.env.LVL90_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL90_ROLE_ID);
  }

  if (
    player.level >= 100 &&
    !currentRoles.find((role) => role.id === process.env.LVL100_ROLE_ID)
  ) {
    await member.roles.add(process.env.LVL100_ROLE_ID);
  }

  if (
    player.level >= 100 &&
    !currentRoles.find((role) => role.id === process.env.MEGA_FAN_ROLE_ID)
  ) {
    await member.roles.add(process.env.MEGA_FAN_ROLE_ID);
  }
};

const PlayerModel = mongoose.model<IPlayer>("Player", playerSchema);

export default class Player extends Saveable<IPlayer> {
  username: string;
  level: number;
  xp: number;

  async levelUp(
    amount: number = 1,
    member: GuildMember,
    currentChannel?: TextChannel,
    resetXp: boolean = true,
    save: boolean = true
  ) {
    if (amount <= 0 || !amount) return;
    this.level += amount;
    if (resetXp) this.xp = 0;

    await checkRole(member, this);

    if (currentChannel) {
      currentChannel.send(
        `<@${member.user.id}> has leveled up! Their level is now ${this.level}!`
      );
    }

    if (save) this.save();
  }

  async giveXp(
    amount: number,
    member: GuildMember,
    save: boolean = true,
    currentChannel?: TextChannel
  ) {
    this.xp += amount;
    while (this.xp >= calculateLevelExp(this.level)) {
      this.levelUp(1, member, currentChannel, false, false);
      this.xp -= calculateLevelExp(this.level - 1);
    }

    if (save) this.save();
  }

  async giveXpFromRange(
    min: number,
    max: number,
    member: GuildMember,
    save: boolean = true,
    currentChannel?: TextChannel
  ) {
    const randomFromRange = Math.floor(Math.random() * (max - min + 1)) + min;

    this.giveXp(randomFromRange, member, false, currentChannel);

    if (save) this.save();
  }

  constructor(username: string) {
    super();
    this.username = username;
  }

  protected getIdentifier(): { key: keyof IPlayer; value: any } {
    return {
      key: "username",
      value: this.username,
    };
  }

  protected getModel(): mongoose.Model<IPlayer> {
    return PlayerModel;
  }

  // Static method implementation
  static getModel(): mongoose.Model<IPlayer> {
    return PlayerModel;
  }
}
