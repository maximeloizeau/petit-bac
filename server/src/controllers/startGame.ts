import { Player, Game, GameState } from "../models/Game";
import { getSocketFromPlayerId } from "../services/socketStorage";
import { getGame, addPlayer, startGame } from "../services/gameStorage";

export async function startGameController(
  player: Player,
  { gameId }: { gameId?: string }
) {
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  const gameInfo = await getGame(gameId);

  if (!isValidStart(gameInfo, player)) {
    throw new Error("Invalid state to start game");
  }

  await startGame(gameId);
}

function isValidStart(gameInfo: Game | undefined, player: Player) {
  if (!gameInfo) {
    console.info("No game info to check valid join");
    return false;
  }

  if (gameInfo.creator.id !== player.id) {
    console.info("Only creator can start game");
    return false;
  }

  if (
    gameInfo.state === GameState.WaitingLobby &&
    gameInfo.players.length > 0
  ) {
    return true;
  }

  return false;
}
