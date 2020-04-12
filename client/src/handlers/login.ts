import { v4 as uuidv4 } from "uuid";
import { store } from "../app/store";
import { setPlayerId } from "../app/game";

export function login(socket: SocketIOClient.Socket) {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("userId", userId);
  }

  store.dispatch(setPlayerId(userId));

  socket.emit("action", { action: "login", playerId: userId });
}
