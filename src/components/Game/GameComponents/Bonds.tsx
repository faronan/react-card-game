import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Bonds = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const bondsCard = gameManager.getBond(props.isEnemy);

  const cards = (
    <div>
      <ul className="bonds">
        {bondsCard.map((card) => (
          <Card
            card={card}
            type={selectedTypeInterface.BONDS_CARD}
            key={card.id}
          ></Card>
        ))}
      </ul>
    </div>
  );
  return cards;
};

Bonds.defaultProps = { isEnemy: false };
export default Bonds;
