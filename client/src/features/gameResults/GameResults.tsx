import React from "react";
import { useParams, Link } from "react-router-dom";
import "../../App.css";
import { useSelector } from "react-redux";
import { selectGame } from "../../app/game";

export function GameResults() {
  let { gameId } = useParams();
  const game = useSelector(selectGame);

  console.log(JSON.stringify(game));
  return (
    <div>
      <h1>Game {gameId}</h1>

      {game?.scoreboard.map((score, i) => {
        let boxClass;
        switch (i) {
          case 0:
            boxClass = "white";
            break;
          case 1:
            boxClass = "large";
            break;
          case 2:
            boxClass = "medium";
            break;
          default:
            boxClass = "small";
            break;
        }

        const player = game.players.find(
          (player) => player && player.id === score.playerId
        );
        const displayName = (player && player.name) || "Player";
        return (
          <div className={`box ${boxClass}`} key={score.playerId}>
            <div className="subBox center">
              <span>{displayName}</span>
              <label>{score.score} points</label>
            </div>
          </div>
        );
      })}
      <Link to="/">
        <button className="secondary">Play again</button>
      </Link>
    </div>
  );
}
