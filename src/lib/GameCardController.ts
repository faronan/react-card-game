import { useState } from "react";
import { GameCardStatusInterface } from "../interface/GameCardStatusInterface";
import { updatePlayerCardData } from "./databaseAdapter";
// eslint-disable-next-line no-unused-vars

export interface gameCardController {
  playerCards: GameCardStatusInterface[];
  setPlayerCards: (cards: GameCardStatusInterface[]) => void;
  updatePlayerCards: (cards: GameCardStatusInterface[]) => void;
}

export const useGameCardController = (deckCards: GameCardStatusInterface[]) => {
  const [playerCards, setPlayerCards] = useState<GameCardStatusInterface[]>(
    deckCards
  );

  const updatePlayerCards = (cards: GameCardStatusInterface[]) => {
    setPlayerCards((_) => {
      updatePlayerCardData(cards);
      return cards;
    });
  };

  return {
    playerCards,
    setPlayerCards,
    updatePlayerCards,
  };
};
