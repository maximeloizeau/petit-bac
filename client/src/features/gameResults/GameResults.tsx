import React from "react";
import { useParams } from "react-router-dom";
import "../../App.css";

export function GameResults() {
  let { gameId } = useParams();
  return (
    <div>
      <h1>Game {gameId}</h1>
      <div className="box white">
        <div className="subBox center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box large">
        <div className="subBox  center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box medium">
        <div className="subBox  center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box small">
        <div className="subBox center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box small">
        <div className="subBox center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box small">
        <div className="subBox center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box small">
        <div className="subBox center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <div className="box small">
        <div className="subBox center">
          <span>Player 1</span>
          <label>1000 points</label>
        </div>
      </div>
      <button className="secondary">Play again</button>
    </div>
  );
}
