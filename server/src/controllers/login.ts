import { getSocketFromId, setUserInfo } from "../services/socketStorage";
import { createPlayer, getPlayer } from "../services/playerStorage";

export async function loginController(
  socketId: string,
  {
    playerId,
    playerName,
  }: { action: string; playerId?: string; playerName?: string }
) {
  if (!playerId || typeof playerId !== "string") {
    console.error("Invalid loginData");
    return;
  }

  const socketData = await getSocketFromId(socketId);
  if (!socketData) {
    console.error("Socket not available");
    return;
  }

  const user =
    (await getPlayer(playerId)) || (await createPlayer(playerId, playerName));
  await setUserInfo(socketId, playerId);

  socketData.socket.emit("event", {
    event: "loggedin",
    loggedIn: true,
    playerId,
  });
}
