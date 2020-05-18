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

  cardSelect(card: GameCardStatusInterface, isEnemy = false) {
    //TODO: 効果発動時のvalidateが相当面倒
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
        case CardLocation.BOND:
          this.bondCardChoice(card, isEnemy);
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
  locationSelect(type: selectedType, isEnemy = false) {
    //未選択状態
    if (!this.operatedController.isSelected) {
      return;
    }

    // 選択状態
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
        c.card_data.char_name === card.card_data.char_name
    );
  }

  getSupport(isEnemy = false) {
    return this.getPlayerCards(isEnemy).find(
      (c) => c.location === CardLocation.SUPPORT
    )!;
  }

  goNextTurn(isEnemy: boolean) {
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
    this.setPlaterCards(this.getPlayerCards(isEnemy)[0], isEnemy);

    this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.BEGIN);

    this.draw(isEnemy);
    //相手のターン開始時に前衛にカードがない場合、全ての後衛カードを前衛に移動する(進軍)
    if (this.getField(!isEnemy, false).length === 0) {
      this.getField(!isEnemy, true).map(
        (card) => (card.location = CardLocation.FIELD_FRONT)
      );
      //this.setPlaterCards(this.getField(!isEnemy, true)[0], !isEnemy);
    }
  }

  turnEnd(isEnemy: boolean) {
    //操作系のリセット
    this.operatedController.unselect();

    this.getPlayer(isEnemy).setPlayerStatus(PlayerStatusType.NONE);
    this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.END);
  }

  handCardChoice(card: GameCardStatusInterface) {
    switch (this.getPlayer(card.is_enemy).playerStatus) {
      case PlayerStatusType.HAND_TRASH:
        card.location = CardLocation.EVACUATION;
        this.getPlayer(card.is_enemy).setPlayerStatus(PlayerStatusType.NONE);
        break;
      case PlayerStatusType.HAND_TO_BOND:
        card.location = CardLocation.BOND;
        this.getPlayer(card.is_enemy).setPlayerStatus(PlayerStatusType.NONE);
        break;
      default:
        this.operatedController.select(selectedType.NONE, card);
        break;
    }
  }

  fieldFrontCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedType.NONE, card);
  }

  fieldBackCardChoice(card: GameCardStatusInterface) {
    this.operatedController.select(selectedType.NONE, card);
  }

  bondCardChoice(card: GameCardStatusInterface, isEnemy = false) {
    const reverseOrbCard = this.getPlayerCardById(card, isEnemy);
    reverseOrbCard.status = CardStatus.REVERSE;
    this.setPlaterCards(reverseOrbCard, isEnemy);
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
      this.getNonReversedBond(isEnemy).filter(
        (card) => card.card_data.color === color
      ).length > 0
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
        //出撃フェイズにしか出撃できない
        if (
          this.getPlayer(isEnemy).playerTurnStatus > PlayerTurnStatusType.SORTIE
        ) {
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
          (selectedCard.status === CardStatus.DONE &&
            this.getPlayer(isEnemy).playerStatus !==
              PlayerStatusType.FIELD_CARD_MOVE)
        ) {
          return;
        }
        this.getPlayerCardById(
          selectedCard,
          isEnemy
        ).location = this.getCardLocationFrontOrBack(isBack);
        if (
          this.getPlayer(isEnemy).playerStatus ===
          PlayerStatusType.FIELD_CARD_MOVE
        ) {
          this.getPlayer(isEnemy).setPlayerStatus(PlayerStatusType.NONE);
        } else {
          this.getPlayerCardById(selectedCard, isEnemy).status =
            CardStatus.DONE;
        }
        this.getPlayer(isEnemy).setPlayerTurnStatus(
          PlayerTurnStatusType.ACTION
        );

        break;
      // 後ろのカードが選択されていた時
      case CardLocation.FIELD_BACK:
        if (
          this.fromFieldCardValidate(selectedCard, isEnemy, true) ||
          isBack ||
          (selectedCard.status === CardStatus.DONE &&
            this.getPlayer(isEnemy).playerStatus !==
              PlayerStatusType.FIELD_CARD_MOVE)
        ) {
          return;
        }
        this.getPlayerCardById(
          selectedCard,
          isEnemy
        ).location = this.getCardLocationFrontOrBack(isBack);
        if (
          this.getPlayer(isEnemy).playerStatus ===
          PlayerStatusType.FIELD_CARD_MOVE
        ) {
          this.getPlayer(isEnemy).setPlayerStatus(PlayerStatusType.NONE);
        } else {
          this.getPlayerCardById(selectedCard, isEnemy).status =
            CardStatus.DONE;
        }
        this.getPlayer(isEnemy).setPlayerTurnStatus(
          PlayerTurnStatusType.ACTION
        );
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
    //絆フェイズにしかカードは絆に置けない、置いたら出撃フェイズへ
    if (this.getPlayer(isEnemy).playerTurnStatus > PlayerTurnStatusType.BOND) {
      return;
    }
    this.getPlayer(isEnemy).setPlayerTurnStatus(PlayerTurnStatusType.SORTIE);
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
    this.getPlayer(selectedAttackCard.is_enemy).setPlayerTurnStatus(
      PlayerTurnStatusType.ACTION
    );

    //cardが攻撃された側、selectedAttackCardが攻撃する側
    const attackSupportCard = this.getDeck(selectedAttackCard.is_enemy)[0];
    attackSupportCard.location = CardLocation.SUPPORT;
    const guardSupportCard = this.getDeck(card.is_enemy)[0];
    guardSupportCard.location = CardLocation.SUPPORT;

    const [
      attackPower,
      attackPowerMessage,
      attackSupportEffectMessage,
      onCloseAction,
    ] = (() => {
      const supportSucceed =
        selectedAttackCard.card_data.char_name !==
        attackSupportCard.card_data.char_name;
      const power = Number(selectedAttackCard.card_data.power);
      const supportPower = Number(attackSupportCard.card_data.support_power);
      if (supportSucceed) {
        const supportEffect = attackSupportCard.card_data.support_effect;
        const defaultSupportPowerMessage = `支援力: ${attackSupportCard.card_data.support_power} 　　　　　`;
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
            if (this.getHand(!attackSupportCard.is_enemy).length > 4) {
              this.getPlayer(!attackSupportCard.is_enemy).setPlayerStatus(
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
                      "手札を一枚退避に送る"
                    );
                  });
                },
              ];
            }
            break;
          case supportEffects.FLY:
            this.getPlayer(attackSupportCard.is_enemy).setPlayerStatus(
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
                      this.getPlayer(card.is_enemy).setPlayerStatus(
                        PlayerStatusType.NONE
                      );
                    }
                  );
                });
              },
            ];
          case supportEffects.HERO:
            if (attackSupportCard.card_data.color === card.card_data.color) {
              return [
                power + supportPower,
                defaultSupportPowerMessage,
                defaultSupportMessage,
              ];
            }
            break;
          case supportEffects.DORAGON:
            if (
              selectedAttackCard.card_data.color ===
              attackSupportCard.card_data.color
            ) {
              this.getPlayer(attackSupportCard.is_enemy).setPlayerStatus(
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
                        this.getPlayer(card.is_enemy).setPlayerStatus(
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
            this.draw(attackSupportCard.is_enemy);
            this.getPlayer(attackSupportCard.is_enemy).setPlayerStatus(
              PlayerStatusType.HAND_TRASH
            );
            return [
              power + supportPower,
              defaultSupportPowerMessage,
              defaultSupportMessage,
              setTimeout(() => {
                createOkDialog(
                  `${supportEffect}の紋章`,
                  "カードを一枚引いて、一枚退避に送る"
                );
              }),
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
        card.card_data.char_name !== guardSupportCard.card_data.char_name;
      const power = Number(card.card_data.power);
      const supportPower = Number(guardSupportCard.card_data.support_power);
      if (supportSucceed) {
        const supportEffect = guardSupportCard.card_data.support_effect;
        switch (supportEffect) {
          case supportEffects.GUARDS:
            return [
              power + supportPower + 20,
              `支援力: ${guardSupportCard.card_data.support_power}　　　　　　`,
              `${supportEffect}の紋章(+20) 　　`,
            ];
          case supportEffects.PRAY:
            return [
              power + supportPower,
              `支援力: ${guardSupportCard.card_data.support_power}　　　　　　`,
              `${supportEffect}の紋章 　　　　　`,
            ];
          default:
            return [
              power + supportPower,
              `支援力: ${guardSupportCard.card_data.support_power}　　　　　　`,
              "(支援効果なし)　　　　",
            ];
        }
      } else {
        return [power, "(支援失敗) 　　　　　　", "(支援失敗) 　　　　　　"];
      }
    })();

    //TODO: 攻撃時の挙動

    const isWin = Number(attackPower) >= guardPower;
    const title = isWin ? "攻撃側の勝利!" : "防御側の勝利!";
    const message = `攻撃　　　　　　　　防衛　　　　　　　　　
    ------------------------------------------------------------
      戦闘力: ${selectedAttackCard.card_data.power}　　　　　 戦闘力: ${card.card_data.power}　　　　　　
      ${attackPowerMessage}${guardPowerMessage}
      ${attackSupportEffectMessage}${guardSupportEffectMessage}
      合計　: ${attackPower}　　　　　 合計　: ${guardPower}　　　　　　`;

    const avoidanceCard = this.getHand(card.is_enemy).find(
      (c) => c.card_data.char_name === card.card_data.char_name
    );
    const killCard = this.getHand(selectedAttackCard.is_enemy).find(
      (c) => c.card_data.char_name === selectedAttackCard.card_data.char_name
    );

    const noAvoidanceFlow = () => {
      if (
        card.card_data.char_name ===
        this.getPlayer(card.is_enemy).heroCardCharName
      ) {
        if (
          attackSupportCard.card_data.support_effect === supportEffects.HERO &&
          attackSupportCard.card_data.color === card.card_data.color
        ) {
          const orbCards = this.getOrb(card.is_enemy).slice(0, 2);
          if (orbCards) {
            orbCards.map((orbCard) => (orbCard.location = CardLocation.HAND));
          } else {
            const message = card.is_enemy
              ? "あなたの勝ちです！"
              : "あなたの負けです...";
            setTimeout(() => {
              createOkDialog("ゲーム終了", message);
            }, 300);
          }
        } else {
          const orbCard = this.getOrb(card.is_enemy)[0];
          if (orbCard) {
            orbCard.location = CardLocation.HAND;
          } else {
            const message = card.is_enemy
              ? "あなたの勝ちです！"
              : "あなたの負けです...";
            setTimeout(() => {
              createOkDialog("ゲーム終了", message);
            }, 300);
          }
        }
      } else {
        this.getPlayerCardById(card, card.is_enemy).location =
          CardLocation.EVACUATION;
        this.getFieldUnderCard(card, card.is_enemy).map(
          (card) => (card.location = CardLocation.EVACUATION)
        );
      }
      //　おまじない
      this.setPlaterCards(this.getHand(card.is_enemy)[0], card.is_enemy);
    };

    const [yesButtonFlow, yesButtonMessage] = (() => {
      if (isWin) {
        // 回避がなかった時の処理
        if (avoidanceCard) {
          return [
            () => {
              avoidanceCard.location = CardLocation.EVACUATION;
              this.setPlaterCards(avoidanceCard, avoidanceCard.is_enemy);
            },
            "回避",
          ];
        } else {
          return [noAvoidanceFlow, "OK"];
        }
      } else {
        if (
          killCard &&
          guardSupportCard.card_data.support_effect !== supportEffects.PRAY
        ) {
          return [
            () => {
              killCard.location = CardLocation.EVACUATION;
              this.setPlaterCards(killCard, killCard.is_enemy);
              //必殺に対して回避があるか確認
              if (avoidanceCard) {
                setTimeout(() => {
                  createDialog(
                    "",
                    `${avoidanceCard.card_data.char_name}は回避しますか?`,
                    () => {
                      avoidanceCard.location = CardLocation.EVACUATION;
                      this.setPlaterCards(
                        avoidanceCard,
                        avoidanceCard.is_enemy
                      );
                    },
                    noAvoidanceFlow
                  );
                }, 300);
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
          guardSupportCard.card_data.support_effect !== supportEffects.PRAY
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
          this.getSupport(card.is_enemy).location = CardLocation.EVACUATION;
          this.getSupport(selectedAttackCard.is_enemy).location =
            CardLocation.EVACUATION;
          //　おまじない
          this.setPlaterCards(
            this.getEvacuation(selectedAttackCard.is_enemy)[0],
            selectedAttackCard.is_enemy
          );
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
        this.getSupport(card.is_enemy).location = CardLocation.EVACUATION;
        this.getSupport(selectedAttackCard.is_enemy).location =
          CardLocation.EVACUATION;
        //　おまじない
        this.setPlaterCards(
          this.getEvacuation(selectedAttackCard.is_enemy)[0],
          selectedAttackCard.is_enemy
        );
        if (onCloseAction) {
          (onCloseAction as () => void)();
        }
      },
      fixNoButtonFlow,
      yesButtonMessage as string,
      noButtonMessage as string
    );

    this.operatedController.unselect();
  }
}

export default GameManager;
