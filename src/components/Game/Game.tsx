import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardInterface } from "../../interface/CardInterface";
import { DeckInterface } from "../../interface/DeckInterface";
import GameManager from "../../lib/GameManager";
import { useOperatedController } from "../../lib/operatedController";
import {
  GameCardStatusInterface,
  CardStatus,
  CardLocation,
} from "../../interface/GameCardStatusInterface";
import Buttons from "./GameComponents/Buttons";
import MyPlayer from "./GameComponents/MyPlayer";
import EnemyPlayer from "./GameComponents/EnemyPlayer";
import { useGameCardController } from "../../lib/GameCardController";

import "../../css/style.css";
import { usePlayerController } from "../../lib/PlayerController";
import { PlayerTurnStatusType } from "../../interface/PlayerTurnStatusTypeInterface";
import { realTimeDb } from "../../Firebase";
import {
  fetchData,
  formatDataToGameManager,
  setDatabase,
} from "../../lib/databaseAdapter";

export const hooksContexts = React.createContext<GameManager>(
  new GameManager()
);

export const Game = () => {
  const location = useLocation();
  interface state {
    cards: CardInterface[];
    myDeck: DeckInterface;
    enemyDeck: DeckInterface;
  }
  const state = location.state as state;
  const cards = state["cards"];
  const myDeck = state["myDeck"];
  const enemyDeck = state["enemyDeck"];
  const [isSetup, setIsSetup] = useState(false);

  const deckToGameCardStatusArray = (deck: DeckInterface, isEnemy = false) => {
    return Object.entries(deck.cardIdCount)
      .map(([cardId, count]) => {
        const card = cards.find((card) => card.id.toString() === cardId);
        return [...Array(count)].map((_, i) => {
          const gameCardStatus: GameCardStatusInterface = {
            id: i,
            cardData: card!,
            isEnemy: isEnemy,
            status: CardStatus.UNACTION,
            location: CardLocation.DECK,
          };
          return gameCardStatus;
        });
      })
      .flat();
  };

  const getHeroCharName = (id: number) => {
    return cards.find((c) => Number(c.id) === id)!.charName;
  };

  const gameManager = new GameManager(
    useGameCardController(deckToGameCardStatusArray(myDeck)),
    usePlayerController(false, getHeroCharName(enemyDeck.HeroCardId)),
    useGameCardController(deckToGameCardStatusArray(enemyDeck, true)),
    usePlayerController(true, getHeroCharName(enemyDeck.HeroCardId)),
    useOperatedController()
  );

  const preInitialize = () => {
    (async () => {
      fetchData().then((res) => {
        const key = "game1";
        if (res) {
          formatDataToGameManager(res[key], gameManager);
          setIsSetup(true);
          return;
        }
        {
          initialize();
          setIsSetup(true);
        }
      });
    })();
  };

  const initialize = () => {
    //
    const INITIAL_HAND_COUNT = 6;
    const INITIAL_ORB_COUNT = 5;
    const shuffle = ([...arr]) => {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    };

    const shuffledMyDeck: GameCardStatusInterface[] = shuffle(
      gameManager.getDeck()
    );
    const myHeroCard = gameManager
      .getPlayerCards()
      .find((c) => Number(c.cardData.id) === myDeck.HeroCardId)!;
    myHeroCard.location = CardLocation.FIELD_FRONT;

    const newMyDeck = shuffledMyDeck.filter((card) => card !== myHeroCard);

    const myOrbCards = [...Array(INITIAL_ORB_COUNT)].map((_, i) => {
      const myOrbCard = newMyDeck[i];
      myOrbCard.location = CardLocation.ORB;
      return myOrbCard;
    });
    const myHandCards = [...Array(INITIAL_HAND_COUNT)].map((_, i) => {
      const myHandCard = newMyDeck[i + INITIAL_ORB_COUNT];
      myHandCard.location = CardLocation.HAND;
      return myHandCard;
    });
    const myOtherHeroCard = newMyDeck
      .slice(INITIAL_HAND_COUNT + INITIAL_ORB_COUNT, 1000)
      .filter(
        (c) => c.id !== myHeroCard.id || c.cardData !== myHeroCard.cardData
      );

    gameManager.playerCards.setPlayerCards([
      ...myOtherHeroCard,
      ...myOrbCards,
      ...myHandCards,
      myHeroCard,
    ]);

    const shuffledEnemyDeck: GameCardStatusInterface[] = shuffle(
      gameManager.getDeck(true)
    );
    const enemyHeroCard = gameManager
      .getPlayerCards(true)
      .find((c) => Number(c.cardData.id) === myDeck.HeroCardId)!;
    enemyHeroCard.location = CardLocation.FIELD_FRONT;

    const newEnemyDeck = shuffledEnemyDeck.filter(
      (card) => card !== enemyHeroCard
    );

    const enemyOrbCards = [...Array(INITIAL_ORB_COUNT)].map((_, i) => {
      const enemyOrbCard = newEnemyDeck[i];
      enemyOrbCard.location = CardLocation.ORB;
      return enemyOrbCard;
    });
    const enemyHandCards = [...Array(INITIAL_HAND_COUNT)].map((_, i) => {
      const enemyHandCard = newEnemyDeck[i + INITIAL_ORB_COUNT];
      enemyHandCard.location = CardLocation.HAND;
      return enemyHandCard;
    });

    const enemyOtherHeroCards = newEnemyDeck
      .slice(INITIAL_ORB_COUNT + INITIAL_HAND_COUNT, 1000)
      .filter(
        (c) =>
          c.id !== enemyHeroCard.id || c.cardData !== enemyHeroCard.cardData
      );

    gameManager.enemyPlayerCards.setPlayerCards([
      ...enemyOtherHeroCards,
      ...enemyOrbCards,
      ...enemyHandCards,
      enemyHeroCard,
    ]);
    setDatabase(gameManager);

    gameManager
      .getPlayer(true)
      .updatePlayerTurnStatus(PlayerTurnStatusType.END);
    gameManager.getPlayer(false).addTurnCount();
    //updatePlayerData(true, null, PlayerTurnStatusType.END);
    //updatePlayerData(false, null, null, 1);
  };

  useEffect(() => {
    preInitialize();
  }, []);

  realTimeDb.on("child_changed", function (snapshot) {
    //ここで値を読んでるから更新できそう
    const res = snapshot.val();
    if (res) {
      formatDataToGameManager(res, gameManager);
    }
  });

  return (
    <hooksContexts.Provider value={gameManager}>
      <EnemyPlayer></EnemyPlayer>
      <MyPlayer></MyPlayer>
      <Buttons></Buttons>
    </hooksContexts.Provider>
  );
};
