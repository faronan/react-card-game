import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Hand = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const hands = gameManager.getHand(props.isEnemy);
  const cards = (
    <div className="card">
      <div className="card-body">
        <ul className="card_in_hand">
          {hands.map((card) => (
            <Card
              card={card}
              type={selectedTypeInterface.HAND}
              key={`${card.card_data.id}-${card.id}`}
            ></Card>
          ))}
        </ul>
      </div>
    </div>
  );
  return cards;
};

Hand.defaultProps = { isEnemy: false };

export default Hand;
