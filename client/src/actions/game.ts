import { sendAction } from "../websocket";

export const GAME_LOADING = "game-loading";
export const ROUND_LOADING = "round-loading";

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
