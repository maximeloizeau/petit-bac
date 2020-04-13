import { Player, toPublicGame } from "../models/Game";
import { getGame } from "../services/gameStorage";
import { gameEventEmitter } from "../services/gameEventEmitter";

export async function displayGameResultsController(
  player: Player,
  {
    gameId,
  }: {
    gameId?: string;
  }
) {
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  const game = await getGame(gameId);
  if (!game) {
    throw new Error("Game does not exist");
  }

  if (game.roundsLeft !== 0) {
    throw new Error("All rounds have not been completed");
  }

  const playerScores: { [key: string]: number } = {};
  game.rounds.forEach((round) => {
    Object.keys(round.answers).forEach((categoryId) => {
      round.answers[categoryId].forEach((playerAnswer) => {
        const yesVotes = playerAnswer.ratings.filter(
          (rating) => rating === true
        ).length;
        const noVotes = playerAnswer.ratings.filter(
          (rating) => rating === false
        ).length;
        if (yesVotes > noVotes) {
          playerScores[playerAnswer.playerId] =
            (playerScores[playerAnswer.playerId] || 0) + 1;
        }
      });
    });
  });

  game.scoreboard = Object.keys(playerScores)
    .map((playerId) => ({
      playerId,
      score: playerScores[playerId],
    }))
    .sort((a, b) => a.score - b.score);

  gameEventEmitter.emit("gameresults", toPublicGame(game));
}
