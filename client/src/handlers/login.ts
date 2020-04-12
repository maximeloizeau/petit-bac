import { v4 as uuidv4 } from "uuid";

export function login(socket: SocketIOClient.Socket) {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("userId", userId);
  }

  socket.emit("action", { action: "login", playerId: userId });
}
