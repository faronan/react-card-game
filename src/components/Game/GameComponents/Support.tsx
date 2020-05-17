import React from "react";
import Card from "./Card";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";

const Support = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const supportCard = gameManager.getSupport(props.isEnemy);

  const support =
    supportCard == null ? (
      <div></div>
    ) : (
      <Card card={supportCard} key={supportCard.id}></Card>
    );

  return support;
};

Support.defaultProps = { isEnemy: false };
export default Support;
