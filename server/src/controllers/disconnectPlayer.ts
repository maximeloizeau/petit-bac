import { updatePlayer } from "../services/playerStorage";

export function disconnectPlayer(playerId: string) {
  updatePlayer(playerId, { left: true });
}
