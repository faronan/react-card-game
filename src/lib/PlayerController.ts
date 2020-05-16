import { useState } from "react";

export interface playerController {
  isBondDone: boolean;
  setIsBondDone: (_: boolean) => void;
}

export const usePalyerController = () => {
  const [isBondDone, setIsBondDone] = useState(false);
  return {
    isBondDone,
    setIsBondDone,
  };
};
