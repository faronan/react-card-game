import { useState } from "react";
import { GameCardStatusInterface } from "../interface/GameCardStatusInterface";
import { selectedTypeInterface } from "../interface/SelectedTypeInterface";

export interface operatedController {
  isSelected: boolean;
  fromType: selectedTypeInterface;
  selectedCard: GameCardStatusInterface | null;
  select: (type: selectedTypeInterface, card: GameCardStatusInterface) => void;
  unselect: () => void;
}

export const useOperatedController = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [fromType, setFromType] = useState(selectedTypeInterface.NONE);
  const [
    selectedCard,
    setSelectedCard,
  ] = useState<GameCardStatusInterface | null>(null);

  return {
    isSelected,
    fromType,
    selectedCard,
    select: (type: selectedTypeInterface, card: GameCardStatusInterface) => {
      setIsSelected(true);
      setFromType(type);
      setSelectedCard(card);
    },
    unselect: () => {
      setIsSelected(false);
      setFromType(selectedTypeInterface.NONE);
      setSelectedCard(null);
    },
  };
};
