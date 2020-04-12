import { sendAction } from "../websocket";

export const GAME_LOADING = "game-loading";

export function createNewGame() {
  sendAction({ action: "newgame" });

  return {
    type: GAME_LOADING,
  };
}
