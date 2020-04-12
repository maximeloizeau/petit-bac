import { getSocketFromId, setUserInfo } from "../services/socketStorage";
import * as generate from "meaningful-string";

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

  let name;
  if (playerName) {
    name = playerName;
  } else {
    name = generate.meaningful().split("-")[0];
  }
  await setUserInfo(socketId, playerId, name);

  console.log("login successful");
  socketData.socket.emit("event", {
    event: "loggedin",
    loggedIn: true,
    playerId,
  });
}
