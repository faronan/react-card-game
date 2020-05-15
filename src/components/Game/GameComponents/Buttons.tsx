import React from "react";
import { hooksContexts } from "../Game";

const Buttons = () => {
  const gameManager = React.useContext(hooksContexts);
  //デバッグ用
  const debug = () => {
    console.log(gameManager);
  };
  const buttons = (
    <div>
      <button onClick={debug}>Debug</button>
    </div>
  );
  return buttons;
};

export default Buttons;
