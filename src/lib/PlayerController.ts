import { useState } from "react";

export interface playerController {
  heroCardId: number;
  isBondDone: boolean;
  setIsBondDone: (_: boolean) => void;
}

export const usePalyerController = (cardId: number) => {
  const [heroCardId, _] = useState(cardId);
  const [isBondDone, setIsBondDone] = useState(false);
  return {
    heroCardId,
    isBondDone,
    setIsBondDone,
  };
};
