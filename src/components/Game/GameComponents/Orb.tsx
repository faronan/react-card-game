import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Orb = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const orb = gameManager.getOrb(props.isEnemy);

  const cards = (
    <ul className="orb">
      {orb.map((card) => (
        <Card
          card={card}
          type={selectedTypeInterface.ORB_CARD}
          key={`${card.card_data.id}-${card.id}`}
          isEnemy={props.isEnemy}
        ></Card>
      ))}
    </ul>
  );

  return cards;
};

Orb.defaultProps = { isEnemy: false };
export default Orb;
