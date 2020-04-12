import socketIo, { Socket } from "socket.io";
import { Server } from "http";

const socketStorage: {
  [key: string]: { socket: Socket; loggedIn: boolean; playerId?: string };
} = {};

export default function websocketApp(server: Server) {
  const websocketServer = socketIo(server);

  websocketServer.on("connection", connectionHandler);
}

function connectionHandler(socket: Socket) {
  console.log("connected");

  socketStorage[socket.id] = {
    socket,
    loggedIn: false,
    playerId: undefined,
  };

  socket.on("login", (loginData) => loginHandler(socket.id, loginData));
}

function loginHandler(socketId: string, loginData: string) {
  if (!loginData || typeof loginData !== "string") {
    console.error("Invalid loginData");
    return;
  }

  if (!socketStorage[socketId]) {
    console.error("Invalid socket id logging in");
    return;
  }

  if (socketStorage[socketId].loggedIn !== false) {
    console.error("Socket already logged in");
    return;
  }

  const playerId = loginData;
  socketStorage[socketId].loggedIn = true;
  socketStorage[socketId].playerId = playerId;

  socketStorage[socketId].socket.on("action", (data) =>
    actionHandler(playerId, data)
  );
}

function actionHandler(playerId: string, data: string) {
  console.log("action", data);
}
