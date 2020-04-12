import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameRound.module.css";

export function GameRound() {
  let { gameId } = useParams();
  return (
    <div>
      <h1>Game {gameId}</h1>
      <p>Now playing</p>
      <ul>
        <li>
          Nom d'oiseau: <input></input>
        </li>
      </ul>
    </div>
  );
}
