import React from "react";
import { hooksContexts } from "../Game";
import { selectedType } from "../../../interface/SelectedTypeInterface";
import Hand from "./Hand";
import Deck from "./Deck";
import Field from "./Field";
import Bonds from "./Bonds";
import Support from "./Support";
import Evacuation from "./Evacuation";
import Orb from "./Orb";
import "../../../css/gameStyle.css";
import { PlayerTurnStatusType } from "../../../interface/PlayerTurnStatusTypeInterface";

const EnemyPlayer = () => {
  const gameManager = React.useContext(hooksContexts);
  const onBondsClick = () =>
    gameManager.locationSelect(selectedType.BONDS, true);
  const onFieldFrontClick = () =>
    gameManager.locationSelect(selectedType.FIELD_FRONT, true);
  const onFieldBackClick = () =>
    gameManager.locationSelect(selectedType.FIELD_BACK, true);

  const className =
    gameManager.getPlayer(true).playerTurnStatus === PlayerTurnStatusType.END
      ? "enemy_player_end"
      : "";
  return (
    <div className={className}>
      <Hand isEnemy={true}></Hand>
      <div className="enemy_player">
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
        {
          // マリガンのタイミングは相手にMyPlayerに合わせる + EnemyPlayerはマリガン後にターン数が1になる
          gameManager.getPlayer().turnCount === 1 &&
            gameManager.getPlayer(true).turnCount === 0 &&
            gameManager.getPlayer().playerTurnStatus ===
              PlayerTurnStatusType.BEGIN && (
              <button
                className="enemy-mulligan-button"
                onClick={() => gameManager.mulligan(true)}
              >
                引き直し
              </button>
            )
        }
        <button
          className="enemy-turn-end-button"
          onClick={() => gameManager.goNextTurn(true)}
        >
          ターン終了
        </button>
        <div className="enemy_support">
          <Support isEnemy={true}></Support>
        </div>
        <div className="enemy_orb">
          <Orb isEnemy={true}></Orb>
        </div>
        <div className="enemy_back_field" onClick={onFieldBackClick}>
          <Field isEnemy={true} isBack={true}></Field>
        </div>
        <div className="enemy_front_field" onClick={onFieldFrontClick}>
          <Field isEnemy={true}></Field>
        </div>
      </div>
    </div>
  );
};

export default EnemyPlayer;
