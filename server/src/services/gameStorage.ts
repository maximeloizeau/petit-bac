import {
  Game,
  Player,
  toPublicGame,
  GameState,
  toPublicRound,
} from "../models/Game";
import { gameEventEmitter } from "./gameEventEmitter";

const games = new Map<string, Game>();

export const saveGame = async (gameId: string, gameDetails: Game) => {
  games.set(gameId, gameDetails);
  return gameDetails;
};

export const getGame = async (gameId: string) => {
  return games.get(gameId);
};

export const addPlayer = async (gameId: string, player: Player) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  if (game.playerIds.find((playerId: string) => playerId === player.id)) {
    gameEventEmitter.emit("gameupdate", toPublicGame(game));
    return game;
  }

  game.playerIds.push(player.id);

  gameEventEmitter.emit("gameupdate", toPublicGame(game));
  return game;
};

export const startGame = async (gameId: string) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  game.state = GameState.InProgress;

  await startNextRound(gameId);
};

export const startNextRound = async (gameId: string) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const nextRound = game.rounds.find((round) => round.started !== true);
  if (!nextRound) {
    throw new Error("No more rounds to play");
  }

  nextRound.started = true;

  gameEventEmitter.emit(
    "roundstarted",
    toPublicGame(game),
    toPublicRound(nextRound)
  );

  let timerValue = game.rules.roundDuration;
  const timerSchedule: NodeJS.Timeout = setInterval(() => {
    if (timerValue <= 0) {
      closeRound(gameId, nextRound.id);
      clearInterval(timerSchedule);
    }

    gameEventEmitter.emit("roundtimerupdate", toPublicGame(game), --timerValue);
  }, 1000);
};

export const closeRound = async (gameId: string, roundId: string) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const round = game.rounds.find((round) => round.id === roundId);
  if (!round) {
    throw new Error("Round does not exist");
  }

  round.ended = true;

  gameEventEmitter.emit("roundended", toPublicGame(game), toPublicRound(round));
};

// TODO: extract outside storage
export const saveAnswers = async (
  playerId: string,
  gameId: string,
  roundId: string,
  answers: { [key: string]: string }
) => {
  const game = games.get(gameId);

  if (!game) {
    throw new Error("Game does not exist");
  }

  const round = game.rounds.find((round) => round.id === roundId);
  if (!round) {
    throw new Error("Round does not exist");
  }

  const playerIndex = game.playerIds.findIndex(
    (pId: string) => pId === playerId
  );

  for (const playerAnswerCategory of Object.keys(answers)) {
    const validCategory = Boolean(
      game.categories.find((c) => c.id === playerAnswerCategory)
    );
    if (!validCategory) continue;

    round.answers[playerAnswerCategory][playerIndex] = {
      answer: answers[playerAnswerCategory],
      playerId,
      ratings: game.playerIds.map((_) => undefined),
    };
  }

  round.answersReceivedCount++;

  if (round.answersReceivedCount === game.playerIds.length) {
    gameEventEmitter.emit("roundresults", toPublicGame(game), round);
  }
};

// TODO: refactor user profile outside
export const markPlayerLeft = async (playerId: string) => {
  for (const [_, game] of games.entries()) {
    const playerInGame = "";
  }
};
