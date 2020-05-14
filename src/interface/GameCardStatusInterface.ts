import { CardInterface } from "./CardInterface";
/* eslint-disable no-unused-vars */
export interface GameCardStatusInterface {
  id: number;
  card_data: CardInterface;
  is_enemy: boolean;
  status: CardStatus;
}

export enum CardStatus {
  NONE,
  FIELD_DONE,
  BOND_DONE,
  BOND_REVERSE,
}
