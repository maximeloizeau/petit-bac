import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameRound.module.css";
import "../../App.css";

export function GameRound() {
  let { gameId } = useParams();
  return (
    <div className="">
      <h1>Game {gameId}</h1>
      <div className={styles.twoBoxes}>
        <div className={` ${styles.boxOne} box `}>
          <div className="subBox center">
            <label>Lettre</label>
            <span>A</span>
          </div>
        </div>
        <div className={` ${styles.boxTwo} box `}>
          <div className="subBox center">
            <label>Temps</label>
            <span>30:00</span>
          </div>
        </div>
      </div>
      <div className={styles.formAnswers}>
        <label>Categorie 1</label>
        <input></input>
        <label>Categorie 1</label>
        <input></input>
        <label>Categorie 1</label>
        <input></input>
        <label>Categorie 1</label>
        <input></input>
        <label>Categorie 1</label>
        <input></input>
        <label>Categorie 1</label>
        <input></input>
      </div>
    </div>
  );
}
