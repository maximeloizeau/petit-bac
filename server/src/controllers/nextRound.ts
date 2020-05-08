import { Player, Game, GameState } from "../models/Game";
import { startNextRound } from "../services/gameService";
import { displayGameResultsController } from "./displayGameResults";

export async function nextRoundController(
  player: Player,
  { gameId }: { gameId?: string }
) {
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  try {
    await startNextRound(gameId);
  } catch (err) {
    if (err.message === "No more rounds to play") {
      await displayGameResultsController(player, { gameId });
    }
  }
}
