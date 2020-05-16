import React, { useEffect } from "react";
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
import { usePalyerController } from "../../lib/PlayerController";

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

  const deckToGameCardStatusArray = (deck: DeckInterface, is_enemy = false) => {
    return Object.entries(deck.cardIdCount)
      .map(([cardId, count]) => {
        const card = cards.find((card) => card.id.toString() === cardId);
        return [...Array(count)].map((_, i) => {
          const gameCardStatus: GameCardStatusInterface = {
            id: i,
            card_data: card!,
            is_enemy: is_enemy,
            status: CardStatus.UNACTION,
            location: CardLocation.DECK,
          };
          return gameCardStatus;
        });
      })
      .flat();
  };

  const gameManager = new GameManager(
    // deckToGameCardStatusArray(myDeck),
    // deckToGameCardStatusArray(enemyDeck, true),
    useGameCardController(deckToGameCardStatusArray(myDeck)),
    usePalyerController(myDeck.HeroCardId),
    useGameCardController(deckToGameCardStatusArray(enemyDeck, true)),
    usePalyerController(enemyDeck.HeroCardId),
    useOperatedController()
  );

  const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

  const initialize = () => {
    const shuffledMyDeck: GameCardStatusInterface[] = shuffle(
      gameManager.getDeck(false)
    );
    const myHeroCard = gameManager
      .getPlayerCards(false)
      .find((c) => Number(c.card_data.id) === myDeck.HeroCardId)!;
    myHeroCard.location = CardLocation.FIELD_FRONT;

    const newMyDeck = shuffledMyDeck.filter((card) => card !== myHeroCard);

    const myOrbCards = [...Array(5)].map((_, i) => {
      const myOrbCard = newMyDeck[i];
      myOrbCard.location = CardLocation.ORB;
      return myOrbCard;
    });
    const myHandCards = [...Array(5)].map((_, i) => {
      const myHandCard = newMyDeck[i + 5];
      myHandCard.location = CardLocation.HAND;
      return myHandCard;
    });
    const myOtherHeroCard = newMyDeck
      .slice(10, 1000)
      .filter(
        (c) => c.id !== myHeroCard.id || c.card_data !== myHeroCard.card_data
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
      .find((c) => Number(c.card_data.id) === myDeck.HeroCardId)!;
    enemyHeroCard.location = CardLocation.FIELD_FRONT;

    const newEnemyDeck = shuffledEnemyDeck.filter(
      (card) => card !== enemyHeroCard
    );

    const enemyOrbCards = [...Array(5)].map((_, i) => {
      const enemyOrbCard = newEnemyDeck[i];
      enemyOrbCard.location = CardLocation.ORB;
      return enemyOrbCard;
    });
    const enemyHandCards = [...Array(5)].map((_, i) => {
      const enemyHandCard = newEnemyDeck[i + 5];
      enemyHandCard.location = CardLocation.HAND;
      return enemyHandCard;
    });

    const enemyOtherHeroCards = newEnemyDeck
      .slice(10, 1000)
      .filter(
        (c) =>
          c.id !== enemyHeroCard.id || c.card_data !== enemyHeroCard.card_data
      );

    gameManager.enemyPlayerCards.setPlayerCards([
      ...enemyOtherHeroCards,
      ...enemyOrbCards,
      ...enemyHandCards,
      enemyHeroCard,
    ]);
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <hooksContexts.Provider value={gameManager}>
      <EnemyPlayer></EnemyPlayer>
      <MyPlayer></MyPlayer>
      <Buttons></Buttons>
    </hooksContexts.Provider>
  );
};
