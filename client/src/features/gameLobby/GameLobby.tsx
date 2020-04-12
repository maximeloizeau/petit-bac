import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./GameLobby.module.css";
import "../../App.css";

export function GameLobby() {
  let { gameId } = useParams();
  return (
    <div>
      <h1>Game {gameId}</h1>
      <div className="box">
        <div className="subBox">
          <label>Joueurs</label>
          <span>8</span>
        </div>
        <div className="subBox">
          <label>Categories</label>
          <span>6</span>
        </div>
        <div className="subBox">
          <label>Temps</label>
          <span>30s</span>
        </div>
      </div>
      <div className={styles.players}>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        <div className={`${styles.playerBox} ${styles.inactive}`}>

        </div>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        <div className={styles.playerBox}>
          <label>Player 1</label>
          <span>Julia Dirand</span>
        </div>
        
      </div>
      <Link to={`/game/1234/round`}><button className="primary">Commencer la partie</button></Link>
      <button className="secondary">Copier le lien</button>
      <Link to={`/game/${gameId}/round`}>Play next round</Link>
    </div>
  );
}
