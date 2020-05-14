import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Hand = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const hands = gameManager.getHand(props.isEnemy);
  const cards = (
    <div className="hand">
      <h3 className="hand_text">手札</h3>
      <ul className="card_in_hand">
        {hands.map((card) => (
          <Card
            card={card}
            type={selectedTypeInterface.HAND}
            key={card.id}
          ></Card>
        ))}
      </ul>
    </div>
  );
  return cards;
};

Hand.defaultProps = { isEnemy: false };

export default Hand;
