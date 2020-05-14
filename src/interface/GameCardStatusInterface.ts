import { CardInterface } from "./CardInterface";
/* eslint-disable no-unused-vars */
export interface GameCardStatusInterface {
  id: number;
  card_data: CardInterface;
  is_enemy: boolean;
  status: CardStatus;
  location: CardLocation;
}

export enum CardStatus {
  WIP,
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
