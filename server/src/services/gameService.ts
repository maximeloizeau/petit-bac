import { createHandyClient } from "handy-redis";
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
import {
  getGame,
  saveGame,
  addPlayer,
  removePlayer,
  getPlayerGames,
  saveRound,
  saveAnswers,
  saveRating,
  getRound,
  incrementRoundAnswerReceivedCount,
} from "./gameStorage";

export const addPlayerToGame = async (gameId: string, player: Player) => {
  const updated = await addPlayer(gameId, player);
};

export const removePlayerFromGame = async (gameId: string, player: Player) => {
  let game = await getGame(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  // Do not remove players after game started
  if (game.state !== GameState.WaitingLobby) {
    return game;
  }

  await removePlayer(gameId, player);
};

export const startGame = async (gameId: string) => {
  const game = await getGame(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  await saveGame(gameId, { state: GameState.Starting, inProgress: true });

  await startNextRound(gameId);
};

export const nextRoundAvailable = (game: Game): [Round | undefined, number] => {
  const nextRoundIndex = game.currentRound + 1;

  const nextRound = game.rounds[nextRoundIndex];
  if (!nextRound) {
    return [undefined, -1];
  }

  return [nextRound, nextRoundIndex];
};

export const startNextRound = async (gameId: string) => {
  const game = await getGame(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const [nextRound, nextRoundIndex] = nextRoundAvailable(game);
  if (!nextRound) {
    throw new Error("No more rounds to play");
  }

  await saveGame(gameId, {
    state: GameState.RoundStarting,
    currentRound: nextRoundIndex,
  });

  let countdownValue = 5;
  const countdownSchedule: NodeJS.Timeout = setInterval(async () => {
    if (countdownValue <= 0) {
      openRound(game, nextRound);
      clearInterval(countdownSchedule);
      return;
    }

    gameEventEmitter.emit(
      "countdownupdate",
      await toPublicGame(game),
      --countdownValue
    );
  }, 1000);
};

export const openRound = async (game: Game, round: Round) => {
  const upToDateGame = await saveGame(game.id, {
    state: GameState.RoundInProgress,
  }); //, started: true

  gameEventEmitter.emit(
    "roundstarted",
    await toPublicGame(upToDateGame),
    toPublicRound(round)
  );

  let timerValue = game.rules.roundDuration;
  const timerSchedule: NodeJS.Timeout = setInterval(async () => {
    if (timerValue <= 0) {
      closeRound(game.id, round.id);
      clearInterval(timerSchedule);
      return;
    }

    gameEventEmitter.emit(
      "roundtimerupdate",
      await toPublicGame(game),
      --timerValue
    );
  }, 1000);
};

export const closeRound = async (gameId: string, roundId: string) => {
  const game = await getGame(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const round = game.rounds.find((round) => round.id === roundId);
  if (!round) {
    throw new Error("Round does not exist");
  }

  const updatedRound = await saveRound(gameId, roundId, { ended: true });
  const upToDateGame = await saveGame(gameId, {
    state: GameState.RoundResult,
  });

  gameEventEmitter.emit(
    "roundended",
    await toPublicGame(upToDateGame),
    toPublicRound(updatedRound)
  );
};

export const savePlayerAnswers = async (
  playerId: string,
  gameId: string,
  roundId: string,
  answers: { [key: string]: string }
) => {
  const game = await getGame(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  const round = game.rounds.find((round) => round.id === roundId);
  if (!round) {
    throw new Error("Round does not exist");
  }

  for (const playerAnswerCategory of Object.keys(answers)) {
    const validCategory = Boolean(
      game.categories.find((c) => c.id === playerAnswerCategory)
    );
    if (!validCategory) continue;

    const fillRating = answers[playerAnswerCategory] ? undefined : false;
    await saveAnswers(gameId, roundId, playerAnswerCategory, playerId, {
      answer: answers[playerAnswerCategory],
      ratings: game.playerIds.map((_) => fillRating),
    });
  }

  const answersReceivedCount = await incrementRoundAnswerReceivedCount(
    gameId,
    roundId
  );

  const updatedRound = await getRound(
    gameId,
    roundId,
    game.categories.map((c) => c.id),
    game.playerIds
  );

  const currentPlayers = (
    await Promise.all(game.playerIds.map(getPlayer))
  ).filter((player) => player && player.left !== true); // TODO: rewrite this

  if (answersReceivedCount >= currentPlayers.length) {
    let updatedGame = await saveGame(game.id, {
      roundsLeft: game.roundsLeft - 1,
    });
    gameEventEmitter.emit("gameupdate", await toPublicGame(updatedGame));
    gameEventEmitter.emit(
      "roundresults",
      await toPublicGame(updatedGame),
      updatedRound
    );
  }
};

export async function saveVote(
  voterId: string,
  gameId: string,
  roundId: string,
  categoryId: string,
  answerPlayerId: string,
  vote: boolean
) {
  const game = await getGame(gameId);
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

  const playerAnswer = roundAnswers.find(
    (a) => a && a.playerId === answerPlayerId
  );
  if (!playerAnswer) {
    throw new Error("Player did not player for this round");
  }

  const voterIndex = game.playerIds.indexOf(voterId);
  await saveRating(
    gameId,
    roundId,
    categoryId,
    answerPlayerId,
    voterIndex,
    vote
  );

  const updatedRound = await getRound(
    gameId,
    roundId,
    game.categories.map((c) => c.id),
    game.playerIds
  );
  gameEventEmitter.emit("voteupdate", await toPublicGame(game), updatedRound);
}

export async function getCurrentGame(
  playerId: string,
  inProgressOnly = true
): Promise<Game | undefined> {
  const playerGames = await getPlayerGames(playerId);

  const games = await Promise.all(playerGames.map(getGame));

  if (inProgressOnly) {
    return games.filter((game) => game.inProgress)[0];
  }

  return games[0];
}
