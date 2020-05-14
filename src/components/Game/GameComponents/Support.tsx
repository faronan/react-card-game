import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import "../../../css/gameStyle.css";

const Support = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const supportCard = gameManager.getPlayerController(props.isEnemy).support;

  const support =
    supportCard == null ? (
      <div></div>
    ) : (
      <Card
        card={supportCard}
        type={selectedTypeInterface.NONE}
        key={supportCard.id}
      ></Card>
    );

  return support;
};

Support.defaultProps = { isEnemy: false };
export default Support;
