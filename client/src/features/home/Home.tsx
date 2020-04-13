import React, { useState } from "react";
// import { Loading } from "../loading/Loading";
import { createNewGame } from "../../actions/game";
import { useDispatch } from "react-redux";

export function Home() {
  const dispatch = useDispatch();
  const [closeState, setCloseState] = useState("open");
  
  const toggleCloseState = () => {
    setCloseState(closeState === "close" ? "open" : "close");
  }

  return ( 
    <div className="container">
      <h1>
      Welcome to Graduo
      </h1>
      <div className={`accordeon ${closeState}`}>
        <div className="accordeon-title" onClick={toggleCloseState}> 
          <h3>Comment jouer?</h3>
          <i className={`${closeState === "close" ? "fa fa-plus" : "fa fa-minus"}` }></i> 
        </div>
        <div className="rules">
          <h4>Crée une nouvelle partie</h4>
          <p>Invite tes amis en leur partageant le lien.</p>
          <h4>Lance la partie</h4>
          <p>Une lettre va s'afficher sur ton écran lorsque le round commence. Tu devras alors trouver un mot pour chaque catégorie. Attention, le temps est compté!</p>
          <h4>Gagne la partie</h4>
          <p>A la fin de la partie, chaque joueur devra voter pour valider les mots proposés. Un mot valide te rapportera 1 point.</p>
        </div>
        </div>
      {/* <div className="form">
        <h2>
          Créer une nouvelle partie
        </h2>
        <label>Entre ton nom</label>
        <input></input>
      </div> */}
      <button onClick={() => dispatch(createNewGame())} className="primary">
        Créer une nouvelle partie
      </button>
    </div>
  );
}
