import { useState } from "react";
import { PlayerStatusType } from "../interface/PlayerStatusTypeInterface";
import { PlayerTurnStatusType } from "../interface/PlayerTurnStatusTypeInterface";
import {
  updatePlayerTurnCountData,
  updatePlayerStatusData,
  updatePlayerTurnStatusData,
} from "./databaseAdapter";

export interface playerController {
  isEnemyData: boolean;
  heroCardCharName: string;
  playerStatus: PlayerStatusType;
  setPlayerStatus: (_: PlayerStatusType) => void;
  updatePlayerStatus: (_: PlayerStatusType) => void;
  playerTurnStatus: PlayerTurnStatusType;
  setPlayerTurnStatus: (_: PlayerTurnStatusType) => void;
  updatePlayerTurnStatus: (_: PlayerTurnStatusType) => void;
  turnCount: number;
  addTurnCount: () => void;
  setTurnCount: (_: number) => void;
}

export const usePlayerController = (isEnemy: boolean, cardCharName: string) => {
  const [isEnemyData] = useState(isEnemy);
  const [heroCardCharName] = useState(cardCharName);
  const [playerStatus, setPlayerStatus] = useState(PlayerStatusType.NONE);
  const [playerTurnStatus, setPlayerTurnStatus] = useState(
    PlayerTurnStatusType.GAME_BEGIN
  );
  const [turnCount, setTurnCount] = useState(0);

  const updatePlayerStatus = (type: PlayerStatusType) => {
    setPlayerStatus((_) => {
      updatePlayerStatusData(isEnemyData, type);
      return type;
    });
  };
  const updatePlayerTurnStatus = (type: PlayerTurnStatusType) => {
    setPlayerTurnStatus((_) => {
      updatePlayerTurnStatusData(isEnemyData, type);
      return type;
    });
  };
  const addTurnCount = () => {
    setTurnCount((prevCount) => {
      const newCount = prevCount + 1;
      updatePlayerTurnCountData(isEnemyData, newCount);
      return newCount;
    });
  };

  return {
    isEnemyData,
    heroCardCharName,
    playerStatus,
    setPlayerStatus,
    updatePlayerStatus,
    playerTurnStatus,
    updatePlayerTurnStatus,
    setPlayerTurnStatus,
    turnCount,
    addTurnCount,
    setTurnCount,
  };
};
