import { Player, Game, GameState } from "../models/Game";
import { getSocketFromPlayerId } from "../services/socketStorage";
import { getGame, addPlayer } from "../services/gameStorage";

export async function joinGameController(
  player: Player,
  { gameId }: { gameId?: string }
) {
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  const gameInfo = await getGame(gameId);

  if (!isValidJoin(gameInfo, player)) {
    throw new Error("Invalid time to join game");
  }

  const socketData = await getSocketFromPlayerId(player.id);
  if (!socketData) {
    console.error("Unable to join");
    return;
  }

  socketData.socket.join(gameId);
  await addPlayer(gameId, player);
}

function isValidJoin(gameInfo: Game | undefined, player: Player) {
  if (!gameInfo) {
    console.info("No game info to check valid join");
    return false;
  }

  const alreadyParticipant = Boolean(
    gameInfo.players.find((p: Player) => p.id === player.id)
  );
  if (alreadyParticipant) {
    return true;
  }

  if (
    gameInfo.state === GameState.WaitingLobby &&
    gameInfo.players.length < gameInfo.rules.playerLimit
  ) {
    return true;
  }

  return false;
}
