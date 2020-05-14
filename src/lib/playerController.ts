import { useState } from "react";
import { GameCardStatusInterface } from "../interface/GameCardStatusInterface";
// eslint-disable-next-line no-unused-vars


export interface playerController {
  deck: GameCardStatusInterface[];
  hand: GameCardStatusInterface[];
  field: fieldInterface;
  bonds: GameCardStatusInterface[];
  support: GameCardStatusInterface | null;
  evacuation: GameCardStatusInterface[];
  orb: GameCardStatusInterface[];
  //以下関数
  addDeck: (cards: GameCardStatusInterface[]) => void;
  removeDeck: (cards: GameCardStatusInterface[]) => void;
  addHand: (cards: GameCardStatusInterface[]) => void;
  removeHand: (cards: GameCardStatusInterface[]) => void;
  changeFrontCard: (
    fromCards: GameCardStatusInterface[],
    toCards: GameCardStatusInterface[]
  ) => void;
  changeBackCard: (
    fromCards: GameCardStatusInterface[],
    toCards: GameCardStatusInterface[]
  ) => void;
  addFrontField: (cards: GameCardStatusInterface[]) => void;
  removeFrontField: (cards: GameCardStatusInterface[]) => void;
  addBackField: (cards: GameCardStatusInterface[]) => void;
  removeBackField: (cards: GameCardStatusInterface[]) => void;
  moveFieldBackToFront: (cards: GameCardStatusInterface[]) => void;
  moveFieldFrontToBack: (cards: GameCardStatusInterface[]) => void;
  addBonds: (cards: GameCardStatusInterface[]) => void;
  removeBonds: (cards: GameCardStatusInterface[]) => void;
  turnSupport: () => GameCardStatusInterface;
  throwSupport: () => void;
  addEvacuation: (cards: GameCardStatusInterface[]) => void;
  removeEvacuation: (cards: GameCardStatusInterface[]) => void;
  addOrb: (cards: GameCardStatusInterface[]) => void;
  removeOrb: (cards: GameCardStatusInterface[]) => void;
}

interface fieldInterface {
  front: GameCardStatusInterface[];
  back: GameCardStatusInterface[];
}

export const usePlayerController = (defaultDeck: GameCardStatusInterface[]) => {
  const [deck, setDeck] = useState(defaultDeck);
  const [hand, setHand] = useState<GameCardStatusInterface[]>([]);
  const [field, setField] = useState<fieldInterface>({ front: [], back: [] });
  const [bonds, setBonds] = useState<GameCardStatusInterface[]>([]);
  const [support, setSupport] = useState<GameCardStatusInterface | null>(null);
  const [evacuation, setEvacuation] = useState<GameCardStatusInterface[]>([]);
  const [orb, setOrb] = useState<GameCardStatusInterface[]>([]);

  const addDeck = (cards: GameCardStatusInterface[]) => {
    setDeck(deck.concat(cards));
  };
  const removeDeck = (cards: GameCardStatusInterface[]) => {
    setDeck(deck.filter((d) => !cards.map((c) => c.id).includes(d.id)));
  };
  const addHand = (cards: GameCardStatusInterface[]) => {
    setHand(hand.concat(cards));
  };
  const removeHand = (cards: GameCardStatusInterface[]) => {
    setHand(hand.filter((h) => !cards.map((c) => c.id).includes(h.id)));
  };

  const changeFrontCard = (
    fromCards: GameCardStatusInterface[],
    toCards: GameCardStatusInterface[]
  ) => {
    const frontField = field.front
      .filter((f) => !fromCards.map((c) => c.id).includes(f.id))
      .concat(toCards);
    setField({ front: frontField, back: field.back });
  };

  const changeBackCard = (
    fromCards: GameCardStatusInterface[],
    toCards: GameCardStatusInterface[]
  ) => {
    const backField = field.back
      .filter((f) => !fromCards.map((c) => c.id).includes(f.id))
      .concat(toCards);
    setField({ front: field.front, back: backField });
  };

  const addFrontField = (cards: GameCardStatusInterface[]) => {
    const frontField = field.front.concat(cards);
    setField({ front: frontField, back: field.back });
  };
  const removeFrontField = (cards: GameCardStatusInterface[]) => {
    const frontField = field.front.filter(
      (f) => !cards.map((c) => c.id).includes(f.id)
    );
    setField({ front: frontField, back: field.back });
  };
  const addBackField = (cards: GameCardStatusInterface[]) => {
    const backField = field.back.concat(cards);
    setField({ front: field.front, back: backField });
  };
  const removeBackField = (cards: GameCardStatusInterface[]) => {
    const frontField = field.front.concat(cards);
    const backField = field.back.filter(
      (b) => !cards.map((c) => c.id).includes(b.id)
    );
    setField({ front: frontField, back: backField });
  };
  const moveFieldBackToFront = (cards: GameCardStatusInterface[]) => {
    const frontField = field.front.concat(cards);
    const backField = field.back.filter(
      (f) => !cards.map((c) => c.id).includes(f.id)
    );
    setField({ front: frontField, back: backField });
  };
  const moveFieldFrontToBack = (cards: GameCardStatusInterface[]) => {
    const frontField = field.front.filter(
      (f) => !cards.map((c) => c.id).includes(f.id)
    );
    const backField = field.back.concat(cards);
    setField({ front: frontField, back: backField });
  };
  const addBonds = (cards: GameCardStatusInterface[]) => {
    setBonds(bonds.concat(cards));
  };
  const removeBonds = (cards: GameCardStatusInterface[]) => {
    setBonds(bonds.filter((b) => !cards.map((c) => c.id).includes(b.id)));
  };
  const turnSupport = () => {
    const topOfDeck = deck[0];
    setSupport(topOfDeck);
    return topOfDeck;
  };
  const throwSupport = () => {
    setSupport(null);
  };
  const addEvacuation = (cards: GameCardStatusInterface[]) => {
    setEvacuation(evacuation.concat(cards));
  };
  const removeEvacuation = (cards: GameCardStatusInterface[]) => {
    setBonds(evacuation.filter((e) => !cards.map((c) => c.id).includes(e.id)));
  };
  const addOrb = (cards: GameCardStatusInterface[]) => {
    setOrb(orb.concat(cards));
  };
  const removeOrb = (cards: GameCardStatusInterface[]) => {
    setOrb(orb.filter((o) => !cards.map((c) => c.id).includes(o.id)));
  };

  return {
    deck,
    hand,
    field,
    bonds,
    support,
    evacuation,
    orb,
    addDeck: (cards: GameCardStatusInterface[]) => addDeck(cards),
    removeDeck: (cards: GameCardStatusInterface[]) => removeDeck(cards),
    addHand: (cards: GameCardStatusInterface[]) => addHand(cards),
    removeHand: (cards: GameCardStatusInterface[]) => removeHand(cards),
    changeFrontCard: (
      fromCards: GameCardStatusInterface[],
      toCards: GameCardStatusInterface[]
    ) => changeFrontCard(fromCards, toCards),
    changeBackCard: (
      fromCards: GameCardStatusInterface[],
      toCards: GameCardStatusInterface[]
    ) => changeBackCard(fromCards, toCards),
    addFrontField: (cards: GameCardStatusInterface[]) => addFrontField(cards),
    removeFrontField: (cards: GameCardStatusInterface[]) =>
      removeFrontField(cards),
    addBackField: (cards: GameCardStatusInterface[]) => addBackField(cards),
    removeBackField: (cards: GameCardStatusInterface[]) =>
      removeBackField(cards),
    moveFieldBackToFront: (cards: GameCardStatusInterface[]) =>
      moveFieldBackToFront(cards),
    moveFieldFrontToBack: (cards: GameCardStatusInterface[]) =>
      moveFieldFrontToBack(cards),
    addBonds: (cards: GameCardStatusInterface[]) => addBonds(cards),
    removeBonds: (cards: GameCardStatusInterface[]) => removeBonds(cards),
    turnSupport: () => turnSupport(),
    throwSupport: () => throwSupport(),
    addEvacuation: (cards: GameCardStatusInterface[]) => addEvacuation(cards),
    removeEvacuation: (cards: GameCardStatusInterface[]) =>
      removeEvacuation(cards),
    addOrb: (cards: GameCardStatusInterface[]) => addOrb(cards),
    removeOrb: (cards: GameCardStatusInterface[]) => removeOrb(cards),
  };
};
