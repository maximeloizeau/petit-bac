import { redis } from "./redisStorage";
import { Game, Player, toPublicGame } from "../models/Game";
import { gameEventEmitter } from "./gameEventEmitter";

function gameStorageKey(gameId: string) {
  return `game:${gameId}`;
}
function gamePlayersStorageKey(gameId: string) {
  return `game-players:${gameId}`;
}
function playerGamesStorageKey(playerId: string) {
  return `player-games:${playerId}`;
}

function gameToRedisStorage(gameDetails: Partial<Game>) {
  return Object.keys(gameDetails).reduce(
    (list, key) =>
      list.concat([
        [key as string, JSON.stringify(gameDetails[key as keyof Game])],
      ]),
    [] as [string, string][]
  );
}

export const saveGame = async (
  gameId: string,
  gameDetails: Partial<Game>
): Promise<Game> => {
  const gameKey = gameStorageKey(gameId);
  const playersKey = gamePlayersStorageKey(gameId);

  if (gameDetails.playerIds && gameDetails.playerIds.length > 0) {
    await redis.del(playersKey);
    await redis.sadd(playersKey, ...gameDetails.playerIds);
    await Promise.all(
      gameDetails.playerIds.map((playerId) =>
        redis.sadd(playerGamesStorageKey(playerId), gameId)
      )
    );
  }

  delete gameDetails.playerIds;

  if (Object.keys(gameDetails).length > 0) {
    await redis.hset(gameKey, ...gameToRedisStorage(gameDetails));
  }

  const game = await getGame(gameId);
  gameEventEmitter.emit("gameupdate", await toPublicGame(game));
  return game;
};

export const addPlayer = async (gameId: string, player: Player) => {
  const playersKey = gamePlayersStorageKey(gameId);
  const playerGamesKey = playerGamesStorageKey(player.id);

  const [added] = await Promise.all([
    redis.sadd(playersKey, player.id),
    redis.sadd(playerGamesKey, gameId),
  ]);
  const updated = added === 1;

  updated &&
    gameEventEmitter.emit(
      "gameupdate",
      await toPublicGame(await getGame(gameId))
    );

  return updated;
};

export const removePlayer = async (gameId: string, player: Player) => {
  const playersKey = gamePlayersStorageKey(gameId);
  const playerGamesKey = playerGamesStorageKey(player.id);

  const exists = await redis.exists(playersKey);
  if (!exists) {
    return false;
  }

  const [removed] = await Promise.all([
    redis.srem(playersKey, player.id),
    redis.srem(playerGamesKey, gameId),
  ]);
  const updated = removed === 1;

  updated &&
    gameEventEmitter.emit(
      "gameupdate",
      await toPublicGame(await getGame(gameId))
    );

  return updated;
};

export const getGame = async (gameId: string): Promise<Game> => {
  const gameKey = gameStorageKey(gameId);
  const playersKey = gamePlayersStorageKey(gameId);

  const [game, playerList] = await Promise.all([
    redis.hgetall(gameKey),
    redis.smembers(playersKey),
  ]);

  const decodedGame = Object.keys(game).reduce(
    (decoded, key) => ({
      ...decoded,
      [key]: JSON.parse(game[key]),
    }),
    { playerIds: playerList } as Game
  );
  return decodedGame;
};

export const getPlayerGames = async (playerId: string): Promise<string[]> => {
  const games = await redis.smembers(playerGamesStorageKey(playerId));
  return games;
};
