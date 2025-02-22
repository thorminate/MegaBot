import mongoose from "mongoose";
import Saveable from "./utils/Saveable";

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

  constructor(username: string, displayName?: string) {
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
