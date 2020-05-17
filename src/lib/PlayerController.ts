import { useState } from "react";
import { PlayerStatusType } from "../interface/PlayerStatusTypeInterface";

export interface playerController {
  heroCardCharName: string;
  isBondDone: boolean;
  setIsBondDone: (_: boolean) => void;
  playerStatus: PlayerStatusType;
  setPlayerStatus: (_: PlayerStatusType) => void;
}

export const usePlayerController = (cardCharName: string) => {
  const [heroCardCharName, _] = useState(cardCharName);
  const [isBondDone, setIsBondDone] = useState(false);
  const [playerStatus, setPlayerStatus] = useState(PlayerStatusType.NONE);
  return {
    heroCardCharName,
    isBondDone,
    setIsBondDone,
    playerStatus,
    setPlayerStatus,
  };
};
