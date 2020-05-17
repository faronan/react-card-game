/* eslint-disable no-unused-vars */
import React from "react";
import {
  GameCardStatusInterface,
  CardStatus,
  CardLocation,
} from "../../../interface/GameCardStatusInterface";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Card = (props: { card: GameCardStatusInterface; isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const card = props.card;
  const cardOnClick = () => {
    gameManager.cardSelect(card, props.isEnemy);
  };
  const className = (() => {
    if (card.location === CardLocation.HAND) {
      return "card_hand";
    } else if (card.location === CardLocation.BOND) {
      return "card_bond";
    } else if (card.location === CardLocation.ORB) {
      return "card_orb";
    } else if (
      [CardLocation.FIELD_BACK, CardLocation.FIELD_FRONT].includes(
        card.location
      )
    ) {
      if (card.status === CardStatus.DONE) {
        return "card_done";
      }
      return "card_field";
    }
    return "card_default";
  })();

  const isSelectedClassName = (className: string) => {
    const isSelected = gameManager.operatedController.selectedCard === card;
    return isSelected ? className + " card_selected" : className;
  };

  const src = [CardLocation.DECK, CardLocation.ORB].includes(card.location)
    ? `${process.env.PUBLIC_URL}/card_back_side.jpg`
    : card.card_data.image;

  // memo: src={`${process.env.PUBLIC_URL}/card.png`}
  return (
    <img
      src={src}
      className={isSelectedClassName(className)}
      alt=""
      onClick={cardOnClick}
    />
  );
};

Card.defaultProps = { isEnemy: false };
export default Card;
