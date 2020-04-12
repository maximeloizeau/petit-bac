import React from "react";
import { useDispatch } from "react-redux";
import styles from "./home.module.css";
import { createNewGame } from "../../actions/game";

export function Home() {
  const dispatch = useDispatch();

  return (
    <div className="Container-home">
      <h1>Créer une nouvelle partie</h1>
      <button className="Primary" onClick={() => dispatch(createNewGame())}>
        nouvelle partie
      </button>
    </div>
  );
}
