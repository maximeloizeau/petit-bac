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
} from "../../../../server/src/models/Game";
import { nextRound, voteForAnswer } from "../../actions/game";

export function GameVote() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const roundResults = useSelector(selectRoundResults);
  const dispatch = useDispatch();

  if (!game || !gameId || !roundResults) {
    return <div>Unable to display results: gameId is not set</div>;
  }

  return (
    <div>
      <h1>Game {gameId}</h1>

      {game.categories.map((category) =>
        ResultCategory(game.id, category, roundResults)
      )}

      {playerId !== game.creator?.id ? undefined : (
        <button
          className="primary"
          onClick={() => dispatch(nextRound(game.id))}
        >
          Next round
        </button>
      )}
    </div>
  );
}

function ResultCategory(
  gameId: string,
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
        PlayerAnswerLine(gameId, roundResults.id, category.id, answer)
      )}
    </div>
  );
}

function PlayerAnswerLine(
  gameId: string,
  roundId: string,
  categoryId: string,
  answer: PlayerAnswer
) {
  console.log(categoryId, answer.ratings);
  const dispatch = useDispatch();
  return (
    <div className="form" key={answer.playerId + categoryId}>
      <div className={styles.rowResult}>
        <label className={styles.player}>Player 1</label>
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
              onClick={() =>
                dispatch(
                  voteForAnswer(
                    gameId,
                    roundId,
                    categoryId,
                    answer.playerId,
                    true
                  )
                )
              }
            >
              Yes
            </button>
            <button
              className={`${styles.disapprove} ${styles.action} `}
              onClick={() =>
                dispatch(
                  voteForAnswer(
                    gameId,
                    roundId,
                    categoryId,
                    answer.playerId,
                    false
                  )
                )
              }
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
