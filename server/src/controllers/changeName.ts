import { Player, toPublicGame, GameState } from "../models/Game";
import { getGame } from "../services/gameStorage";
import { gameEventEmitter } from "../services/gameEventEmitter";
import { updatePlayer } from "../services/playerStorage";

export async function changeNameController(
  player: Player,
  {
    name,
    gameId,
  }: {
    name?: string;
    gameId?: string;
  }
) {
  if (!name) {
    throw new Error("Invalid name");
  }
  if (!gameId) {
    throw new Error("Invalid game id");
  }

  await updatePlayer(player.id, { name });

  const game = await getGame(gameId);
  gameEventEmitter.emit("gameupdate", toPublicGame(game!));
}
