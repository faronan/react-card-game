import React from "react";
import { hooksContexts } from "../Game";
import { CardLocation } from "../../../interface/GameCardStatusInterface";

const Buttons = () => {
  const gameManager = React.useContext(hooksContexts);
  const draw = (isEnemy = false) => {
    const drawCard = gameManager.getDeck(isEnemy)[0];
    drawCard.location = CardLocation.HAND;
    gameManager.setPlaterCards(drawCard, isEnemy);
  };
  const myDraw = () => {
    draw();
  };
  const enemyDraw = () => {
    draw(true);
  };
  //デバッグ用
  const debug = () => {
    console.log(gameManager);
  };
  const buttons = (
    <div>
      <button onClick={myDraw}>MyDraw</button>
      <button onClick={enemyDraw}>EnemyDraw</button>
      <button onClick={debug}>Debug</button>
    </div>
  );
  return buttons;
};

export default Buttons;
