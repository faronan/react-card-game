import { useState } from "react";
import { GameCardStatusInterface } from "../interface/GameCardStatusInterface";
// eslint-disable-next-line no-unused-vars

export interface gameCardController {
  playerCards: GameCardStatusInterface[];
  setPlayerCards: (cards: GameCardStatusInterface[]) => void;
}

export const useGameCardController = (deckCards: GameCardStatusInterface[]) => {
  const [playerCards, setPlayerCards] = useState<GameCardStatusInterface[]>(
    deckCards
  );
  return {
    playerCards,
    setPlayerCards: (cards: GameCardStatusInterface[]) => {
      setPlayerCards(cards);
    },
  };
};
