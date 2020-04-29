/* eslint-disable no-unused-vars */
export interface CardInterface {
  id: number;
  image: string;
  color: CardColors;
  char_name: string;
  cost: number;
  over_cost: number | null;
  power: number;
  support_power: number;
  support_effect: SupportEffects;
  tags: Cardtags[];
}

export enum CardColors {
  RED,
  BLUE,
}

export enum SupportEffects {
  ATTACK,
  GUARDS,
  FLY,
  MAGIC,
  DARK,
  PRAY,
}

export enum Cardtags {
  MAN,
  WOMAN,
}
