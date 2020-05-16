/* eslint-disable no-unused-vars */
import { operatedController } from "./operatedController";
import { selectedTypeInterface } from "../interface/SelectedTypeInterface";
import {
  GameCardStatusInterface,
  CardStatus,
  CardLocation,
} from "../interface/GameCardStatusInterface";
import { gameCardController } from "./GameCardController";
import { createDialog, createOkDialog } from "./libComponents";

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
        case selectedTypeInterface.HAND:
          if (card) {
            this.handCardChoice(card);
            break;
          }
        // eslint-disable-next-line no-fallthrough
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
          this.attack(card!);
          break;
        case selectedTypeInterface.FIELD_BACK_CARD:
          this.attack(card!);
          break;
        default:
          break;
      }
    }
    if (card) {
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

  getValidBondCount(isEnemy = false) {
    return this.getBond(isEnemy).filter(
      (card) => card.status !== CardStatus.DONE
    ).length;
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

  goNextTurn(isEnemy: boolean) {
    this.getBond(isEnemy)
      .filter((card) => card.status === CardStatus.DONE)
      .map((card) => (card.status = CardStatus.UNACTION));
    this.getField(isEnemy, true)
      .filter((card) => card.status === CardStatus.DONE)
      .map((card) => (card.status = CardStatus.UNACTION));
    this.getField(isEnemy, false)
      .filter((card) => card.status === CardStatus.DONE)
      .map((card) => (card.status = CardStatus.UNACTION));
    this.setPlaterCards(this.getPlayerCards(isEnemy)[0], isEnemy);
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
    const orbToHandCard = this.getPlayerCardById(card, isEnemy);
    orbToHandCard.location = CardLocation.HAND;
    this.setPlaterCards(orbToHandCard, isEnemy);
  }

  draw(isEnemy: boolean) {
    const drawCard = this.getDeck(isEnemy)[0];
    drawCard.location = CardLocation.HAND;
    this.setPlaterCards(drawCard, isEnemy);
  }

  toField(isEnemy: boolean, isBack = false) {
    const selectedCard = this.operatedController.selectedCard;
    if (!selectedCard) {
      return;
    }
    this.operatedController.unselect();
    if (selectedCard.is_enemy !== isEnemy) {
      return;
    }
    const fromType = this.operatedController.fromType;
    switch (fromType) {
      //手札のカードが選択されていた場合
      case selectedTypeInterface.HAND:
        if (this.fromHandValidate(selectedCard, isEnemy, isBack)) {
          return;
        }

        // クラスチェンジした場合は早期return
        const classChangeBaseCard = this.getField(isEnemy, isBack).find(
          (card) =>
            card.card_data.char_name === selectedCard.card_data.char_name
        );
        if (classChangeBaseCard) {
          const levelUp = () => {
            if (selectedCard.card_data.over_cost) {
              // CC用のコストで計算
              if (
                selectedCard.card_data.over_cost >
                this.getValidBondCount(isEnemy)
              ) {
                createOkDialog("警告", "絆の枚数が足りません");
                return;
              }
              this.getBond(isEnemy)
                .slice(0, selectedCard.card_data.over_cost)
                .map((card) => (card.status = CardStatus.DONE));

              // CC時はドローする
              this.draw(isEnemy);
            } else {
              if (
                selectedCard.card_data.cost > this.getValidBondCount(isEnemy)
              ) {
                createOkDialog("警告", "絆の枚数が足りません");
                return;
              }
              this.getBond(isEnemy)
                .slice(0, selectedCard.card_data.cost)
                .map((card) => (card.status = CardStatus.DONE));
            }
            this.getPlayerCardById(classChangeBaseCard, isEnemy).location =
              CardLocation.FIELD_UNDER_CARD;
            this.getPlayerCardById(
              selectedCard,
              isEnemy
            ).location = this.getCardLocationFrontOrBack(isBack);
            // おまじない
            this.setPlaterCards(
              this.getPlayerCardById(selectedCard, isEnemy),
              isEnemy
            );
          };

          // CCコストがない => ただのレベルアップの時は
          if (!selectedCard.card_data.over_cost) {
            createDialog(
              "警告",
              classChangeBaseCard.card_data.char_name +
                "のコストは上がりませんがよろしいですか？",
              levelUp,
              () => {}
            );
          } else {
            levelUp();
          }
        } else {
          // 通常のコストで計算
          if (selectedCard.card_data.cost > this.getValidBondCount(isEnemy)) {
            createOkDialog("警告", "絆の枚数が足りません");
            return;
          }
          this.getBond(isEnemy)
            .slice(0, selectedCard.card_data.cost)
            .map((card) => (card.status = CardStatus.DONE));
          this.getPlayerCardById(
            selectedCard,
            isEnemy
          ).location = this.getCardLocationFrontOrBack(isBack);
        }

        break;
      // 前のカードが選択されていた場合
      case selectedTypeInterface.FIELD_FRONT_CARD:
        if (
          this.fromFieldCardValidate(selectedCard, isEnemy) ||
          !isBack ||
          selectedCard.status === CardStatus.DONE
        ) {
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
        if (
          this.fromFieldCardValidate(selectedCard, isEnemy, true) ||
          isBack ||
          selectedCard.status === CardStatus.DONE
        ) {
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
    const fieldValidate =
      this.getField(isEnemy, !isBack).find(
        (c) => c.card_data.char_name === card.card_data.char_name
      ) !== undefined;
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

  attack(card: GameCardStatusInterface) {
    const selectedAttackCard = this.operatedController.selectedCard!;
    //TODO: validateは必要
    if (
      selectedAttackCard.is_enemy === card.is_enemy ||
      selectedAttackCard.status === CardStatus.DONE
    ) {
      return;
    }
    //cardが攻撃された側、selectedAttackCardが攻撃する側
    const attackSupportCard = this.getDeck(card.is_enemy)[0];
    attackSupportCard.location = CardLocation.SUPPORT;
    const attackedSupportCard = this.getDeck(selectedAttackCard.is_enemy)[0];
    attackedSupportCard.location = CardLocation.SUPPORT;

    selectedAttackCard.status = CardStatus.DONE;

    //TODO: 攻撃時の挙動
    const guardPower =
      Number(card.card_data.power) +
      Number(attackSupportCard.card_data.support_power);
    const attackPower =
      Number(selectedAttackCard.card_data.power) +
      Number(attackedSupportCard.card_data.support_power);

    const isWin = attackPower >= guardPower;
    const title = isWin ? "攻撃側の勝利!" : "防御側の勝利!";
    const message = "攻撃: " + attackPower + " VS 防御: " + guardPower;

    const defeat = () => {
      if (isWin) {
        if (card.status === CardStatus.HERO) {
          const orbCard = this.getOrb(card.is_enemy)[100];
          if (orbCard) {
            orbCard.location = CardLocation.HAND;
          } else {
            //ゲーム終了時処理
          }
        } else {
          this.getPlayerCardById(card, card.is_enemy).location =
            CardLocation.EVACUATION;
        }
      }
      this.getSupport(card.is_enemy).location = CardLocation.EVACUATION;
      this.getSupport(selectedAttackCard.is_enemy).location =
        CardLocation.EVACUATION;
      //　おまじない
      this.setPlaterCards(
        this.getEvacuation(selectedAttackCard.is_enemy)[0],
        selectedAttackCard.is_enemy
      );
    };

    createDialog(title, message, defeat, null);
    // 数秒後に確認ダイアログ
    // setTimeout(() => {
    //   defeat();
    //   this.createDialog(title, message, () => console.log("yes"), null);
    // }, 1000);
    //終了

    this.operatedController.unselect();
  }
}

export default GameManager;
