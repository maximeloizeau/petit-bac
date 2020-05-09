import { redis } from "./redisStorage";
import {
  Game,
  Player,
  toPublicGame,
  Round,
  PlayerAnswer,
} from "../models/Game";
import { gameEventEmitter } from "./gameEventEmitter";

function tryDecode(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}

function gameStorageKey(gameId: string) {
  return `game:${gameId}`;
}
function roundStorageKey(gameId: string, roundId: string) {
  return `game-round:${gameId}:${roundId}`;
}
function playerAnswersStorageKey(
  gameId: string,
  roundId: string,
  categoryId: string,
  playerId: string
) {
  return `game-round-answers:${gameId}:${roundId}:${categoryId}:${playerId}`;
}
function gamePlayersStorageKey(gameId: string) {
  return `game-players:${gameId}`;
}
function playerGamesStorageKey(playerId: string) {
  return `player-games:${playerId}`;
}

export const saveGame = async (
  gameId: string,
  gameDetails: Partial<Game>
): Promise<Game> => {
  console.log("saving game", gameDetails);

  const gameKey = gameStorageKey(gameId);
  const playersKey = gamePlayersStorageKey(gameId);

  const persistedFields = [
    "id",
    "inProgress",
    "state",
    "categories",
    "creatorId",
    "currentRound",
    "roundsIds",
    "roundsLeft",
    "scoreboard",
    "rules",
  ];
  const gameData: [string, string][] = [];
  for (const field of Object.keys(gameDetails)) {
    if (!persistedFields.includes(field)) {
      continue;
    }
    gameData.push([field, JSON.stringify(gameDetails[field as keyof Game])]);
  }

  if (gameData.length > 0) {
    await redis.hset(gameKey, ...gameData);
  }

  if (gameDetails.playerIds && gameDetails.playerIds.length > 0) {
    await redis.del(playersKey);
    await redis.sadd(playersKey, ...gameDetails.playerIds);
    await Promise.all(
      gameDetails.playerIds.map((playerId) =>
        redis.sadd(playerGamesStorageKey(playerId), gameId)
      )
    );
  }

  if (gameDetails.rounds) {
    await Promise.all(
      gameDetails.rounds.map((round) => saveRound(gameId, round.id, round))
    );
  }

  const game = await getGame(gameId);
  gameEventEmitter.emit("gameupdate", await toPublicGame(game));
  return game;
};

export const saveRound = async (
  gameId: string,
  roundId: string,
  roundData: Partial<Round>
) => {
  const key = roundStorageKey(gameId, roundId);
  const dataArray: [string, string][] = [];

  const persistedFields = [
    "id",
    "started",
    "ended",
    "letter",
    "answersReceivedCount",
  ];
  for (const field of Object.keys(roundData)) {
    if (!persistedFields.includes(field)) {
      continue;
    }
    dataArray.push([field, JSON.stringify(roundData[field as keyof Round])]);
  }

  if (dataArray.length > 0) {
    await redis.hset(key, ...dataArray);
  }

  if (roundData.answers) {
    const categoryAnswersMap = (answerCategory: string) =>
      Promise.all(
        roundData.answers![answerCategory].map((playerAnswer) =>
          saveAnswers(
            gameId,
            roundId,
            answerCategory,
            playerAnswer.playerId,
            playerAnswer
          )
        )
      );
    await Promise.all(Object.keys(roundData.answers).map(categoryAnswersMap));
  }

  const game = await getGame(gameId);
  return getRound(
    gameId,
    roundId,
    game.categories.map((c) => c.id),
    game.playerIds
  );
};

export const incrementRoundAnswerReceivedCount = async (
  gameId: string,
  roundId: string
) => {
  const key = roundStorageKey(gameId, roundId);
  const newValue = await redis.hincrby(key, "answersReceivedCount", 1);
  return newValue;
};

export const saveAnswers = async (
  gameId: string,
  roundId: string,
  answerCategory: string,
  playerId: string,
  playerAnswer: Partial<PlayerAnswer>
) => {
  console.log("save answers", playerAnswer);
  const key = playerAnswersStorageKey(
    gameId,
    roundId,
    answerCategory,
    playerId
  );

  const data: [string, string][] = [
    ["categoryId", answerCategory],
    ["playerId", playerId],
  ];

  if (playerAnswer.answer !== undefined) {
    data.push(["answer", JSON.stringify(playerAnswer.answer)]);
  }

  if (playerAnswer.ratings !== undefined) {
    data.push(
      ...playerAnswer.ratings.reduce(
        (list, rating, index) =>
          list.concat([[`rating-${index}`, String(rating)]]),
        [] as [string, string][]
      )
    );
  }

  if (data.length > 0) {
    await redis.hset(key, ...data);
  }
};

export const saveRating = async (
  gameId: string,
  roundId: string,
  answerCategory: string,
  playerIdBeingRated: string,
  indexOfPlayerSubmitting: number,
  rating: boolean
) => {
  const key = playerAnswersStorageKey(
    gameId,
    roundId,
    answerCategory,
    playerIdBeingRated
  );

  await redis.hset(key, `rating-${indexOfPlayerSubmitting}`, String(rating));
};

export const addPlayer = async (gameId: string, player: Player) => {
  console.log("adding player", gameId, player.id);

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

  const [gameData, playerList] = await Promise.all([
    redis.hgetall(gameKey),
    redis.smembers(playersKey),
  ]);

  const decodedGame = Object.keys(gameData).reduce(
    (decoded, key) => ({
      ...decoded,
      [key]: tryDecode(gameData[key]),
    }),
    { playerIds: playerList } as Game
  );

  const categoriesIds = decodedGame.categories.map((c) => c.id);
  const rounds = await Promise.all(
    decodedGame.roundsIds.map((roundId) =>
      getRound(gameId, roundId, categoriesIds, playerList)
    )
  );
  decodedGame.rounds = rounds;

  return decodedGame;
};

export const getRound = async (
  gameId: string,
  roundId: string,
  categoriesIds: string[],
  playerList: string[]
): Promise<Round> => {
  const roundStorage = roundStorageKey(gameId, roundId);

  const roundData = await redis.hgetall(roundStorage);

  const answersUnflatData = await Promise.all(
    categoriesIds.map((categoryId) =>
      Promise.all(
        playerList.map((playerId) => {
          const key = playerAnswersStorageKey(
            gameId,
            roundId,
            categoryId,
            playerId
          );
          return redis.hgetall(key);
        })
      )
    )
  );
  const anwsersData = answersUnflatData.reduce(
    (list, items) => list.concat(items),
    []
  );

  const decodedRoundData = Object.keys(roundData).reduce(
    (obj, key) => ({
      ...obj,
      [key]: tryDecode(roundData[key as keyof Round] as string),
    }),
    {} as Round
  );
  return {
    ...decodedRoundData,
    answers: categoriesIds.reduce(
      (obj, categoryId) => ({
        ...obj,
        [categoryId]: anwsersData
          .filter((a) => a && a.categoryId === categoryId)
          .map(formatRedisDataToAnswer),
      }),
      {}
    ),
  };
};

function formatRedisDataToAnswer(redisAnswerData: {
  [key: string]: string;
}): PlayerAnswer {
  return {
    answer: tryDecode(redisAnswerData.answer),
    playerId: tryDecode(redisAnswerData.playerId),
    ratings: Object.keys(redisAnswerData)
      .filter((key) => key.indexOf("rating-") === 0) // only keep keys starting with rating as they are the player ratings
      .map((key) => parseInt(key.replace("rating-", ""))) // only keep the index X from `rating-X`
      .sort((a, b) => a - b) // Sort to keep order in the array
      .map((key) => tryDecode(redisAnswerData[`rating-${key}`])), // Transform into boolean
  };
}

export async function getAllGames() {
  const transformKey = (redisKey: string) => {
    const prefixLength = gameStorageKey("").length;
    return redisKey.substr(prefixLength);
  };

  const keys = await redis.keys("game:*");
  const games = await Promise.all(
    keys.map((key) => getGame(transformKey(key)))
  );
  return games;
}

export const getPlayerGames = async (playerId: string): Promise<string[]> => {
  const games = await redis.smembers(playerGamesStorageKey(playerId));
  return games;
};
