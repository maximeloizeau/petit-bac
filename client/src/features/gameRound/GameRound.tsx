import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameRound.module.css";
import "../../App.css";
import { useSelector } from "react-redux";
import {
  selectGame,
  selectPlayerId,
  selectRound,
  selectRoundTimer,
} from "../../app/game";

export function GameRound() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const round = useSelector(selectRound);
  const roundTimer = useSelector(selectRoundTimer);

  return (
    <div className="">
      <h1>Game {gameId}</h1>
      <div className={styles.twoBoxes}>
        <div className={` ${styles.boxOne} box `}>
          <div className="subBox center">
            <label>Lettre</label>
            <span>{round?.letter}</span>
          </div>
        </div>
        <div className={` ${styles.boxTwo} box `}>
          <div className="subBox center">
            <label>Temps</label>
            <span>{round?.ended ? "Fin" : roundTimer}</span>
          </div>
        </div>
      </div>
      <div className={styles.formAnswers}>
        {game?.categories.map((category) => (
          <div key={category.id}>
            <label>{category.name}</label>
            <input></input>
          </div>
        ))}
      </div>
    </div>
  );
}
