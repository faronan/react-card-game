import { useState } from "react";
import { GameCardStatusInterface } from "../interface/GameCardStatusInterface";
import { selectedType } from "../interface/SelectedTypeInterface";

export interface operatedController {
  isSelected: boolean;
  fromType: selectedType;
  selectedCard: GameCardStatusInterface | null;
  select: (type: selectedType, card: GameCardStatusInterface) => void;
  unselect: () => void;
}

export const useOperatedController = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [fromType, setFromType] = useState(selectedType.NONE);
  const [
    selectedCard,
    setSelectedCard,
  ] = useState<GameCardStatusInterface | null>(null);

  return {
    isSelected,
    fromType,
    selectedCard,
    select: (type: selectedType, card: GameCardStatusInterface) => {
      setIsSelected(true);
      setFromType(type);
      setSelectedCard(card);
    },
    unselect: () => {
      setIsSelected(false);
      setFromType(selectedType.NONE);
      setSelectedCard(null);
    },
  };
};
