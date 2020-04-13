import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameVote.module.css";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPlayerId,
  selectGame,
  selectAnswers,
  selectRound,
  selectRoundResults,
} from "../../app/game";
import {
  Round,
  Category,
  PlayerAnswer,
} from "../../../../server/src/models/Game";
import { nextRound } from "../../actions/game";

export function GameVote() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const roundResults = useSelector(selectRoundResults);
  const dispatch = useDispatch();

  const categoryIndex = 0;

  return (
    <div>
      <h1>Game {gameId}</h1>

      {game?.categories.map((category) =>
        ResultCategory(category, roundResults)
      )}

      {playerId !== game?.creator?.id ? undefined : (
        <button
          className="primary"
          onClick={() => gameId && dispatch(nextRound(gameId))}
        >
          Next round
        </button>
      )}
    </div>
  );
}

function ResultCategory(category: Category, roundResults?: Round) {
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
      {roundResults?.answers[category.id].map((answer) =>
        PlayerAnswerLine(category.id, answer)
      )}
    </div>
  );
}

function PlayerAnswerLine(categoryId: string, answer: PlayerAnswer) {
  return (
    <div className="form" key={answer.playerId + categoryId}>
      <div className={styles.rowResult}>
        <label className={styles.player}>Player 1</label>
        <div className={styles.rowActions}>
          <div className={styles.votes}>
            <span className={styles.result}>{answer.answer}</span>
            <div className={styles.rounds}>
              {answer.ratings.map((rating, i) => (
                <div
                  className={`${styles.round} `}
                  key={i + "rating" + categoryId}
                ></div>
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <button className={`${styles.approve} ${styles.action} `}>
              Yes
            </button>
            <button className={`${styles.disapprove} ${styles.action} `}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
