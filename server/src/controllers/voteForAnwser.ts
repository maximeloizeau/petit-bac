import { Player, Game, GameState } from "../models/Game";
import { getSocketFromPlayerId } from "../services/socketStorage";
import {
  getGame,
  addPlayer,
  startGame,
  startNextRound,
  saveVote,
} from "../services/gameStorage";

export async function voteForAnswerController(
  player: Player,
  {
    gameId,
    roundId,
    categoryId,
    answerPlayerId,
    vote,
  }: {
    gameId?: string;
    roundId?: string;
    categoryId?: string;
    answerPlayerId?: string;
    vote?: boolean;
  }
) {
  if (!gameId || !roundId || !answerPlayerId || !categoryId) {
    throw new Error("Invalid game id, round id, player id or category id");
  }

  await saveVote(player.id, gameId, roundId, categoryId, answerPlayerId, vote!);
}
