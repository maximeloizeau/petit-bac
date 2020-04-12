import { getSocketFromId } from "../services/socketStorage";
import { Player } from "../models/Game";

export async function socketToPlayer(socketId: string): Promise<Player> {
  const socketData = await getSocketFromId(socketId);
  if (!socketId) {
    throw new Error("Socket unregistered");
  }

  if (!socketData?.playerId || !socketData.playerName) {
    throw new Error("Socket not logged in");
  }

  return {
    id: socketData.playerId,
    name: socketData.playerName,
  };
}
