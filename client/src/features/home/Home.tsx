import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./home.module.css";

export function Home() {
  let { gameId } = useParams();
  return (
    <div className="Container-home">
      <h1>Créer une nouvelle partie</h1>
      <Link to={`/game/1234/lobby`}><button className="Primary">nouvelle partie</button></Link>
    </div>
  );
}
