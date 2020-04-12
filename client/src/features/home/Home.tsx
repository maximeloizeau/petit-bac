import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./Home.module.css";
import { Loading } from "../loading/Loading";


export function Home() {
  let { gameId } = useParams();
  return (
    <div className="container-home">
      <h1>Créer une <br></br>nouvelle partie</h1>
      <div className="form">
        <label>Entre ton nom</label>
        <input></input>
      </div>
      <Link to={`/game/1234/lobby`}><button className="primary">nouvelle partie</button></Link>
      <Loading />
      
    </div>
  );
}
