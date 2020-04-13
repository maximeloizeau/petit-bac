import React from "react";
import { useParams } from "react-router-dom";
import styles from "./Loading.module.css";




// function changeSide() {
//   var cube = document.querySelector('.cube');
//   var currentClass = '';
  
//   if (!cube) {
//     return
//   }
//   if (currentClass) {
//     cube.classList.remove(currentClass);
//   }
//   cube.classList.addAfter( showClass);
//   currentClass = showClass;
// }

const rotation = [
  styles.showfront1,
  styles.showright,
  styles.showback,
  styles.showleft,
  styles.showtop,
  styles.showbottom,
  styles.showback
];

interface LoadingComponentState { faceClass: string, rotationIndex: number };
interface LoadingComponentProps {}

export class Loading extends React.Component<LoadingComponentProps, LoadingComponentState> {
  constructor(props: React.Props<{}>) {
    super(props);

    this.state = { faceClass: styles.showfront, rotationIndex: 0 };
  }

  componentDidMount() {
    setTimeout(() => this.changeSide(), 1000)
  }

  changeSide() {
    const nextRotationIndex = (this.state.rotationIndex + 1) % rotation.length;
    this.setState({ faceClass: rotation[nextRotationIndex], rotationIndex: nextRotationIndex });

    setTimeout(() => this.changeSide(), 1300)
  }

  render() {
    return (
      <div>
        <div className={styles.scene}>
          <div className={`${styles.cube} ${this.state.faceClass} `} >
            <div className={`${styles.cubeface} ${styles.cubefacefront}`}>
              B
            </div>
            <div className={`${styles.cubeface} ${styles.cubefaceback}`}>
              A
            </div>
            <div className={`${styles.cubeface} ${styles.cubefaceright}`}>
              <span className="fa fa-squirrel"> </span>
            </div>
            <div className={`${styles.cubeface} ${styles.cubefaceleft}`}>
              <span className="fa fa-briefcase-medical"> </span>
            </div>
            <div className={` ${styles.cubeface} ${styles.cubefacetop} `}>K</div>
            <div className={` ${styles.cubeface} ${styles.cubefacebottom}`}>
              <span className="fa fa-carrot"> </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
