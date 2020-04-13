import React from "react";
import { useParams } from "react-router-dom";
import styles from "./GameVote.module.css";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPlayerId,
  selectGame,
  selectRoundResults,
  selectCategoryVoteAnswers,
} from "../../app/game";
import {
  Round,
  Category,
  PlayerAnswer,
  Game,
  PublicGame,
} from "../../../../server/src/models/Game";
import {
  nextRound,
  voteForAnswer,
  displayGameResults,
} from "../../actions/game";

export function GameVote() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const roundResults = useSelector(selectRoundResults);
  const dispatch = useDispatch();

  if (!game || !gameId || !roundResults || !game.creator) {
    return <div>Unable to display results: game not loaded correctly</div>;
  }

  return (
    <div>
      <h1>Game {gameId}</h1>

      {game.categories.map((category) =>
        ResultCategory(game, category, roundResults)
      )}

      {playerId === game.creator.id && game.roundsLeft > 0 ? (
        <button
          className="primary"
          onClick={() => dispatch(nextRound(game.id))}
        >
          Next round
        </button>
      ) : undefined}
      {playerId === game.creator.id && game.roundsLeft === 0 ? (
        <button
          className="primary"
          onClick={() => dispatch(displayGameResults(game.id))}
        >
          Display results
        </button>
      ) : undefined}
    </div>
  );
}

function ResultCategory(
  game: PublicGame,
  category: Category,
  roundResults: Round
) {
  const playerAnswers = useSelector((state) =>
    selectCategoryVoteAnswers(state as any, category.id)
  );

  console.log("render");
  return (
    <div key={"results" + category.id}>
      <div className="twoBoxes">
        <div className="boxOne box">
          <div className="subBox center">
            <label>Lettre</label>
            <span>{roundResults?.letter}</span>
          </div>
        </div>
        <div className="boxTwo box">
          <div className="subBox center">
            <label>Categorie</label>
            <span>{category.name}</span>
          </div>
        </div>
      </div>
      {playerAnswers.map((answer) =>
        PlayerAnswerLine(game, roundResults.id, category.id, answer)
      )}
    </div>
  );
}

function PlayerAnswerLine(
  game: PublicGame,
  roundId: string,
  categoryId: string,
  answer: PlayerAnswer
) {
  const dispatch = useDispatch();

  const vote = (voteValue: boolean) =>
    dispatch(
      voteForAnswer(game.id, roundId, categoryId, answer.playerId, voteValue)
    );
  const voteYes = () => vote(true);
  const voteNo = () => vote(false);

  const player = game.players.find(
    (player) => player && player.id === answer.playerId
  );
  const playerName = (player && player.name) || "Player";

  return (
    <div className="form" key={answer.playerId + categoryId}>
      <div className={styles.rowResult}>
        <label className={styles.player}>{playerName}</label>
        <div className={styles.rowActions}>
          <div className={styles.votes}>
            <span className={styles.result}>{answer.answer}</span>
          </div>
          <div className={styles.votes}>
            <div className={styles.rounds}>
              {answer.ratings.map((rating, i) => (
                <div
                  className={`${styles.round} ${
                    rating === true ? styles.approved : ""
                  } ${rating === false ? styles.disapproved : ""}`}
                  key={i + "rating" + categoryId}
                ></div>
              ))}
            </div>
            <button
              className={`${styles.approve} ${styles.action} `}
              onClick={voteYes}
            >
              👍
            </button>
            <button
              className={`${styles.disapprove} ${styles.action} `}
              onClick={voteNo}
            >
              👎
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
