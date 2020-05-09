import { Player } from "../models/Game";
import { savePlayerAnswers } from "../services/gameService";

export async function submitAnswersController(
  player: Player,
  {
    gameId,
    roundId,
    answers,
  }: {
    gameId?: string;
    roundId?: string;
    answers?: { [key: string]: string };
  }
) {
  if (!gameId || !roundId || !answers) {
    throw new Error("Invalid game id or round id");
  }

  await savePlayerAnswers(player.id, gameId, roundId, answers);
}
