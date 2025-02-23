import mongoose from "mongoose";
import Saveable from "./utils/Saveable";
import { GuildMember, TextChannel } from "discord.js";
import calculateLevelExp from "../utils/calculateLevelExp";

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
