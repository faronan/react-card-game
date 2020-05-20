import { useState } from "react";
import { PlayerStatusType } from "../interface/PlayerStatusTypeInterface";
import { PlayerTurnStatusType } from "../interface/PlayerTurnStatusTypeInterface";

export interface playerController {
  heroCardCharName: string;
  playerStatus: PlayerStatusType;
  setPlayerStatus: (_: PlayerStatusType) => void;
  playerTurnStatus: PlayerTurnStatusType;
  setPlayerTurnStatus: (_: PlayerTurnStatusType) => void;
  turnCount: number;
  addTurnCount: () => void;
}

export const usePlayerController = (cardCharName: string) => {
  const [heroCardCharName] = useState(cardCharName);
  const [playerStatus, setPlayerStatus] = useState(PlayerStatusType.NONE);
  const [playerTurnStatus, setPlayerTurnStatus] = useState(
    PlayerTurnStatusType.BEGIN
  );
  const [turnCount, setTurnCount] = useState(0);
  const addTurnCount = () => {
    setTurnCount((prevCount) => prevCount + 1);
  };

  return {
    heroCardCharName,
    playerStatus,
    setPlayerStatus,
    playerTurnStatus,
    setPlayerTurnStatus,
    turnCount,
    addTurnCount,
  };
};
