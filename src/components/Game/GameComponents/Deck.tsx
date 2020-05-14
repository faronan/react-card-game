/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Deck = (props: { isEnemy: boolean }) => {
  //const gameManager = React.useContext(hooksContexts);
  //const card = gameManager.getDeck(props.isEnemy)[0];
  return (
    <img
      src={`${process.env.PUBLIC_URL}/card_back_side.jpg`}
      className="deck_image"
      alt=""
    />
  );
};

Deck.defaultProps = { isEnemy: false };
export default Deck;
