import { redis } from "./redisStorage";
import { Player } from "../models/Game";
import * as generate from "meaningful-string";

function tryDecode(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}

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

export async function getPlayer(id: string): Promise<Player | undefined> {
  const player = await redis.hgetall(playerStorageKey(id));
  if (!player) {
    return undefined;
  }

  return Object.keys(player).reduce((decoded, key) => {
    return {
      ...decoded,
      [key]: tryDecode(player[key]),
    };
  }, {} as Player);
}

export async function getAllPlayers() {
  const keys = await redis.keys("player:*");
  const players = await Promise.all(keys.map((key) => redis.hgetall(key)));
  return players;
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
