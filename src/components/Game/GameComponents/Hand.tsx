import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Hand = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const hands = gameManager.getHand(props.isEnemy);
  const cards = (
    <div>
      {hands.map((card) => (
        <Card card={card} key={`${card.cardData.id}-${card.id}`}></Card>
      ))}
    </div>
  );
  return cards;
};

Hand.defaultProps = { isEnemy: false };

export default Hand;
