import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./GameLobby.module.css";
import "../../App.css";
import { sendAction } from "../../websocket";

export function GameLobby() {
  let { gameId } = useParams();

  useEffect(() => {
    sendAction({ action: "joingame", gameId: gameId });
  }, []);

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
        <div className={`${styles.playerBox} ${styles.inactive}`}></div>
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
      <Link to={`/game/1234/round`}>
        <button className="Primary">Commencer la partie</button>
      </Link>
      <p>Waiting for more players</p>
      <Link to={`/game/${gameId}/round`}>Play next round</Link>
    </div>
  );
}
