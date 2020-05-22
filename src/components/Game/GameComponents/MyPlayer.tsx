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

const MyPlayer = () => {
  const gameManager = React.useContext(hooksContexts);
  const onBondClick = () => gameManager.locationSelect(selectedType.BONDS);
  const onFieldFrontClick = () =>
    gameManager.locationSelect(selectedType.FIELD_FRONT);
  const onFieldBackClick = () =>
    gameManager.locationSelect(selectedType.FIELD_BACK);

  const className =
    gameManager.getPlayer().playerTurnStatus === PlayerTurnStatusType.END
      ? "my_player_end"
      : "";
  return (
    <div className={className}>
      <div className="my_player">
        <img
          src={`${process.env.PUBLIC_URL}/play_sheet.jpg`}
          className="play_sheet"
          alt=""
        />
        <div className="my_front_field" onClick={onFieldFrontClick}>
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
        {gameManager.getPlayer().turnCount === 1 &&
          gameManager.getPlayer().playerTurnStatus ===
            PlayerTurnStatusType.GAME_BEGIN && (
            <button
              className="my-mulligan-button"
              onClick={() => gameManager.mulligan()}
            >
              引き直し
            </button>
          )}
        <button
          className="my-turn-end-button"
          onClick={() => gameManager.goNextTurn()}
        >
          ターン終了
        </button>
        <div className="my_support">
          <Support></Support>
        </div>
        <div className="my_bonds" onClick={onBondClick}>
          <Bonds></Bonds>
        </div>
        <div className="my_evacuation">
          <Evacuation></Evacuation>
        </div>
      </div>
      <Hand></Hand>
    </div>
  );
};

export default MyPlayer;
