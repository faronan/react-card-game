import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Evacuation = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const evacuationCard = gameManager.getEvacuation(props.isEnemy);
  const card = evacuationCard[0];

  const cards = card ? (
    <div className="cards">
      <Card
        card={card}
        type={selectedTypeInterface.BONDS_CARD}
        isEnemy={props.isEnemy}
      ></Card>
    </div>
  ) : (
    <div></div>
  );

  return cards;
};

Evacuation.defaultProps = { isEnemy: false };
export default Evacuation;
