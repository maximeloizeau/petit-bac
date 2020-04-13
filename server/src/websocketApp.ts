import socketIo, { Socket } from "socket.io";
import { Server } from "http";
import {
  registerSocket,
  unregisterSocket,
  getSocketFromId,
} from "./services/socketStorage";
import { loginController } from "./controllers/login";
import { newGameController } from "./controllers/newGame";
import { socketToPlayer } from "./utils/socketToPlayer";
import { joinGameController } from "./controllers/joinGame";
import { gameEventEmitter } from "./services/gameEventEmitter";
import { Game, PublicGame, Round, PublicRound } from "./models/Game";
import { startGameController } from "./controllers/startGame";
import { submitAnswersController } from "./controllers/submitAnswers";
import { disconnectPlayer } from "./controllers/disconnectPlayer";
import { nextRoundController } from "./controllers/nextRound";
import { voteForAnswerController } from "./controllers/voteForAnwser";
import { displayGameResultsController } from "./controllers/displayGameResults";
import { updatePlayer } from "./services/playerStorage";

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
  gameEventEmitter.on("voteupdate", (game: PublicGame, round: Round) =>
    websocketServer
      .to(game.id)
      .emit("event", { event: "voteupdate", game, round })
  );
  gameEventEmitter.on("gameresults", (game: PublicGame) =>
    websocketServer.to(game.id).emit("event", { event: "gameresults", game })
  );
  gameEventEmitter.on(
    "countdownupdate",
    (game: PublicGame, countdownValue: number) =>
      websocketServer
        .to(game.id)
        .emit("event", { event: "countdownupdate", countdownValue })
  );
}

async function connectionHandler(socket: Socket) {
  console.log("connected");

  registerSocket(socket.id, socket);

  socket.on("action", (data) => actionHandler(socket.id, data));
  socket.on("disconnect", (data) => disconnectHandler(socket.id, data));
}

async function disconnectHandler(socketId: string, data: any) {
  console.log("disconnect", data);

  const socket = await getSocketFromId(socketId);
  socket && socket.playerId && disconnectPlayer(socket.playerId);

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

  if (player.left) {
    updatePlayer(player.id, { left: false });
  }

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
    case "nextround":
      return nextRoundController(player, data);
    case "voteanswer":
      return voteForAnswerController(player, data);
    case "displaygameresults":
      return displayGameResultsController(player, data);
  }

  console.error("Unregistered route: " + data.action);
}
