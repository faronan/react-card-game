import { realTimeDb } from "../Firebase";
import { GameCardStatusInterface } from "../interface/GameCardStatusInterface";
import GameManager from "./GameManager";
import { selectedType } from "../interface/SelectedTypeInterface";
import { PlayerStatusType } from "../interface/PlayerStatusTypeInterface";
import { PlayerTurnStatusType } from "../interface/PlayerTurnStatusTypeInterface";

interface dbData {
  playerCard: GameCardStatusInterface[];
  enemyCard: GameCardStatusInterface[];
  playerData: playerData;
  enemyPlayerData: playerData;
}

interface playerData {
  heroCardCharName: string;
  playerStatus: PlayerStatusType;
  playerTurnStatus: PlayerTurnStatusType;
  turnCount: number;
}

export const fetchData = () => {
  return realTimeDb.once("value").then(function (snapshot) {
    return snapshot.val();
  });
};

export const formatDataToGameManager = (
  data: dbData,
  gameManager: GameManager
) => {
  gameManager.playerCards.setPlayerCards(data.playerCard);
  gameManager.enemyPlayerCards.setPlayerCards(data.enemyCard);
  gameManager.player.setPlayerStatus(data.playerData.playerStatus);
  gameManager.player.setPlayerTurnStatus(data.playerData.playerTurnStatus);
  gameManager.player.setTurnCount(data.playerData.turnCount);
  gameManager.enemyPlayer.setPlayerStatus(data.enemyPlayerData.playerStatus);
  gameManager.enemyPlayer.setPlayerTurnStatus(
    data.enemyPlayerData.playerTurnStatus
  );
  gameManager.enemyPlayer.setTurnCount(data.enemyPlayerData.turnCount);
};

export const updatePlayerTurnStatusData = (
  isEnemy: boolean,
  turnStatusType: PlayerTurnStatusType
) => {
  if (isEnemy) {
    realTimeDb
      .child("game1")
      .update({ "enemyPlayerData/playerTurnStatus": turnStatusType });
  } else {
    realTimeDb
      .child("game1")
      .update({ "playerData/playerTurnStatus": turnStatusType });
  }
};

export const updatePlayerTurnCountData = (
  isEnemy: boolean,
  turnCount: Number
) => {
  if (isEnemy) {
    realTimeDb
      .child("game1")
      .update({ "enemyPlayerData/turnCount": turnCount });
  } else {
    realTimeDb.child("game1").update({ "playerData/turnCount": turnCount });
  }
};

export const updatePlayerStatusData = (
  isEnemy: boolean,
  statusType: PlayerStatusType
) => {
  if (isEnemy) {
    realTimeDb
      .child("game1")
      .update({ "enemyPlayerData/playerStatus": statusType });
  } else {
    realTimeDb.child("game1").update({ "playerData/playerStatus": statusType });
  }
};

export const updatePlayerCardData = (cards: GameCardStatusInterface[]) => {
  if (cards[0].isEnemy) {
    realTimeDb.child("game1").update({ enemyCard: cards });
  } else {
    realTimeDb.child("game1").update({ playerCard: cards });
  }
};

export const setDatabase = (gameManager: GameManager) => {
  const playerData: playerData = {
    heroCardCharName: gameManager.player.heroCardCharName,
    playerStatus: gameManager.player.playerStatus,
    playerTurnStatus: gameManager.player.playerTurnStatus,
    turnCount: gameManager.player.turnCount,
  };
  const enemyPlayerData: playerData = {
    heroCardCharName: gameManager.enemyPlayer.heroCardCharName,
    playerStatus: gameManager.enemyPlayer.playerStatus,
    playerTurnStatus: gameManager.enemyPlayer.playerTurnStatus,
    turnCount: gameManager.enemyPlayer.turnCount,
  };
  const updateData: dbData = {
    playerCard: gameManager.playerCards.playerCards,
    enemyCard: gameManager.enemyPlayerCards.playerCards,
    playerData,
    enemyPlayerData,
  };
  realTimeDb.child("game1").set(updateData);
};
