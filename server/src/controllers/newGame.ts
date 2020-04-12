import * as generate from "meaningful-string";
import {
  Game,
  Player,
  defaultRules,
  categories,
  GameState,
} from "../models/Game";
import { saveGame } from "../services/gameStorage";
import { getSocketFromPlayerId } from "../services/socketStorage";

export async function newGameController(player: Player, data: {}) {
  const gameId = generate.meaningful();

  const selectedCategories = categories;
  const answers: Game["answers"] = {};
  for (const category of selectedCategories) {
    answers[category.id] = [];
  }

  const gameDetails = {
    id: gameId,
    state: GameState.WaitingLobby,
    categories,
    answers,
    players: [],
    creator: player,
    scoreboard: {},
    rules: defaultRules,
  };

  await saveGame(gameId, gameDetails);

  const socketData = await getSocketFromPlayerId(player.id);
  if (socketData) {
    console.log("sending event on socket");

    socketData.socket.emit("event", {
      event: "gamecreated",
      gameId: gameDetails.id,
    });
  }
}
