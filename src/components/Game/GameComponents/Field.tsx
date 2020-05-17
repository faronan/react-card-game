import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Field = (props: { isEnemy: boolean; isBack: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const fieldCards = gameManager.getField(props.isEnemy, props.isBack);

  const cards = (
    <div className="field_cards">
      <ul>
        {fieldCards.map((card) => (
          <Card
            card={card}
            isEnemy={props.isEnemy}
            key={`${card.card_data.id}-${card.id}`}
          ></Card>
        ))}
      </ul>
    </div>
  );
  return cards;
};

Field.defaultProps = { isEnemy: false, isBack: false };
export default Field;
