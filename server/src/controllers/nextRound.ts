import { Player, Game, GameState } from "../models/Game";
import { getSocketFromPlayerId } from "../services/socketStorage";
import {
  getGame,
  addPlayer,
  startGame,
  startNextRound,
} from "../services/gameStorage";

export async function nextRoundController(
  player: Player,
  { gameId }: { gameId?: string }
) {
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  await startNextRound(gameId);
}
