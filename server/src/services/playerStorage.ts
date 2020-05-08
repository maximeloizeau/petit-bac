import { createHandyClient } from "handy-redis";
import { Player } from "../models/Game";
import * as generate from "meaningful-string";

const redis = createHandyClient();

function playerStorageKey(playerId: string) {
  return `player:${playerId}`;
}

function objectToRedisSetArgs(obj: {
  [key: string]: string | boolean | number;
}) {
  return Object.keys(obj).reduce(
    (list, key) => list.concat([[key, String(obj[key])]]),
    [] as [string, string][]
  );
}

export async function getPlayer(id: string) {
  const player = await redis.hgetall(playerStorageKey(id));
  return player;
}

export async function createPlayer(id: string, playerName?: string) {
  let name;
  if (playerName) {
    name = playerName;
  } else {
    name = generate.meaningful().split("-")[0];
  }

  const userProfile = { id, name, left: false };

  await redis.hset(playerStorageKey(id), ...objectToRedisSetArgs(userProfile));

  return userProfile;
}

export async function updatePlayer(id: string, fields: Partial<Player>) {
  const storageKey = playerStorageKey(id);

  const exists = await redis.exists(storageKey);
  if (!exists) {
    return;
  }

  redis.hset(
    storageKey,
    ...objectToRedisSetArgs(
      fields as { [key: string]: string | boolean | number }
    )
  );

  const player = await redis.hgetall(storageKey);
  return player;
}
