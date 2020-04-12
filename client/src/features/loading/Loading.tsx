import React from "react";
import { useParams } from "react-router-dom";
import styles from "./Loading.module.css";

export function Loading() {
  let { gameId } = useParams();
  return (
    <div className={styles.loader}>
        
    <div className={styles.image}>
      <i className={` ${styles.icon} ${styles.small} fa fa-deer`}></i>
      <i className={` ${styles.icon} fa fa-deer`}></i>
      <i className={` ${styles.icon}  ${styles.small} fa fa-deer`}></i>
    </div>
      <span></span>
    </div>
  );
}
