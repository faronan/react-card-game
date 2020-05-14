/* eslint-disable no-unused-vars */
import React from "react";
import {
  GameCardStatusInterface,
  CardStatus,
} from "../../../interface/GameCardStatusInterface";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Card = (props: {
  card: GameCardStatusInterface;
  type: selectedTypeInterface;
  isEnemy: boolean;
}) => {
  const gameManager = React.useContext(hooksContexts);
  const cardOnClick = () => {
    gameManager.select(props.type, props.card, props.isEnemy);
  };
  const className = [CardStatus.DONE].includes(props.card.status)
    ? "card_done"
    : "card_";
  // memo: src={`${process.env.PUBLIC_URL}/card.png`}
  return (
    <img
      src={`${props.card.card_data.image}`}
      className={className}
      alt=""
      onClick={cardOnClick}
    />
  );
};

Card.defaultProps = { isEnemy: false };
export default Card;
