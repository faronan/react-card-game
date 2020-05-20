/* eslint-disable no-unused-vars */
import { operatedController } from "./operatedController";
import { selectedType } from "../interface/SelectedTypeInterface";
import {
  GameCardStatusInterface,
  CardStatus,
  CardLocation,
} from "../interface/GameCardStatusInterface";
import { gameCardController } from "./GameCardController";
import { createDialog, createOkDialog } from "./libComponents";
import { playerController } from "./PlayerController";
import { supportEffects } from "../interface/CardInterface";
import { PlayerStatusType } from "../interface/PlayerStatusTypeInterface";
import { PlayerTurnStatusType } from "../interface/PlayerTurnStatusTypeInterface";

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

  cardSelect(card: GameCardStatusInterface) {
    //TODO: 効果発動時のvalidateが相当面倒
    if (!this.operatedController.isSelected) {
      switch (card.location) {
        //手札から選択した時
        case CardLocation.HAND:
          this.handCardChoice(card);
          break;
        case CardLocation.FIELD_FRONT:
        case CardLocation.FIELD_BACK:
          this.fieldCardChoice(card);
          break;
        case CardLocation.BOND:
          this.bondCardChoice(card);
          break;
        case CardLocation.ORB:
          this.orbCardChoice(card);
          break;
        case CardLocation.EVACUATION:
          this.evacuationCardChoice(card);
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
          this.operatedController.unselect();
          this.attack(card);
          break;
        default:
          break;
      }
    }
  }
  // フィールド選択時
  locationSelect(type: selectedType, isEnemy = false) {
    //未選択状態
    if (!this.operatedController.isSelected) {
      return;
    }
    switch (type) {
      // eslint-disable-next-line no-fallthrough
      case selectedType.FIELD_FRONT:
        this.toField(isEnemy);
        break;
      case selectedType.FIELD_BACK:
        this.toField(isEnemy, true);
        break;
      case selectedType.BONDS:
        this.toBonds(isEnemy);
        break;
      default:
        break;
    }
    this.operatedController.unselect();
  }

  // カード系は最初にこの関数を通すことで他の処理を共通化する
  getPlayerCards(isEnemy = false) {
    if (isEnemy) {
      return this.enemyPlayerCards.playerCards;
    } else {
      return this.playerCards.playerCards;
    }
  }

  // プレイヤー系は最初にこの関数を通すことで他の処理を共通化する
  getPlayer(isEnemy = false) {
    if (isEnemy) {
      return this.player;
    } else {
      return this.enemyPlayer;
    }
  }

  setPlaterCards(card: GameCardStatusInterface) {
    const isEnemy = card.isEnemy;
    const otherCard = this.getPlayerCards(isEnemy).filter(
      (c) => c.id !== card.id || c.cardData !== card.cardData
    );
    if (isEnemy) {
      this.enemyPlayerCards.setPlayerCards([...otherCard, card]);
    } else {
      this.playerCards.setPlayerCards([...otherCard, card]);
    }
  }

  getPlayerCardById(card: GameCardStatusInterface) {
    const isEnemy = card.isEnemy;
    return this.getPlayerCards(isEnemy).find((c) => c === card)!;
  }

  getCardLocationFrontOrBack(isBack: boolean) {
    return isBack ? CardLocation.FIELD_BACK : CardLocation.FIELD_FRONT;
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

  getNonReversedBond(isEnemy = false) {
    return this.getBond(isEnemy).filter((c) => c.status !== CardStatus.REVERSE);
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
        c.cardData.char_name === card.cardData.char_name
    );
  }

  getSupport(isEnemy = false) {
    return this.getPlayerCards(isEnemy).find(
      (c) => c.location === CardLocation.SUPPORT
    )!;
  }

  goNextTurn(isEnemy = false) {
    this.turnEnd(isEnemy);
    this.turnBegin(!isEnemy);
  }

  turnBegin(isEnemy: boolean) {
    //カード系のリセット(未行動に)
    this.getNonReversedBond(isEnemy)
      .filter((card) => card.status === CardStatus.DONE)
      .map((card) => (card.status = CardStatus.UNACTION));
    this.getField(isEnemy, true)
      .filter((card) => card.status === CardStatus.DONE)
      .map((card) => (card.status = CardStatus.UNACTION));
    this.getField(isEnemy, false)
      .filter((card) => card.status === CardStatus.DONE)
      .map((card) => (card.status = CardStatus.UNACTION));
    this.setPlaterCards(this.getPlayerCards(isEnemy)[0]);

    this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.BEGIN);

    this.deckDraw(isEnemy);
    //相手のターン開始時に前衛にカードがない場合、全ての後衛カードを前衛に移動する(進軍)
    if (this.getField(!isEnemy, false).length === 0) {
      this.getField(!isEnemy, true).map(
        (card) => (card.location = CardLocation.FIELD_FRONT)
      );
      //this.setPlaterCards(this.getField(!isEnemy, true)[0], !isEnemy);
    }
  }

  turnEnd(isEnemy: boolean) {
    this.getPlayer(isEnemy).addTurnCount();
    //操作系のリセット
    this.operatedController.unselect();

    this.getPlayer(isEnemy).setPlayerStatus(PlayerStatusType.NONE);
    this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.END);
  }

  handCardChoice(card: GameCardStatusInterface) {
    switch (this.getPlayer(card.isEnemy).playerStatus) {
      case PlayerStatusType.HAND_TRASH:
        card.location = CardLocation.EVACUATION;
        this.getPlayer(card.isEnemy).setPlayerStatus(PlayerStatusType.NONE);
        break;
      case PlayerStatusType.HAND_TO_BOND:
        card.location = CardLocation.BOND;
        this.getPlayer(card.isEnemy).setPlayerStatus(PlayerStatusType.NONE);
        break;
      default:
        this.operatedController.select(selectedType.NONE, card);
        break;
    }
  }

  fieldCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedType.NONE, card);
  }

  bondCardChoice(card: GameCardStatusInterface) {
    const reverseOrbCard = this.getPlayerCardById(card);
    reverseOrbCard.status = CardStatus.REVERSE;
    this.setPlaterCards(reverseOrbCard);
  }

  orbCardChoice(card: GameCardStatusInterface) {
    const orbToHandCard = this.getPlayerCardById(card);
    orbToHandCard.location = CardLocation.HAND;
    this.setPlaterCards(orbToHandCard);
  }

  evacuationCardChoice(card: GameCardStatusInterface) {
    createDialog(
      "",
      `${card.cardData.cost}コスト「${card.cardData.char_name}」を回収しますか？`,
      () => {
        const evacuationToHandCard = this.getPlayerCardById(card);
        evacuationToHandCard.location = CardLocation.HAND;
        this.setPlaterCards(evacuationToHandCard);
      },
      () => {}
    );
  }

  deckDraw(isEnemy: boolean) {
    const deckDrawCard = this.getDeck(isEnemy)[0];
    if (!this.getDeck(isEnemy)[1]) {
      this.getEvacuation(isEnemy).map(
        (card) => (card.location = CardLocation.DECK)
      );
    }
    deckDrawCard.location = CardLocation.HAND;
    this.setPlaterCards(deckDrawCard);
  }

  mulligan(isEnemy = false) {
    const INITIAL_HAND_COUNT = 6;
    const shuffle = ([...arr]) => {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    };
    const newDeck = shuffle([
      ...this.getDeck(isEnemy),
      ...this.getHand(isEnemy),
    ]);
    newDeck
      .slice(0, INITIAL_HAND_COUNT)
      .map((card) => (card.location = CardLocation.HAND));
    newDeck
      .slice(INITIAL_HAND_COUNT, 1000)
      .map((card) => (card.location = CardLocation.DECK));
    if (!isEnemy) {
      this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.BOND);
    } else {
      this.getPlayer(isEnemy).addTurnCount();
    }
  }

  checkBondColor(color: string, isEnemy: boolean) {
    return (
      this.getNonReversedBond(isEnemy).filter(
        (card) => card.cardData.color === color
      ).length > 0
    );
  }

  //手札を選択していた時のvalidate
  handChoicedValidate(card: GameCardStatusInterface, isEnemy: boolean) {
    return (
      card.isEnemy !== isEnemy ||
      this.getHand(isEnemy).filter((hand) => hand === card).length === 0
    );
  }

  //場のカードを選択していた時のvalidate
  fieldCardChoicedValidate(
    card: GameCardStatusInterface,
    isEnemy: boolean,
    isBack: boolean
  ) {
    return (
      card.isEnemy !== isEnemy ||
      this.getField(isEnemy, !isBack).filter((field) => field === card)
        .length === 0
    );
  }

  //出撃時のvalidate
  sortieValidate(
    card: GameCardStatusInterface,
    isEnemy: boolean,
    isBack: boolean
  ) {
    //1.出撃フェイズ 2.選択した場と逆(前or後)に同名のカードが存在しない
    if (
      this.getPlayer(isEnemy).playerTurnStatus >= PlayerTurnStatusType.SORTIE ||
      this.getField(isEnemy, !isBack).filter(
        (c) => c.cardData.char_name === card.cardData.char_name
      ).length > 0
    ) {
      return true;
    }
    //3.表向きの絆に色が足りている
    if (!this.checkBondColor(card.cardData.color, card.isEnemy)) {
      createOkDialog("", `絆に「${card.cardData.color}」はありません`);
      return true;
    }
    return false;
  }

  //移動時のvalidate
  moveValidate(
    card: GameCardStatusInterface,
    isEnemy: boolean,
    isBack: boolean
  ) {
    const canAct =
      card.status !== CardStatus.DONE ||
      this.getPlayer(isEnemy).playerStatus === PlayerStatusType.FIELD_CARD_MOVE;
    const fieldValidate = isBack
      ? card.location === CardLocation.FIELD_BACK
      : card.location === CardLocation.FIELD_FRONT;
    return (
      !canAct ||
      fieldValidate ||
      this.getPlayer(card.isEnemy).playerTurnStatus === PlayerTurnStatusType.END
    );
  }

  sortie(
    card: GameCardStatusInterface,
    isBack: boolean,
    isCc = false,
    baseCard: GameCardStatusInterface | null = null
  ) {
    const isEnemy = card.isEnemy;
    const cost = isCc ? card.cardData.over_cost : card.cardData.cost;
    if (cost > this.getValidBondCount(isEnemy)) {
      createOkDialog("", "絆の枚数が足りません");
      return false;
    }
    this.getBond(isEnemy)
      .slice(0, cost)
      .map((card) => (card.status = CardStatus.DONE));
    this.getPlayerCardById(card).location = this.getCardLocationFrontOrBack(
      isBack
    );
    if (baseCard) {
      baseCard.location = CardLocation.FIELD_UNDER_CARD;
    }
    if (isCc) {
      this.deckDraw(isEnemy);
    }
    //おまじない
    this.setPlaterCards(this.getPlayerCardById(card));
  }

  toField(isEnemy: boolean, isBack = false) {
    const selectedCard = this.operatedController.selectedCard;
    if (!selectedCard) {
      return;
    }

    switch (selectedCard.location) {
      //手札のカードが選択されていた場合
      case CardLocation.HAND:
        if (
          this.handChoicedValidate(selectedCard, isEnemy) ||
          this.sortieValidate(selectedCard, isEnemy, isBack)
        ) {
          return;
        }

        const classChangeBaseCard = this.getField(isEnemy, isBack).find(
          (card) => card.cardData.char_name === selectedCard.cardData.char_name
        );
        const isCc =
          selectedCard.cardData.over_cost !== null &&
          selectedCard.cardData.over_cost > 0;
        //同名カードがあるか
        if (classChangeBaseCard) {
          if (!isCc) {
            createDialog(
              "",
              classChangeBaseCard.cardData.char_name +
                "を「レベルアップ」させますか？",
              () => {
                this.sortie(selectedCard, isBack, isCc, classChangeBaseCard);
              },
              () => {}
            );
          } else {
            this.sortie(selectedCard, isBack, isCc, classChangeBaseCard);
          }
        } else {
          this.sortie(selectedCard, isBack);
        }

        break;
      // 前or後ろのカードが選択されていた場合
      case CardLocation.FIELD_FRONT:
      case CardLocation.FIELD_BACK:
        if (
          this.fieldCardChoicedValidate(selectedCard, isEnemy, isBack) ||
          this.moveValidate(selectedCard, isEnemy, isBack)
        ) {
          return;
        }
        this.getPlayerCardById(
          selectedCard
        ).location = this.getCardLocationFrontOrBack(isBack);
        if (
          this.getPlayer(isEnemy).playerStatus ===
          PlayerStatusType.FIELD_CARD_MOVE
        ) {
          this.getPlayer(isEnemy).setPlayerStatus(PlayerStatusType.NONE);
        } else {
          this.getPlayerCardById(selectedCard).status = CardStatus.DONE;
        }
        this.getPlayer(isEnemy).setPlayerTurnStatus(
          PlayerTurnStatusType.ACTION
        );

        break;
      default:
        break;
    }
  }

  toBonds(isEnemy: boolean) {
    const selectedHand = this.operatedController.selectedCard;
    if (
      selectedHand === null ||
      this.handChoicedValidate(selectedHand, isEnemy) ||
      this.getPlayer(isEnemy).playerTurnStatus >= PlayerTurnStatusType.BOND
    ) {
      return;
    }

    //絆フェイズにしかカードは絆に置けない、置いたら出撃フェイズへ
    this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.SORTIE);
    this.getPlayerCardById(selectedHand).location = CardLocation.BOND;
  }

  attackValidate(
    attackCard: GameCardStatusInterface,
    guardCard: GameCardStatusInterface
  ) {
    return (
      attackCard.isEnemy === guardCard.isEnemy ||
      attackCard.status === CardStatus.DONE ||
      this.getPlayer(attackCard.isEnemy).playerTurnStatus ===
        PlayerTurnStatusType.END
    );
  }

  attack(guardCard: GameCardStatusInterface) {
    const attackCard = this.operatedController.selectedCard;
    if (attackCard === null || this.attackValidate(attackCard, guardCard)) {
      return;
    }
    attackCard.status = CardStatus.DONE;
    this.getPlayer(attackCard.isEnemy).setPlayerTurnStatus(
      PlayerTurnStatusType.ACTION
    );

    const attackSupportCard = this.getDeck(attackCard.isEnemy)[0];
    attackSupportCard.location = CardLocation.SUPPORT;
    const guardSupportCard = this.getDeck(guardCard.isEnemy)[0];
    guardSupportCard.location = CardLocation.SUPPORT;

    const [
      attackPower,
      attackPowerMessage,
      attackSupportEffectMessage,
      onCloseAction,
    ] = (() => {
      const supportSucceed =
        attackCard.cardData.char_name !== attackSupportCard.cardData.char_name;
      const power = Number(attackCard.cardData.power);
      const supportPower = Number(attackSupportCard.cardData.support_power);
      if (supportSucceed) {
        const supportEffect = attackSupportCard.cardData.support_effect;
        const defaultSupportPowerMessage = `支援力: ${attackSupportCard.cardData.support_power} 　　　　　`;
        const defaultSupportMessage = `${supportEffect}の紋章　　　　　`;
        switch (supportEffect) {
          case supportEffects.ATTACK:
            return [
              power + supportPower + 20,
              defaultSupportPowerMessage,
              `${supportEffect}の紋章(+20) 　　`,
            ];
          case supportEffects.DARK:
            //暗闇は相手の状態を変更する
            if (this.getHand(!attackSupportCard.isEnemy).length > 4) {
              this.getPlayer(!attackSupportCard.isEnemy).setPlayerStatus(
                PlayerStatusType.HAND_TRASH
              );
              return [
                power + supportPower,
                defaultSupportPowerMessage,
                defaultSupportMessage,
                () => {
                  setTimeout(() => {
                    createOkDialog(
                      `${supportEffect}の紋章`,
                      "相手は手札を一枚退避に送る"
                    );
                  });
                },
              ];
            }
            break;
          case supportEffects.FLY:
            this.getPlayer(attackSupportCard.isEnemy).setPlayerStatus(
              PlayerStatusType.FIELD_CARD_MOVE
            );
            return [
              power + supportPower,
              defaultSupportPowerMessage,
              defaultSupportMessage,
              () => {
                setTimeout(() => {
                  createDialog(
                    `${supportEffect}の紋章`,
                    "味方を一体移動させますか?",
                    () => {},
                    () => {
                      this.getPlayer(guardCard.isEnemy).setPlayerStatus(
                        PlayerStatusType.NONE
                      );
                    }
                  );
                });
              },
            ];
          case supportEffects.HERO:
            if (attackSupportCard.cardData.color === guardCard.cardData.color) {
              return [
                power + supportPower,
                defaultSupportPowerMessage,
                defaultSupportMessage,
              ];
            }
            break;
          case supportEffects.DORAGON:
            if (
              attackCard.cardData.color === attackSupportCard.cardData.color
            ) {
              this.getPlayer(attackSupportCard.isEnemy).setPlayerStatus(
                PlayerStatusType.HAND_TO_BOND
              );
              return [
                power + supportPower,
                defaultSupportPowerMessage,
                defaultSupportMessage,
                () => {
                  setTimeout(() => {
                    createDialog(
                      `${supportEffect}の紋章`,
                      "手札を絆エリアに置きますか?",
                      () => {},
                      () => {
                        this.getPlayer(guardCard.isEnemy).setPlayerStatus(
                          PlayerStatusType.NONE
                        );
                      }
                    );
                  });
                },
              ];
            }
            break;
          case supportEffects.MAGIC:
            this.deckDraw(attackSupportCard.isEnemy);
            this.getPlayer(attackSupportCard.isEnemy).setPlayerStatus(
              PlayerStatusType.HAND_TRASH
            );
            return [
              power + supportPower,
              defaultSupportPowerMessage,
              defaultSupportMessage,
              () => {
                setTimeout(() => {
                  createOkDialog(
                    `${supportEffect}の紋章`,
                    "カードを一枚引いて、一枚退避に送る"
                  );
                });
              },
            ];
          default:
            break;
        }
        return [
          power + supportPower,
          defaultSupportPowerMessage,
          "(支援効果なし) 　　　",
        ];
      } else {
        return [power, "(支援失敗) 　　　　　", "(支援失敗) 　　　　　"];
      }
    })();

    const [guardPower, guardPowerMessage, guardSupportEffectMessage] = (() => {
      const supportSucceed =
        guardCard.cardData.char_name !== guardSupportCard.cardData.char_name;
      const power = Number(guardCard.cardData.power);
      const supportPower = Number(guardSupportCard.cardData.support_power);
      if (supportSucceed) {
        const supportEffect = guardSupportCard.cardData.support_effect;
        switch (supportEffect) {
          case supportEffects.GUARDS:
            return [
              power + supportPower + 20,
              `支援力: ${guardSupportCard.cardData.support_power}　　　　　　`,
              `${supportEffect}の紋章(+20) 　　`,
            ];
          case supportEffects.PRAY:
            return [
              power + supportPower,
              `支援力: ${guardSupportCard.cardData.support_power}　　　　　　`,
              `${supportEffect}の紋章 　　　　　`,
            ];
          default:
            return [
              power + supportPower,
              `支援力: ${guardSupportCard.cardData.support_power}　　　　　　`,
              "(支援効果なし)　　　　",
            ];
        }
      } else {
        return [power, "(支援失敗) 　　　　　　", "(支援失敗) 　　　　　　"];
      }
    })();

    const isWin = Number(attackPower) >= guardPower;
    const title = isWin ? "攻撃側の勝利!" : "防御側の勝利!";
    const message = `攻撃　　　　　　　　防衛　　　　　　　　　
    ------------------------------------------------------------
      戦闘力: ${attackCard.cardData.power}　　　　　 戦闘力: ${guardCard.cardData.power}　　　　　　
      ${attackPowerMessage}${guardPowerMessage}
      ${attackSupportEffectMessage}${guardSupportEffectMessage}
      合計　: ${attackPower}　　　　　 合計　: ${guardPower}　　　　　　`;

    const avoidanceCard = this.getHand(guardCard.isEnemy).find(
      (c) => c.cardData.char_name === guardCard.cardData.char_name
    );
    const killCard = this.getHand(attackCard.isEnemy).find(
      (c) => c.cardData.char_name === attackCard.cardData.char_name
    );

    const noAvoidanceFlow = () => {
      if (
        guardCard.cardData.char_name ===
        this.getPlayer(guardCard.isEnemy).heroCardCharName
      ) {
        if (
          attackSupportCard.cardData.support_effect === supportEffects.HERO &&
          attackSupportCard.cardData.color === guardCard.cardData.color
        ) {
          const orbCards = this.getOrb(guardCard.isEnemy).slice(0, 2);
          if (orbCards) {
            orbCards.map((orbCard) => (orbCard.location = CardLocation.HAND));
          } else {
            const message = guardCard.isEnemy
              ? "あなたの勝ちです！"
              : "あなたの負けです...";
            setTimeout(() => {
              createOkDialog("ゲーム終了", message);
            });
          }
        } else {
          const orbCard = this.getOrb(guardCard.isEnemy)[0];
          if (orbCard) {
            orbCard.location = CardLocation.HAND;
          } else {
            const message = guardCard.isEnemy
              ? "あなたの勝ちです！"
              : "あなたの負けです...";
            setTimeout(() => {
              createOkDialog("ゲーム終了", message);
            });
          }
        }
      } else {
        this.getPlayerCardById(guardCard).location = CardLocation.EVACUATION;
        this.getFieldUnderCard(guardCard, guardCard.isEnemy).map(
          (card) => (card.location = CardLocation.EVACUATION)
        );
      }
      //　おまじない
      this.setPlaterCards(this.getHand(guardCard.isEnemy)[0]);
    };

    const [yesButtonFlow, yesButtonMessage] = (() => {
      if (isWin) {
        // 回避がなかった時の処理
        if (avoidanceCard) {
          return [
            () => {
              avoidanceCard.location = CardLocation.EVACUATION;
              this.setPlaterCards(avoidanceCard);
            },
            "回避",
          ];
        } else {
          return [noAvoidanceFlow, "OK"];
        }
      } else {
        if (
          killCard &&
          guardSupportCard.cardData.support_effect !== supportEffects.PRAY
        ) {
          return [
            () => {
              killCard.location = CardLocation.EVACUATION;
              this.setPlaterCards(killCard);
              //必殺に対して回避があるか確認
              if (avoidanceCard) {
                setTimeout(() => {
                  createDialog(
                    "",
                    `${avoidanceCard.cardData.char_name}は回避しますか?`,
                    () => {
                      avoidanceCard.location = CardLocation.EVACUATION;
                      this.setPlaterCards(avoidanceCard);
                    },
                    noAvoidanceFlow
                  );
                });
              }
            },
            "必殺",
          ];
        } else {
          return [() => {}, "OK"];
        }
      }
    })();

    const [noButtonFlow, noButtonMessage] = (() => {
      if (isWin) {
        if (avoidanceCard) {
          return [noAvoidanceFlow, "回避なし"];
        } else {
          return [null, ""];
        }
      } else {
        if (
          killCard &&
          guardSupportCard.cardData.support_effect !== supportEffects.PRAY
        ) {
          return [() => {}, "必殺なし"];
        } else {
          return [null, ""];
        }
      }
    })();

    const fixNoButtonFlow = noButtonFlow
      ? () => {
          (noButtonFlow as () => void)();
          this.getSupport(guardCard.isEnemy).location = CardLocation.EVACUATION;
          this.getSupport(attackCard.isEnemy).location =
            CardLocation.EVACUATION;
          //　おまじない
          this.setPlaterCards(this.getEvacuation(attackCard.isEnemy)[0]);
          if (onCloseAction) {
            (onCloseAction as () => void)();
          }
        }
      : null;

    createDialog(
      title,
      message,
      () => {
        (yesButtonFlow as () => void)();
        //サポート→退避にするのと、行動済みにするのは共通処理
        this.getSupport(guardCard.isEnemy).location = CardLocation.EVACUATION;
        this.getSupport(attackCard.isEnemy).location = CardLocation.EVACUATION;
        //　おまじない
        this.setPlaterCards(this.getEvacuation(attackCard.isEnemy)[0]);
        if (onCloseAction) {
          (onCloseAction as () => void)();
        }
      },
      fixNoButtonFlow,
      yesButtonMessage as string,
      noButtonMessage as string
    );
  }
}

export default GameManager;
