import { Player, toPublicGame, GameState } from "../models/Game";
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

  game.state = GameState.GameResult;
  game.inProgress = false;

  const playerScores = game.playerIds.reduce(
    (scores, playerId) => ({
      ...scores,
      [playerId]: 0,
    }),
    {} as { [key: string]: number }
  );
  game.rounds.forEach((round) => {
    Object.keys(round.answers).forEach((categoryId) => {
      round.answers[categoryId].forEach((playerAnswer) => {
        const yesVotes = playerAnswer.ratings.filter(
          (rating) => rating === true
        ).length;
        const noVotes = playerAnswer.ratings.filter(
          (rating) => rating === false
        ).length;

        let scoreIncrement;
        if (yesVotes > noVotes) {
          scoreIncrement = 2;
        } else if (yesVotes === noVotes) {
          scoreIncrement = 1;
        } else {
          scoreIncrement = 0;
        }

        playerScores[playerAnswer.playerId] =
          playerScores[playerAnswer.playerId] + scoreIncrement;
      });
    });
  });

  game.scoreboard = Object.keys(playerScores)
    .map((playerId) => ({
      playerId,
      score: playerScores[playerId],
    }))
    .sort((a, b) => b.score - a.score);

  gameEventEmitter.emit("gameresults", await toPublicGame(game));
}
