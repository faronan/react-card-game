/* eslint-disable no-unused-vars */
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { playerController } from "./playerController";
import { operatedController } from "./operatedController";
import { selectedTypeInterface } from "../interface/SelectedTypeInterface";
import {
  GameCardStatusInterface,
  CardStatus,
  CardLocation,
} from "../interface/GameCardStatusInterface";
import { gameCardController } from "./GameCardController";

export class GameManager {
  //自プレイヤーのカード
  playerCards: gameCardController;
  //敵プレイヤーのカード
  enemyPlayerCards: gameCardController;
  //操作を記録
  operatedController: operatedController;

  constructor(
    playerCards?: gameCardController,
    enemyPlayerCards?: gameCardController,
    operatedController?: operatedController
  ) {
    this.playerCards = playerCards!;
    this.enemyPlayerCards = enemyPlayerCards!;
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
          this.handCardChoice(card);
          break;
        case selectedTypeInterface.FIELD_FRONT_CARD:
          this.fieldFrontCardChoice(card);
          break;
        case selectedTypeInterface.FIELD_BACK_CARD:
          this.fieldBackCardChoice(card);
          break;
        case selectedTypeInterface.ORB_CARD:
          this.orbCardChoice(card, isEnemy);
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
  getPlayerCards(isEnemy: boolean) {
    if (isEnemy) {
      return this.enemyPlayerCards.playerCards;
    } else {
      return this.playerCards.playerCards;
    }
  }

  setPlaterCards(card: GameCardStatusInterface, isEnemy: boolean) {
    const otherCard = this.getPlayerCards(isEnemy).filter(
      (c) => c.id !== card.id || c.card_data !== card.card_data
    );
    if (isEnemy) {
      this.enemyPlayerCards.setPlayerCards([...otherCard, card]);
    } else {
      this.playerCards.setPlayerCards([...otherCard, card]);
    }
  }

  getPlayerCardById(card: GameCardStatusInterface, isEnemy: boolean) {
    return this.getPlayerCards(isEnemy).find((c) => c === card)!;
  }

  getCardLocationFrontOrBack(isEnemy: boolean) {
    return isEnemy ? CardLocation.FIELD_BACK : CardLocation.FIELD_FRONT;
  }

  getDeck(isEnemy = false) {
    return this.getPlayerCards(isEnemy).filter(
      (c) => c.location === CardLocation.DECK
    );
  }

  getHand(isEnemy = false) {
    return this.getPlayerCards(isEnemy).filter(
      (c) => c.location === CardLocation.HAND
    );
  }

  getOrb(isEnemy = false) {
    return this.getPlayerCards(isEnemy).filter(
      (c) => c.location === CardLocation.ORB
    );
  }

  getEvacuation(isEnemy = false) {
    return this.getPlayerCards(isEnemy).filter(
      (c) => c.location === CardLocation.EVACUATION
    );
  }

  getBond(isEnemy = false) {
    return this.getPlayerCards(isEnemy).filter(
      (c) => c.location === CardLocation.BOND
    );
  }

  getField(isEnemy = false, isBack: boolean) {
    if (isBack) {
      return this.getPlayerCards(isEnemy).filter(
        (c) => c.location === CardLocation.FIELD_BACK
      );
    } else {
      return this.getPlayerCards(isEnemy).filter(
        (c) => c.location === CardLocation.FIELD_FRONT
      );
    }
  }

  getSupport(isEnemy = false) {
    return this.getPlayerCards(isEnemy).find(
      (c) => c.location === CardLocation.SUPPORT
    )!;
  }

  handCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.HAND, card);
  }

  fieldFrontCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(
      selectedTypeInterface.FIELD_FRONT_CARD,
      card
    );
  }

  fieldBackCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.FIELD_BACK_CARD, card);
  }

  orbCardChoice(card: GameCardStatusInterface, isEnemy = false) {
    this.getPlayerCardById(card, isEnemy).location = CardLocation.HAND;
  }

  toField(isEnemy: boolean, isBack = false) {
    const selectedCard = this.operatedController.selectedCard;
    if (!selectedCard) {
      return;
    }
    this.operatedController.unselect();

    // クラスチェンジした場合は早期return
    const classChangeBaseCard = this.getField(isEnemy, isBack).find(
      (card) => card.card_data.char_name === selectedCard.card_data.char_name
    );

    if (classChangeBaseCard) {
      const levelUp = () => {
        this.getPlayerCardById(classChangeBaseCard, isEnemy).location =
          CardLocation.FIELD_UNDER_CARD;
        this.getPlayerCardById(
          selectedCard,
          isEnemy
        ).location = this.getCardLocationFrontOrBack(isBack);
      };
      this.createDialog(
        "Confirm",
        "Change 「" +
          classChangeBaseCard.card_data.char_name +
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
      //手札のカードが選択されていた場合
      case selectedTypeInterface.HAND:
        if (this.fromHandValidate(selectedCard, isEnemy, isBack)) {
          return;
        }
        this.getPlayerCardById(
          selectedCard,
          isEnemy
        ).location = this.getCardLocationFrontOrBack(isBack);
        break;
      // 前のカードが選択されていた場合
      case selectedTypeInterface.FIELD_FRONT_CARD:
        if (this.fromFieldCardValidate(selectedCard, isEnemy) || !isBack) {
          return;
        }
        this.getPlayerCardById(
          selectedCard,
          isEnemy
        ).location = this.getCardLocationFrontOrBack(isBack);
        this.getPlayerCardById(selectedCard, isEnemy).status = CardStatus.DONE;

        break;
      // 後ろのカードが選択されていた時
      case selectedTypeInterface.FIELD_BACK_CARD:
        if (this.fromFieldCardValidate(selectedCard, isEnemy, true) || isBack) {
          return;
        }
        this.getPlayerCardById(
          selectedCard,
          isEnemy
        ).location = this.getCardLocationFrontOrBack(isBack);
        this.getPlayerCardById(selectedCard, isEnemy).status = CardStatus.DONE;
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
    const fieldValidate = !this.getField(isEnemy, isBack).find(
      (card) => card.card_data.char_name === card.card_data.char_name
    );

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
    this.getPlayerCardById(selectedHand, isEnemy).location = CardLocation.BOND;
  }

  attack(card: GameCardStatusInterface, isEnemy: boolean, isBack = false) {
    const selectedAttackCard = this.operatedController.selectedCard!;
    //TODO: validateは必要
    //isEnemyは攻撃された側の値が入るのに注意
    const attackSupportCard = this.getDeck(!isEnemy)[0];
    attackSupportCard.location = CardLocation.SUPPORT;
    const attackedSupportCard = this.getDeck(isEnemy)[0];
    attackedSupportCard.location = CardLocation.SUPPORT;

    //TODO: 攻撃時の挙動
    const attackPower =
      selectedAttackCard.card_data.power +
      attackSupportCard.card_data.support_power;
    const attackedPower =
      card.card_data.power + attackedSupportCard.card_data.support_power;

    const isWin = attackPower >= attackedPower;
    const title = isWin ? "Attack Win!" : "Guard Win!";
    const message = "attack: " + attackPower + " VS attacked: " + attackedPower;

    const defeat = () => {
      if (isWin) {
        this.getPlayerCardById(card, isEnemy).location =
          CardLocation.EVACUATION;
      }
      this.getSupport(isEnemy).location = CardLocation.EVACUATION;
      this.getSupport(!isEnemy).location = CardLocation.EVACUATION;
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
