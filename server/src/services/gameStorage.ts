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

  if (game.players.find((p) => p.id === player.id)) {
    gameEventEmitter.emit("gameupdate", toPublicGame(game));
    return game;
  }

  game.players.push(player);

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

  gameEventEmitter.emit(
    "roundstarted",
    toPublicGame(game),
    toPublicRound(nextRound)
  );
};
