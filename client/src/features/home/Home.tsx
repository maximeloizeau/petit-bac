import React from "react";
// import { Loading } from "../loading/Loading";
import { createNewGame } from "../../actions/game";
import { useDispatch } from "react-redux";

export function Home() {
  const dispatch = useDispatch();

  return (
    <div className="container">
      <h1>
        Créer une <br></br>nouvelle partie
      </h1>
      <div className="form">
        <label>Entre ton nom</label>
        <input></input>
      </div>
      <button onClick={() => dispatch(createNewGame())} className="primary">
        nouvelle partie
      </button>
      {/* <Loading /> */}
    </div>
  );
}
