import socketIo, { Socket } from "socket.io";
import { Server } from "http";
import { registerSocket, unregisterSocket } from "./services/socketStorage";
import { loginController } from "./controllers/login";
import { newGameController } from "./controllers/newGame";
import { socketToPlayer } from "./utils/socketToPlayer";
import { joinGameController } from "./controllers/joinGame";
import { gameEventEmitter } from "./services/gameEventEmitter";
import { Game, PublicGame, Round } from "./models/Game";
import { startGameController } from "./controllers/startGame";
import { submitAnswersController } from "./controllers/submitAnswers";

export default function websocketApp(server: Server) {
  const websocketServer = socketIo(server);

  websocketServer.on("connection", connectionHandler);

  gameEventEmitter.on("gameupdate", (game: PublicGame) =>
    websocketServer.to(game.id).emit("event", { event: "gameupdate", game })
  );
  gameEventEmitter.on("roundstarted", (game: PublicGame, round: PublicRound) =>
    websocketServer
      .to(game.id)
      .emit("event", { event: "roundstarted", game, round })
  );
  gameEventEmitter.on("roundended", (game: PublicGame, round: PublicRound) =>
    websocketServer
      .to(game.id)
      .emit("event", { event: "roundended", game, round })
  );
  gameEventEmitter.on(
    "roundtimerupdate",
    (game: PublicGame, timerValue: number) =>
      websocketServer
        .to(game.id)
        .emit("event", { event: "roundtimerupdate", timerValue })
  );
  gameEventEmitter.on("roundresults", (game: PublicGame, round: Round) =>
    websocketServer
      .to(game.id)
      .emit("event", { event: "roundresults", game, round })
  );
}

function connectionHandler(socket: Socket) {
  console.log("connected");

  registerSocket(socket.id, socket);

  socket.on("action", (data) => actionHandler(socket.id, data));
  socket.on("disconnect", (data) => disconnectHandler(socket.id, data));
}

function disconnectHandler(socketId: string, data: any) {
  console.log("disconnect", data);

  unregisterSocket(socketId);
}

async function actionHandler(socketId: string, data: any) {
  console.log("actionHandler", data);

  // Unauth routes
  switch (data.action) {
    case "login":
      return loginController(socketId, data);
  }

  const player = await socketToPlayer(socketId);
  console.log("action from player", player);

  // Auth routes
  switch (data.action) {
    case "newgame":
      return newGameController(player, data);
    case "joingame":
      return joinGameController(player, data);
    case "startgame":
      return startGameController(player, data);
    case "submitanswers":
      return submitAnswersController(player, data);
  }

  console.error("Unregistered route: " + data.action);
}
