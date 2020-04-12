import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GameResults.module.css";
import "../../App.css";

export function GameResults() {
  let { gameId } = useParams();
  return (
    <div className="">
      <h1>Game {gameId}</h1>
      <div className="twoBoxes">
        <div className="boxOne box">
          <div className="subBox center">
            <label>Lettre</label>
            <span>A</span>
          </div>
        </div>
        <div className="boxTwo box">
          <div className="subBox center">
            <label>Categorie</label>
            <span>Fruits</span>
          </div>
        </div>
      </div>
      <div className="form">
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
        <div className={styles.rowResult}> 
          <label className={styles.player}>Player 1</label>
          <div  className={styles.rowActions}>
            <div className={styles.rounds}>
              <span className={styles.result}>Result 1</span>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={`${styles.round} ${styles.approved}`}></div>
              <div className={`${styles.round} ${styles.disapproved}`}></div>
              <div className={styles.round}></div>
              <div className={styles.round}></div>
            </div>
            <div  className={styles.actions}>
              <button className={`${styles.approve} ${styles.action} `}>Yes</button>
              <button className={`${styles.disapprove} ${styles.action} `}>No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
