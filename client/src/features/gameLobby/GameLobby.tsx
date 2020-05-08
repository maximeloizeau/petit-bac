import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameLobby.module.css";
import "../../App.css";
import { sendAction } from "../../websocket";
import { useSelector, useDispatch } from "react-redux";
import { selectGame, selectPlayerId, selectCountdown } from "../../app/game";
import { startGame, changeName } from "../../actions/game";
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

function shareLink(url: string) {
  const hello = "Rejoins moi pour une partie sur Graduo: ";
  const text = encodeURIComponent(hello + " " + url);
  const whatsappUrl =
    "https://api.whatsapp.com/send?phone=&text=" +
    text +
    "&source=&data=&app_absent=";
  return whatsappUrl;
}

function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
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
    return <Loading />;
  }

  if (gameId !== game.id) {
    return <div>"Invalid state"</div>;
  }

  if (game.state === "round-starting") {
    return (
      <div className="container center">
        <h3 className="loading-title">Chargement du round...</h3>
        <Loading />
      </div>
    );
  }

  const changeNamePrompt = (selectedPlayerId: string) => {
    if (selectedPlayerId !== playerId) {
      return;
    }

    const name = prompt("Change your name to?");
    if (!name || !game.id) {
      return;
    }

    dispatch(changeName(name, game.id));
  };

  const numberOfSlots = 8;
  const playerList = playerSlots(game.players, numberOfSlots);

  const lobbyUrl = window.location.href;

  return (
    <div>
      <div className={styles.headerLobby}>
        <h1>Game {formatGameId(gameId)}</h1>
        <div className={styles.shareLinks}>
          <button
            className="shareLink copy"
            onClick={() => copyToClipboard(lobbyUrl)}
          >
            Copier le lien
          </button>
          <a
            className="shareLink whatsapp"
            href={shareLink(lobbyUrl)}
            target="_blank"
          >
            <i className="fab fa-whatsapp"></i>Share on Whatsapp
          </a>
        </div>
      </div>
      <div className="box">
        <div className="subBox">
          <label>Joueurs</label>
          <span>
            {game.players.length}/{numberOfSlots}
          </span>
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
                <span onClick={() => changeNamePrompt(player.id)}>
                  {player.name}
                </span>
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
    </div>
  );
}
