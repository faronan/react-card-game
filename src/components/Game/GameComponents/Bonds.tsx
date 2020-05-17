import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Bonds = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const isEnemy = props.isEnemy;
  const bondsCard = gameManager.getBond(isEnemy);
  const validBondCount = gameManager.getValidBondCount(isEnemy);

  const cards = (
    <div>
      <div className="bond-count-icon">
        <p>{`${validBondCount}/${bondsCard.length}`}</p>
      </div>
      <div className="bonds">
        {bondsCard.map((card) => (
          <Card card={card} key={`${card.card_data.id}-${card.id}`}></Card>
        ))}
      </div>
    </div>
  );
  return cards;
};

Bonds.defaultProps = { isEnemy: false };
export default Bonds;
