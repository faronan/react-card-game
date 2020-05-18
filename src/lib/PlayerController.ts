import { useState } from "react";
import { PlayerStatusType } from "../interface/PlayerStatusTypeInterface";
import { PlayerTurnStatusType } from "../interface/PlayerTurnStatusTypeInterface";

export interface playerController {
  heroCardCharName: string;
  playerStatus: PlayerStatusType;
  setPlayerStatus: (_: PlayerStatusType) => void;
  playerTurnStatus: PlayerTurnStatusType;
  setPlayerTurnStatus: (_: PlayerTurnStatusType) => void;
}

export const usePlayerController = (cardCharName: string) => {
  const [heroCardCharName] = useState(cardCharName);
  const [playerStatus, setPlayerStatus] = useState(PlayerStatusType.NONE);
  const [playerTurnStatus, setPlayerTurnStatus] = useState(
    PlayerTurnStatusType.BEGIN
  );

  return {
    heroCardCharName,
    playerStatus,
    setPlayerStatus,
    playerTurnStatus,
    setPlayerTurnStatus,
  };
};
