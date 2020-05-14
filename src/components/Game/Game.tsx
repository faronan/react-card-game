import React from "react";
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
            status: CardStatus.WIP,
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
    useGameCardController(deckToGameCardStatusArray(enemyDeck, true)),
    useOperatedController()
  );

  return (
    <hooksContexts.Provider value={gameManager}>
      <EnemyPlayer></EnemyPlayer>
      <MyPlayer></MyPlayer>
      <Buttons></Buttons>
    </hooksContexts.Provider>
  );
};
