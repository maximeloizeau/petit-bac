import {
  Round,
  Game,
  Player,
  toPublicGame,
  GameState,
  toPublicRound,
} from "../models/Game";
import { gameEventEmitter } from "./gameEventEmitter";
import { getPlayer } from "./playerStorage";

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

export const removePlayer = async (gameId: string, player: Player) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  // Do not remove players after game started
  if (game.state !== GameState.WaitingLobby) {
    return game;
  }

  const playerIndex = game.playerIds.indexOf(player.id);
  game.playerIds.splice(playerIndex, 1);

  console.log(game.playerIds);
  gameEventEmitter.emit("gameupdate", toPublicGame(game));
  return game;
};

export const startGame = async (gameId: string) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  game.state = GameState.Starting;
  game.inProgress = true;

  await startNextRound(gameId);
};

export const nextRoundAvailable = (game: Game) => {
  const nextRoundIndex = game.currentRound + 1;

  const nextRound = game.rounds[nextRoundIndex];
  if (!nextRound) {
    return undefined;
  }

  game.currentRound = nextRoundIndex;
  return nextRound;
};

export const startNextRound = async (gameId: string) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const nextRound = nextRoundAvailable(game);
  if (!nextRound) {
    throw new Error("No more rounds to play");
  }

  game.state = GameState.RoundStarting;

  gameEventEmitter.emit("gameupdate", toPublicGame(game));

  let countdownValue = 5;
  const countdownSchedule: NodeJS.Timeout = setInterval(() => {
    if (countdownValue <= 0) {
      openRound(game, nextRound);
      clearInterval(countdownSchedule);
      return;
    }

    gameEventEmitter.emit(
      "countdownupdate",
      toPublicGame(game),
      --countdownValue
    );
  }, 1000);
};

export const openRound = async (game: Game, round: Round) => {
  game.state = GameState.RoundInProgress;
  round.started = true;

  gameEventEmitter.emit(
    "roundstarted",
    toPublicGame(game),
    toPublicRound(round)
  );

  let timerValue = game.rules.roundDuration;
  const timerSchedule: NodeJS.Timeout = setInterval(() => {
    if (timerValue <= 0) {
      closeRound(game.id, round.id);
      clearInterval(timerSchedule);
      return;
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

  game.state = GameState.RoundResult;
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

    const fillRating = answers[playerAnswerCategory] ? undefined : false;
    round.answers[playerAnswerCategory][playerIndex] = {
      answer: answers[playerAnswerCategory],
      playerId,
      ratings: game.playerIds.map((_) => fillRating),
    };
  }

  round.answersReceivedCount++;

  const currentPlayers = game.playerIds
    .map(getPlayer)
    .filter((player) => player && player.left !== true);

  if (round.answersReceivedCount >= currentPlayers.length) {
    game.roundsLeft--;
    gameEventEmitter.emit("gameupdate", toPublicGame(game));
    gameEventEmitter.emit("roundresults", toPublicGame(game), round);
  }
};

export function saveVote(
  voterId: string,
  gameId: string,
  roundId: string,
  categoryId: string,
  answerPlayerId: string,
  vote: boolean
) {
  const game = games.get(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const round = game.rounds.find((round) => round.id === roundId);
  if (!round) {
    throw new Error("Round does not exist");
  }

  const roundAnswers = round.answers[categoryId];
  if (!roundAnswers) {
    throw new Error("Category does not exist for this round");
  }

  const playerAnswer = roundAnswers.find((a) => a.playerId === answerPlayerId);
  if (!playerAnswer) {
    throw new Error("Player did not player for this round");
  }

  const voterIndex = game.playerIds.indexOf(voterId);
  playerAnswer.ratings[voterIndex] = vote;

  gameEventEmitter.emit("voteupdate", toPublicGame(game), round);
}

export async function getCurrentGame(
  playerId: string,
  inProgressOnly = true
): Promise<Game | undefined> {
  for (const [_, game] of games.entries()) {
    const playerInGame = game.playerIds.includes(playerId);
    const inProgressFind = !inProgressOnly || game.inProgress === true;

    if (playerInGame && inProgressFind) {
      return game;
    }
  }
}
