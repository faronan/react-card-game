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

export const cardColors = {
  RED: "赤",
  BLUE: "青",
} as const;
type CardColors = typeof cardColors[keyof typeof cardColors];

export const supportEffects = {
  NONE: "無し",
  ATTACK: "攻撃",
  GUARDS: "守り",
  FLY: "飛行",
  MAGIC: "魔術",
  DARK: "暗闇",
  PRAY: "祈り",
  HERO: "英雄",
  DORAGON: "竜人",
  STRATEGY: "計略",
  BANDIT: "盗賊",
} as const;
type SupportEffects = typeof supportEffects[keyof typeof supportEffects];

export const cardtags = {
  MAN: "男性",
  WOMAN: "女性",
  DORAGON: "竜族",
};
type Cardtags = typeof cardtags[keyof typeof cardtags];
