import React from "react";
import { hooksContexts } from "../Game";
import { selectedTypeInterface } from "../../../interface/SelectedTypeInterface";
import Hand from "./Hand";
import Deck from "./Deck";
import Field from "./Field";
import Bonds from "./Bonds";
import Support from "./Support";
import Evacuation from "./Evacuation";
import Orb from "./Orb";
import "../../../css/gameStyle.css";

const MyPlayer = () => {
  const gameManager = React.useContext(hooksContexts);
  const onBondClick = () => gameManager.select(selectedTypeInterface.BONDS);
  const onFieldFrontClick = () =>
    gameManager.select(selectedTypeInterface.FIELD_FRONT);
  const onFieldBackClick = () =>
    gameManager.select(selectedTypeInterface.FIELD_BACK);
  return (
    <div className="my_player">
      <img
        src={`${process.env.PUBLIC_URL}/play_sheet.jpg`}
        className="play_sheet"
        alt=""
      />
      <div className="my_flont_field" onClick={onFieldFrontClick}>
        <Field></Field>
      </div>
      <div className="my_back_field" onClick={onFieldBackClick}>
        <Field isBack={true}></Field>
      </div>
      <div className="my_orb">
        <Orb></Orb>
      </div>
      <div className="my_deck">
        <Deck></Deck>
      </div>
      <div className="my_support">
        <Support></Support>
      </div>
      <div className="my_bonds" onClick={onBondClick}>
        <Bonds></Bonds>
      </div>
      <div className="my_evacuation">
        <Evacuation></Evacuation>
      </div>
      <div>
        <Hand></Hand>
      </div>
    </div>
  );
};

export default MyPlayer;
