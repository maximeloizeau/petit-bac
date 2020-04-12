import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./GameLobby.module.css";
import "../../App.css";
import { sendAction } from "../../websocket";
import { useSelector, useDispatch } from "react-redux";
import { selectGame } from "../../app/game";

export function GameLobby() {
  let { gameId } = useParams();
  const game = useSelector(selectGame);
  const dispatch = useDispatch();

  useEffect(() => {
    sendAction({ action: "joingame", gameId: gameId });
  }, []);

  if (!game) {
    return <h1>"Loading"</h1>;
  }

  const numberOfSlots = 8;

  let playerList = [];
  let slotNumber = 0;
  while (slotNumber < numberOfSlots) {
    playerList.push(game.players[slotNumber] || undefined);
    slotNumber++;
  }

  return (
    <div>
      <h1>Game {gameId}</h1>
      <div className="box">
        <div className="subBox">
          <label>Joueurs</label>
          <span>{numberOfSlots}</span>
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
        {playerList.map((player, i) => {
          if (player) {
            return (
              <div className={styles.playerBox}>
                <label>Player {1}</label>
                <span>{player.name}</span>
              </div>
            );
          }
          return (
            <div className={`${styles.playerBox} ${styles.inactive}`}></div>
          );
        })}
      </div>
      <Link to={`/game/1234/round`}>
        <button className="Primary">Commencer la partie</button>
      </Link>
      <p>Waiting for more players</p>
      <Link to={`/game/${gameId}/round`}>Play next round</Link>
    </div>
  );
}
