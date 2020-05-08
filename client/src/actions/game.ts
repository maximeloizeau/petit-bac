import { sendAction } from "../websocket";

export const GAME_LOADING = "game-loading";
export const ROUND_LOADING = "round-loading";
export const VOTE_LOADING = "vote-loading";
export const GAME_RESULTS_LOADING = "game-results-loading";
export const CHANGE_NAME = "change-name";

export function createNewGame() {
  sendAction({ action: "newgame" });

  return {
    type: GAME_LOADING,
  };
}

export function startGame(gameId: string) {
  sendAction({ action: "startgame", gameId: gameId });

  return {
    type: ROUND_LOADING,
  };
}

export function nextRound(gameId: string) {
  sendAction({ action: "nextround", gameId: gameId });

  return {
    type: ROUND_LOADING,
  };
}

export function displayGameResults(gameId: string) {
  sendAction({ action: "displaygameresults", gameId: gameId });

  return {
    type: GAME_RESULTS_LOADING,
  };
}

export function changeName(name: string, gameId: string) {
  sendAction({ action: "changename", name, gameId });

  return {
    type: CHANGE_NAME,
  };
}

export function voteForAnswer(
  gameId: string,
  roundId: string,
  categoryId: string,
  answerPlayerId: string,
  vote: boolean
) {
  sendAction({
    action: "voteanswer",
    gameId,
    roundId,
    categoryId,
    answerPlayerId,
    vote,
  });

  return {
    type: VOTE_LOADING,
  };
}
