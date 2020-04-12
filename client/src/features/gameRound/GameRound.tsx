import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameRound.module.css";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectGame,
  selectPlayerId,
  selectRound,
  selectRoundTimer,
  updateAnwser,
  selectAnswers,
} from "../../app/game";

export function GameRound() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const round = useSelector(selectRound);
  const roundTimer = useSelector(selectRoundTimer);
  const answers = useSelector(selectAnswers);
  const dispatch = useDispatch();

  if (round?.ended) {
    return <div>Loading</div>;
  }

  return (
    <div className="">
      <h1>Game {gameId}</h1>
      <div className="twoBoxes">
        <div className="boxOne box">
          <div className="subBox center">
            <label>Lettre</label>
            <span>{round?.letter}</span>
          </div>
        </div>
        <div className="boxTwo box">
          <div className="subBox center">
            <label>Temps</label>
            <span>{round?.ended ? "Fin" : roundTimer}</span>
          </div>
        </div>
      </div>
      <div className="form">
        {game?.categories.map((category) => (
          <div key={category.id}>
            <label>{category.name}</label>
            <input
              type="text"
              onChange={(evt) =>
                dispatch(
                  updateAnwser({
                    categoryId: category.id,
                    answer: evt.target.value,
                  })
                )
              }
              value={answers.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
