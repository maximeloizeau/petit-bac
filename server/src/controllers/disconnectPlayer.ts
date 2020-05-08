import { updatePlayer } from "../services/playerStorage";
import { removePlayer, getCurrentGame } from "../services/gameStorage";

export async function disconnectPlayer(playerId: string) {
  const updatedPlayer = await updatePlayer(playerId, { left: true });

  const currentGame = await getCurrentGame(playerId, false);
  if (currentGame) {
    console.log("removing player");
    await removePlayer(currentGame.id, updatedPlayer!);
  }
}
