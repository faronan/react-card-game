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

const EnemyPlayer = () => {
  const gameManager = React.useContext(hooksContexts);
  const onBondsClick = () =>
    gameManager.select(selectedTypeInterface.BONDS, null, true);
  const onFieldFrontClick = () =>
    gameManager.select(selectedTypeInterface.FIELD_FRONT, null, true);
  const onFieldBackClick = () =>
    gameManager.select(selectedTypeInterface.FIELD_BACK, null, true);
  return (
    <div className="enemy_player">
      <div>
        <Hand isEnemy={true}></Hand>
      </div>
      <img
        src={`${process.env.PUBLIC_URL}/play_sheet.jpg`}
        className="enemy_play_sheet"
        alt=""
      />
      <div className="enemy_bonds" onClick={onBondsClick}>
        <Bonds isEnemy={true}></Bonds>
      </div>
      <div className="enemy_evacuation">
        <Evacuation isEnemy={true}></Evacuation>
      </div>
      <div className="enemy_deck">
        <Deck isEnemy={true}></Deck>
      </div>
      <div className="enemy_support">
        <Support isEnemy={true}></Support>
      </div>
      <div className="enemy_orb">
        <Orb isEnemy={true}></Orb>
      </div>
      <div className="enemy_back_field" onClick={onFieldBackClick}>
        <Field isEnemy={true} isBack={true}></Field>
      </div>
      <div className="enemy_flont_field" onClick={onFieldFrontClick}>
        <Field isEnemy={true}></Field>
      </div>
    </div>
  );
};

export default EnemyPlayer;
