import { getSocketFromId, setUserInfo } from "../services/socketStorage";
import { createPlayer, getPlayer } from "../services/playerStorage";
import { getCurrentGame } from "../services/gameStorage";
import { toPublicGame, Game, GameState, toPublicRound } from "../models/Game";
import { joinGameController } from "../controllers/joinGame";

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

  const currentGame = await getCurrentGame(playerId);
  if (currentGame) {
    await joinGameController(user, { gameId: currentGame.id });
    sendGameState(socketData.socket, currentGame);
  }
}

async function sendGameState(socket: SocketIO.Socket, game: Game) {
  console.log(game.state);
  switch (game.state) {
    case GameState.RoundInProgress:
      socket.emit("event", {
        event: "roundstarted",
        game: await toPublicGame(game),
        round: toPublicRound(game.rounds[game.currentRound]),
      });
      break;
    case GameState.RoundResult:
      socket.emit("event", {
        event: "roundresults",
        game: await toPublicGame(game),
        round: game.rounds[game.currentRound],
      });
      break;
  }
}
