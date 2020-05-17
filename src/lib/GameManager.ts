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
import { playerController } from "./PlayerController";

export class GameManager {
  //自プレイヤーのカード
  playerCards: gameCardController;
  //自プレイヤーの状態
  player: playerController;
  //敵プレイヤーのカード
  enemyPlayerCards: gameCardController;
  //敵プレイヤーの状態
  enemyPlayer: playerController;
  //操作を記録
  operatedController: operatedController;

  constructor(
    playerCards?: gameCardController,
    player?: playerController,
    enemyPlayerCards?: gameCardController,
    enemyPlayer?: playerController,
    operatedController?: operatedController
  ) {
    this.playerCards = playerCards!;
    this.player = player!;
    this.enemyPlayerCards = enemyPlayerCards!;
    this.enemyPlayer = enemyPlayer!;
    this.operatedController = operatedController!;
  }

  cardSelect(card: GameCardStatusInterface, isEnemy = false) {
    if (!this.operatedController.isSelected) {
      switch (card.location) {
        //手札から選択した時
        case CardLocation.HAND:
          this.handCardChoice(card);
          break;
        case CardLocation.FIELD_FRONT:
          this.fieldFrontCardChoice(card);
          break;
        case CardLocation.FIELD_BACK:
          this.fieldBackCardChoice(card);
          break;
        case CardLocation.ORB:
          this.orbCardChoice(card, isEnemy);
          break;
        case CardLocation.EVACUATION:
          this.evacuationCardChoice(card, isEnemy);
          break;
        default:
          break;
      }
    } else {
      // 選択状態
      switch (card.location) {
        case CardLocation.HAND:
          this.handCardChoice(card);
          break;
        case CardLocation.FIELD_FRONT:
        case CardLocation.FIELD_BACK:
          this.attack(card);
          break;
        default:
          break;
      }
    }
  }
  // フィールド選択時
  locationSelect(type: selectedTypeInterface, isEnemy = false) {
    //未選択状態
    if (!this.operatedController.isSelected) {
      return;
    }

    // 選択状態
    switch (type) {
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
      default:
        break;
    }
  }

  // カード系は最初にこの関数を通すことで他の処理を共通化する
  getPlayerCards(isEnemy: boolean) {
    if (isEnemy) {
      return this.enemyPlayerCards.playerCards;
    } else {
      return this.playerCards.playerCards;
    }
  }

  // プレイヤー系は最初にこの関数を通すことで他の処理を共通化する
  getPlayer(isEnemy: boolean) {
    if (isEnemy) {
      return this.player;
    } else {
      return this.enemyPlayer;
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

  getFieldUnderCard(card: GameCardStatusInterface, isEnemy: boolean) {
    return this.getPlayerCards(isEnemy).filter(
      (c) =>
        c.location === CardLocation.FIELD_UNDER_CARD &&
        c.card_data.char_name === card.card_data.char_name
    );
  }

  getSupport(isEnemy = false) {
    return this.getPlayerCards(isEnemy).find(
      (c) => c.location === CardLocation.SUPPORT
    )!;
  }

  goNextTurn(isEnemy: boolean) {
    //カード系のリセット
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

    //プレイヤー系のリセット
    this.getPlayer(isEnemy).setIsBondDone(false);
  }

  handCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.NONE, card);
  }

  fieldFrontCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.NONE, card);
  }

  fieldBackCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedTypeInterface.NONE, card);
  }

  orbCardChoice(card: GameCardStatusInterface, isEnemy = false) {
    const orbToHandCard = this.getPlayerCardById(card, isEnemy);
    orbToHandCard.location = CardLocation.HAND;
    this.setPlaterCards(orbToHandCard, isEnemy);
  }

  evacuationCardChoice(card: GameCardStatusInterface, isEnemy = false) {
    createDialog(
      "",
      `${card.card_data.cost}コスト「${card.card_data.char_name}」を回収しますか？`,
      () => {
        const evacuationToHandCard = this.getPlayerCardById(card, isEnemy);
        evacuationToHandCard.location = CardLocation.HAND;
        this.setPlaterCards(evacuationToHandCard, isEnemy);
      },
      () => {}
    );
  }

  draw(isEnemy: boolean) {
    const drawCard = this.getDeck(isEnemy)[0];
    if (!this.getDeck(isEnemy)[1]) {
      this.getEvacuation(isEnemy).map(
        (card) => (card.location = CardLocation.DECK)
      );
    }
    drawCard.location = CardLocation.HAND;
    this.setPlaterCards(drawCard, isEnemy);
  }

  checkBondColor(color: string, isEnemy: boolean) {
    return (
      this.getBond(isEnemy).filter((card) => card.card_data.color === color)
        .length > 0
    );
  }

  toField(isEnemy: boolean, isBack = false) {
    this.operatedController.unselect();
    const selectedCard = this.operatedController.selectedCard;
    if (!selectedCard) {
      return;
    }
    if (selectedCard.is_enemy !== isEnemy) {
      return;
    }

    switch (selectedCard.location) {
      //手札のカードが選択されていた場合
      case CardLocation.HAND:
        if (this.fromHandValidate(selectedCard, isEnemy, isBack)) {
          return;
        }
        if (
          !this.checkBondColor(
            selectedCard.card_data.color,
            selectedCard.is_enemy
          )
        ) {
          createOkDialog(
            "",
            `絆に「${selectedCard.card_data.color}」はありません`
          );
          return;
        }
        // クラスチェンジした場合は早期return
        const classChangeBaseCard = this.getField(isEnemy, isBack).find(
          (card) =>
            card.card_data.char_name === selectedCard.card_data.char_name
        );
        if (classChangeBaseCard) {
          const levelUp = () => {
            if (
              selectedCard.card_data.over_cost &&
              selectedCard.card_data.over_cost > 0
            ) {
              // CC用のコストで計算
              if (
                selectedCard.card_data.over_cost >
                this.getValidBondCount(isEnemy)
              ) {
                createOkDialog("", "絆の枚数が足りません");
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
                createOkDialog("", "絆の枚数が足りません");
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
            this.getBond(isEnemy)
              .slice(0, selectedCard.card_data.cost)
              .map((card) => (card.status = CardStatus.DONE));

            // おまじない
            this.setPlaterCards(
              this.getPlayerCardById(selectedCard, isEnemy),
              isEnemy
            );
          };
          // CCコストがない => ただのレベルアップの時は
          if (
            !selectedCard.card_data.over_cost ||
            selectedCard.card_data.over_cost < 1
          ) {
            createDialog(
              "",
              classChangeBaseCard.card_data.char_name +
                "を「レベルアップ」させますか？",
              levelUp,
              () => {}
            );
          } else {
            levelUp();
          }
        } else {
          // 通常のコストで計算
          if (selectedCard.card_data.cost > this.getValidBondCount(isEnemy)) {
            createOkDialog("", "絆の枚数が足りません");
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
      case CardLocation.FIELD_FRONT:
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
      case CardLocation.FIELD_BACK:
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
    this.operatedController.unselect();
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
    if (this.getPlayer(isEnemy).isBondDone) {
      return;
    }
    this.getPlayer(isEnemy).setIsBondDone(true);
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
    selectedAttackCard.status = CardStatus.DONE;

    //cardが攻撃された側、selectedAttackCardが攻撃する側
    const attackSupportCard = this.getDeck(selectedAttackCard.is_enemy)[0];
    attackSupportCard.location = CardLocation.SUPPORT;
    const guardSupportCard = this.getDeck(card.is_enemy)[0];
    guardSupportCard.location = CardLocation.SUPPORT;

    const [attackPower, attackPowerMessage] = (() => {
      const supportSucceed =
        selectedAttackCard.card_data.char_name !==
        attackSupportCard.card_data.char_name;
      const power = Number(selectedAttackCard.card_data.power);
      const supportPower = Number(attackSupportCard.card_data.support_power);
      if (supportSucceed) {
        return [
          power + supportPower,
          `支援力: ${attackSupportCard.card_data.support_power} 　　　　　`,
        ];
      } else {
        return [power, "(支援失敗) 　　　　　"];
      }
    })();

    const [guardPower, guardPowerMessage] = (() => {
      const supportSucceed =
        card.card_data.char_name !== guardSupportCard.card_data.char_name;
      const power = Number(card.card_data.power);
      const supportPower = Number(guardSupportCard.card_data.support_power);
      if (supportSucceed) {
        return [
          power + supportPower,
          `支援力: ${guardSupportCard.card_data.support_power} 　　　　　　`,
        ];
      } else {
        return [power, "(支援失敗) 　　　　　　"];
      }
    })();

    //TODO: 攻撃時の挙動

    const isWin = attackPower >= guardPower;
    const title = isWin ? "攻撃側の勝利!" : "防御側の勝利!";
    const message = `攻撃　　　　　　　　防衛　　　　　　　　　
    ------------------------------------------------------------
      戦闘力: ${selectedAttackCard.card_data.power}　　　　　 戦闘力: ${card.card_data.power}　　　　　　
      ${attackPowerMessage}${guardPowerMessage}
      合計　: ${attackPower}　　　　　 合計　: ${guardPower}　　　　　　`;

    const defeat = () => {
      if (isWin) {
        if (
          card.card_data.char_name ===
          this.getPlayer(card.is_enemy).heroCardCharName
        ) {
          const orbCard = this.getOrb(card.is_enemy)[1];
          if (orbCard) {
            orbCard.location = CardLocation.HAND;
          } else {
            //ゲーム終了時処理
          }
        } else {
          this.getPlayerCardById(card, card.is_enemy).location =
            CardLocation.EVACUATION;
          this.getFieldUnderCard(card, card.is_enemy).map(
            (card) => (card.location = CardLocation.EVACUATION)
          );
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
