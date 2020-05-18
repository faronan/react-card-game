/* eslint-disable no-unused-vars */
export interface CardInterface {
  id: number;
  image: string;
  color: CardColors;
  char_name: string;
  cost: number;
  over_cost: number;
  power: number;
  range: CardRange[];
  support_power: number;
  support_effect: SupportEffects;
  tags: CardTags[];
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
  FLY: "天空",
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
  DORAGON: "竜",
  SORD: "剣",
  SPEAR: "槍",
  AXE: "斧",
  BOW: "弓",
  MAGIC: "魔法",
  CANE: "杖",
  DRAGONSTONE: "竜石",
  HEAVY: "重装",
  HORSE: "獣馬",
  FLY: "飛行",
};
type CardTags = typeof cardtags[keyof typeof cardtags];

export const rangeList = [0, 1, 2, 3];
const rangeTypeList = [0, 1, 2, 3] as const;
export type CardRange = typeof rangeTypeList[number];
