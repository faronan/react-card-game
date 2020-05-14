import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Deck = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const card = gameManager.getDeck(props.isEnemy)[0];
  return (
    <Card card={card} type={selectedTypeInterface.NONE} key={card.id}></Card>
  );
};

Deck.defaultProps = { isEnemy: false };
export default Deck;
