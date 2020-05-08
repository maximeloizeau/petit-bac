import { Player } from "../models/Game";
import { saveVote } from "../services/gameService";

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
