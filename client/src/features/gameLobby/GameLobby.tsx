import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameLobby.module.css";
import "../../App.css";
import { sendAction } from "../../websocket";
import { useSelector, useDispatch } from "react-redux";
import { selectGame, selectPlayerId, selectCountdown } from "../../app/game";
import { startGame } from "../../actions/game";
import { Loading } from "../loading/Loading";
import { formatGameId } from "../../utils/formatGameId";

function playerSlots(playerList: any[], slotCount: number) {
  let slots = [];
  let slotNumber = 0;
  while (slotNumber < slotCount) {
    slots.push(playerList[slotNumber] || undefined);
    slotNumber++;
  }
  return slots;
}

export function GameLobby() {
  let { gameId } = useParams();
  const playerId = useSelector(selectPlayerId);
  const game = useSelector(selectGame);
  const countdownTimer = useSelector(selectCountdown);
  const dispatch = useDispatch();

  useEffect(() => {
    sendAction({ action: "joingame", gameId: gameId });
  }, []);

  if (!game) {
    return <Loading />;
  }

  if (gameId !== game.id) {
    return <div>"Invalid state"</div>;
  }

  if (game.state === "round-starting") {
    return <div>{countdownTimer}</div>;
  }

  const numberOfSlots = 8;
  const playerList = playerSlots(game.players, numberOfSlots);

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
