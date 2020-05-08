import { Player, Game, GameState } from "../models/Game";
import { startNextRound } from "../services/gameService";

export async function nextRoundController(
  player: Player,
  { gameId }: { gameId?: string }
) {
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  await startNextRound(gameId);
}
