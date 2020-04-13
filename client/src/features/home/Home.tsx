import React, { useState } from "react";
// import { Loading } from "../loading/Loading";
import { createNewGame } from "../../actions/game";
import { useDispatch } from "react-redux";

export function Home() {
  const dispatch = useDispatch();
  const [closeState, setCloseState] = useState("close");
  
  const toggleCloseState = () => {
    setCloseState(closeState === "close" ? "open" : "close");
  }

  return ( 
    <div className="container">
      <h1>
      Welcome to graduator
      </h1>
      <div className={`accordeon ${closeState}`} onClick={toggleCloseState}>
        <h3>Comment jouer?</h3>
        <i className="fa fa-plus"></i>
        <p className="rules">This is a rule</p>
      </div>
      <div className="form">
        <h2>
          Créer une nouvelle partie
        </h2>
        <label>Entre ton nom</label>
        <input></input>
      </div>
      <button onClick={() => dispatch(createNewGame())} className="primary">
        Créer une nouvelle partie
      </button>
    </div>
  );
}
