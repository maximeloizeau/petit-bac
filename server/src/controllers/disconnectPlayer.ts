import { updatePlayer } from "../services/playerStorage";
import { getCurrentGame, removePlayerFromGame } from "../services/gameService";

export async function disconnectPlayer(playerId: string) {
  const updatedPlayer = await updatePlayer(playerId, { left: true });

  const currentGame = await getCurrentGame(playerId, false);
  if (currentGame) {
    await removePlayerFromGame(currentGame.id, updatedPlayer!);
  }
}
