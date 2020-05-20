import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";
import { cardColors } from "../../../interface/CardInterface";

const Bonds = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const isEnemy = props.isEnemy;
  const bondsCard = gameManager.getBond(isEnemy);
  const validBondCount = gameManager.getValidBondCount(isEnemy);

  const icon1Color = gameManager.checkBondColor(cardColors.RED, isEnemy)
    ? "red"
    : "silver";

  const icon2Color = gameManager.checkBondColor(cardColors.BLUE, isEnemy)
    ? "blue"
    : "silver";

  const cards = (
    <div>
      <div className="bond-count-icon">
        <p>{`${validBondCount}/${bondsCard.length}`}</p>
      </div>
      <div
        className="bond-icon-1"
        style={{ backgroundColor: icon1Color }}
      ></div>
      <div
        className="bond-icon-2"
        style={{ backgroundColor: icon2Color }}
      ></div>
      <div className="bonds">
        {bondsCard.map((card) => (
          <Card card={card} key={`${card.cardData.id}-${card.id}`}></Card>
        ))}
      </div>
    </div>
  );
  return cards;
};

Bonds.defaultProps = { isEnemy: false };
export default Bonds;
