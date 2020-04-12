import { Player } from "../models/Game";
import * as generate from "meaningful-string";

const users = new Map<string, Player>();

export function getPlayer(id: string) {
  return users.get(id);
}

export function createPlayer(id: string, playerName?: string) {
  let name;
  if (playerName) {
    name = playerName;
  } else {
    name = generate.meaningful().split("-")[0];
  }

  const userProfile = { id, name, left: false };

  users.set(id, userProfile);

  return userProfile;
}
