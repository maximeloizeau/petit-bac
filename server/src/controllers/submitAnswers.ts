import { Player, Game, GameState } from "../models/Game";
import { getSocketFromPlayerId } from "../services/socketStorage";
import {
  getGame,
  addPlayer,
  startGame,
  saveAnswers,
} from "../services/gameStorage";

export async function submitAnswersController(
  player: Player,
  {
    gameId,
    roundId,
    answers,
  }: {
    gameId?: string;
    roundId?: string;
    answers?: Array<{ categoryId: string; answer: string }>;
  }
) {
  if (!gameId || !roundId || !answers) {
    throw new Error("Invalid game id or round id");
  }

  const gameInfo = await getGame(gameId);

  await saveAnswers(player.id, gameId, roundId, answers);
}
