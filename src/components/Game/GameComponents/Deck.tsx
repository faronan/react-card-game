import React from "react";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Deck = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  return (
    <img
      src={`${process.env.PUBLIC_URL}/card_back_side.jpg`}
      className="deck_image"
      alt=""
      onClick={() => gameManager.deckDraw(props.isEnemy)}
    />
  );
};

Deck.defaultProps = { isEnemy: false };
export default Deck;
