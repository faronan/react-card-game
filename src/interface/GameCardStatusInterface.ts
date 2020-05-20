import { CardInterface } from "./CardInterface";
/* eslint-disable no-unused-vars */
export interface GameCardStatusInterface {
  id: number;
  cardData: CardInterface;
  isEnemy: boolean;
  status: CardStatus;
  location: CardLocation;
}

export enum CardStatus {
  UNACTION,
  DONE,
  REVERSE,
}

export enum CardLocation {
  DECK,
  EVACUATION,
  FIELD_FRONT,
  FIELD_BACK,
  FIELD_UNDER_CARD,
  BOND,
  HAND,
  ORB,
  SUPPORT,
}
