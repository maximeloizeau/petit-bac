import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./GameLobby.module.css";

export function GameLobby() {
  let { gameId } = useParams();
  return (
    <div>
      <h1>Game {gameId}</h1>
      <p>Waiting for more players</p>
      <Link to={`/game/${gameId}/round`}>Play next round</Link>
    </div>
  );
}
