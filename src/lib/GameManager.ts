/* eslint-disable no-unused-vars */

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { playerController } from "./playerController";
import { operatedController } from "./operatedController";
import { selectedTypeInterface } from "../interface/SelectedTypeInterface";
import {
  GameCardStatusInterface,
  CardStatus,
} from "../interface/GameCardStatusInterface";

export class GameManager {
  //自プレイヤーの管理
  playerController: playerController;
  //敵プレイヤーの管理
  enemyPlayerController: playerController;
  //操作を記録
  operatedController: operatedController;

  constructor(
    playerController?: playerController,
    enemyPlayerController?: playerController,
    operatedController?: operatedController
  ) {
    this.playerController = playerController!;
    this.enemyPlayerController = enemyPlayerController!;
    this.operatedController = operatedController!;
  }

  // cardは不要な時はnullで受け取る
  select(
    type: selectedTypeInterface,
    card: GameCardStatusInterface | null = null,
    isEnemy = false
  ) {
    //未選択状態
    if (!this.operatedController.isSelected) {
      //未選択状態なら必ずカードを選択しているはず
      if (card == null) {
        return;
      }
      switch (type) {
        //手札から選択した時
        case selectedTypeInterface.HAND:
          this.handChoice(card);
          break;
        case selectedTypeInterface.FIELD_FRONT_CARD:
          this.fieldFrontChoice(card);
          break;
        case selectedTypeInterface.FIELD_BACK_CARD:
          this.fieldBackChoice(card);
          break;
        case selectedTypeInterface.ORB_CARD:
          this.orbChoice(card, isEnemy);
          break;
        default:
          break;
      }
    } else {
      // 選択状態
      switch (type) {
        case selectedTypeInterface.FIELD_FRONT:
          this.toField(isEnemy);
          break;
        case selectedTypeInterface.FIELD_BACK:
          this.toField(isEnemy, true);
          break;
        case selectedTypeInterface.BONDS:
          this.toBonds(isEnemy);
          break;
        case selectedTypeInterface.FIELD_FRONT_CARD:
          this.attack(card!, isEnemy);
          break;
        case selectedTypeInterface.FIELD_BACK_CARD:
          this.attack(card!, isEnemy);
          break;
        default:
          break;
      }
    }
  }

  // 最初にこの関数を通すことで他の処理を共通化する
  getPlayerController(isEnemy: boolean) {
    if (isEnemy) {
      return this.enemyPlayerController;
    } else {
      return this.playerController;
    }
  }

  getDeck(isEnemy = false) {
    return this.getPlayerController(isEnemy).deck;
  }

  getHand(isEnemy = false) {
    return this.getPlayerController(isEnemy).hand;
  }

  getField(isEnemy = false, isBack: boolean) {
    if (isBack) {
      return this.getPlayerController(isEnemy).field.back;
    } else {
      return this.getPlayerController(isEnemy).field.front;
    }
  }

  handChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.HAND, card);
  }

  fieldFrontChoice(card: GameCardStatusInterface) {
    this.operatedController.select(
      selectedTypeInterface.FIELD_FRONT_CARD,
      card
    );
  }

  fieldBackChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.FIELD_BACK_CARD, card);
  }

  orbChoice(card: GameCardStatusInterface, isEnemy = false) {
    this.getPlayerController(isEnemy).addHand([card]);
    this.getPlayerController(isEnemy).removeOrb([card]);
  }

  toField(isEnemy: boolean, isBack = false) {
    const selectedCard = this.operatedController.selectedCard;
    if (!selectedCard) {
      return;
    }
    this.operatedController.unselect();

    // クラスチェンジした場合は早期return
    const targetField = isBack
      ? this.getPlayerController(isEnemy).field.back
      : this.getPlayerController(isEnemy).field.front;

    const basecard = targetField.filter(
      (f) => f.card_data.char_name === selectedCard.card_data.char_name
    );
    if (basecard.length !== 0) {
      const levelUp = () => {
        if (isBack) {
          this.getPlayerController(isEnemy).changeBackCard(basecard, [
            selectedCard,
          ]);
        } else {
          this.getPlayerController(isEnemy).changeFrontCard(basecard, [
            selectedCard,
          ]);
        }
        this.getPlayerController(isEnemy).removeHand([selectedCard]);
      };
      this.createDialog(
        "Confirm",
        "Change 「" +
          basecard[0].card_data.char_name +
          "」 to 「" +
          selectedCard.card_data.char_name +
          "」",
        levelUp,
        () => console.log("cancel")
      );
      return;
    }

    const fromType = this.operatedController.fromType;
    switch (fromType) {
      case selectedTypeInterface.HAND:
        if (this.fromHandValidate(selectedCard, isEnemy, isBack)) {
          return;
        }
        this.getPlayerController(isEnemy).removeHand([selectedCard]);
        if (isBack) {
          this.getPlayerController(isEnemy).addBackField([selectedCard]);
        } else {
          this.getPlayerController(isEnemy).addFrontField([selectedCard]);
        }
        break;
      // 前のカードが選択されていた時
      case selectedTypeInterface.FIELD_FRONT_CARD:
        if (this.fromFieldCardValidate(selectedCard, isEnemy) || !isBack) {
          return;
        }
        selectedCard.status = CardStatus.FIELD_DONE;
        this.getPlayerController(isEnemy).moveFieldFrontToBack([selectedCard]);
        break;
      // 後ろのカードが選択されていた時
      case selectedTypeInterface.FIELD_BACK_CARD:
        if (this.fromFieldCardValidate(selectedCard, isEnemy, true) || isBack) {
          return;
        }
        selectedCard.status = CardStatus.FIELD_DONE;
        this.getPlayerController(isEnemy).moveFieldBackToFront([selectedCard]);
        break;
      default:
        break;
    }
  }

  fromHandValidate(
    card: GameCardStatusInterface,
    isEnemy: boolean,
    isBack: boolean
  ) {
    // カードを選択しているか、プレイヤーが合っているか
    const handValidate = !this.getHand(isEnemy)
      .map((h) => h.id)
      .includes(card.id);
    // 出撃時のvaligate
    const checkField = isBack
      ? this.getPlayerController(isEnemy).field.front
      : this.getPlayerController(isEnemy).field.back;
    const fieldValidate =
      checkField.filter(
        (f) => f.card_data.char_name === card.card_data.char_name
      ).length > 0;
    return handValidate || fieldValidate;
  }

  fromFieldCardValidate(
    card: GameCardStatusInterface,
    isEnemy: boolean,
    isBack = false
  ) {
    // カードを選択しているか、プレイヤーが合っているか
    return !this.getField(isEnemy, isBack)
      .map((f) => f.id)
      .includes(card.id);
  }

  toBonds(isEnemy: boolean) {
    const selectedHand = this.operatedController.selectedCard;
    // カードを選択しているか、プレイヤーが合っているか、そのうち共通化する
    if (
      !selectedHand ||
      !this.getHand(isEnemy)
        .map((h) => h.id)
        .includes(selectedHand.id)
    ) {
      return;
    }
    this.operatedController.unselect();
    this.getPlayerController(isEnemy).removeHand([selectedHand]);
    this.getPlayerController(isEnemy).addBonds([selectedHand]);
  }

  attack(card: GameCardStatusInterface, isEnemy: boolean, isBack = false) {
    const selectedAttackCard = this.operatedController.selectedCard!;
    //TODO: validateは必要
    //isEnemyは攻撃された側の値が入るのに注意
    const attackSupportCard = this.getPlayerController(!isEnemy).turnSupport();
    const attackedSupportCard = this.getPlayerController(isEnemy).turnSupport();
    selectedAttackCard.status = CardStatus.FIELD_DONE;
    //TODO: 攻撃時の挙動、あとで計算とか追加

    const attackPower =
      selectedAttackCard.card_data.power +
      attackSupportCard.card_data.support_power;
    const attackedPower =
      card.card_data.power + attackedSupportCard.card_data.support_power;
    const title = attackPower >= attackedPower ? "Attack Win!" : "Guard Win!";
    const message = "attack: " + attackPower + " VS attacked: " + attackedPower;
    const defeat = () => {
      if (isBack) {
        this.getPlayerController(isEnemy).removeBackField([card]);
      } else {
        this.getPlayerController(isEnemy).removeFrontField([card]);
      }
      this.getPlayerController(isEnemy).addEvacuation([card]);
      this.getPlayerController(!isEnemy).throwSupport();
      this.getPlayerController(isEnemy).throwSupport();
    };

    // 数秒後に確認ダイアログ
    setTimeout(() => this.createDialog(title, message, defeat, null), 1000);

    //終了

    this.operatedController.unselect();
  }

  createDialog = (
    title: string,
    message: string,
    onClickYes: () => void,
    onClickNo: (() => void) | null
  ) => {
    let buttons = [
      {
        label: "Yes",
        onClick: onClickYes,
      },
    ];
    if (onClickNo) {
      const noButton = {
        label: "No",
        onClick: onClickNo,
      };
      buttons = buttons.concat([noButton]);
    }
    confirmAlert({
      title: title,
      message: message,
      buttons: buttons,
    });
  };
}

export default GameManager;
