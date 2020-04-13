import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameLobby.module.css";
import "../../App.css";
import { sendAction } from "../../websocket";
import { useSelector, useDispatch } from "react-redux";
import { selectGame, selectPlayerId } from "../../app/game";
import { startGame } from "../../actions/game";

function formatGameId(gameId: string) {
  return gameId.split("-")[0];
}

export function GameLobby() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const dispatch = useDispatch();

  useEffect(() => {
    sendAction({ action: "joingame", gameId: gameId });
  }, []);

  if (!game) {
    return <h1>"Loading"</h1>;
  }

  if (gameId !== game.id) {
    return <div>"Invalid state"</div>;
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
      <h1>Game {formatGameId(gameId)}</h1>
      <div className="box">
        <div className="subBox">
          <label>Joueurs</label>
          <span>{numberOfSlots}</span>
        </div>
        <div className="subBox">
          <label>Categories</label>
          <span>{game.categories.length}</span>
        </div>
        <div className="subBox">
          <label>Temps</label>
          <span>{game.rules.roundDuration}s</span>
        </div>
      </div>
      <div className={styles.players}>
        {playerList.map((player, i) => {
          if (player) {
            return (
              <div className={styles.playerBox} key={i}>
                <label>Player {i + 1}</label>
                <span>{player.name}</span>
              </div>
            );
          }
          return (
            <div
              className={`${styles.playerBox} ${styles.inactive}`}
              key={i}
            ></div>
          );
        })}
      </div>
      {playerId !== game.creator?.id ? undefined : (
        <button
          className="primary"
          onClick={() => gameId && dispatch(startGame(gameId))}
        >
          Commencer la partie
        </button>
      )}
      <button className="secondary">Copier le lien</button>
    </div>
  );
}
