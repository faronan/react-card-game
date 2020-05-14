import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Evacuation = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const evacuationCard = gameManager.getPlayerController(props.isEnemy)
    .evacuation;

  const cards = (
    <div className="cards">
      <ul>
        {evacuationCard.map((card) => (
          <Card
            card={card}
            type={selectedTypeInterface.BONDS_CARD}
            key={card.id}
            isEnemy={props.isEnemy}
          ></Card>
        ))}
      </ul>
    </div>
  );

  return cards;
};

Evacuation.defaultProps = { isEnemy: false };
export default Evacuation;
