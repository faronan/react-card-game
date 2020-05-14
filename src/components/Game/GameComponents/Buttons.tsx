import React from "react";
import { hooksContexts } from "../Game";

const Buttons = () => {
  const gameManager = React.useContext(hooksContexts);
  const draw = (isEnemy = false) => {
    const playerController = gameManager.getPlayerController(isEnemy);
    const card = playerController.deck[0];
    playerController.addHand([card]);
    playerController.removeDeck([card]);
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
