import { getSocketFromId } from "../services/socketStorage";
import { Player } from "../models/Game";
import { getPlayer } from "../services/playerStorage";

export async function socketToPlayer(socketId: string): Promise<Player> {
  const socketData = await getSocketFromId(socketId);
  if (!socketId) {
    throw new Error("Socket unregistered");
  }

  if (!socketData || !socketData.playerId) {
    throw new Error("Socket not logged in");
  }

  const player = getPlayer(socketData.playerId);
  return player!;
}
