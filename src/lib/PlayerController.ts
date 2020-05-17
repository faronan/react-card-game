import { useState } from "react";

export interface playerController {
  heroCardCharName: string;
  isBondDone: boolean;
  setIsBondDone: (_: boolean) => void;
}

export const usePlayerController = (cardCharName: string) => {
  const [heroCardCharName, _] = useState(cardCharName);
  const [isBondDone, setIsBondDone] = useState(false);
  return {
    heroCardCharName,
    isBondDone,
    setIsBondDone,
  };
};
