import { v4 as uuidv4 } from "uuid";
import * as generate from "meaningful-string";
import {
  Game,
  Player,
  defaultRules,
  categories,
  GameState,
  toPublicGame,
  Round,
} from "../models/Game";
import { saveGame } from "../services/gameStorage";
import { getSocketFromPlayerId } from "../services/socketStorage";

export async function newGameController(player: Player, data: {}) {
  const possibleLetters = "ABCDEFGHIJKLMNOPRSTUV";
  const gameId = generate.meaningful();

  const rules = defaultRules;
  const selectedCategories = categories;

  const categoriesAnswersSkeleton: { [key: string]: Array<any> } = {};
  for (const category of selectedCategories) {
    categoriesAnswersSkeleton[category.id] = [];
  }

  const rounds: Round[] = [];
  for (let i = 0; i < rules.roundCount; i++) {
    rounds[i] = {
      id: uuidv4(),
      started: false,
      ended: false,
      letter: possibleLetters.charAt(
        Math.floor(Math.random() * possibleLetters.length)
      ),
      answers: {
        ...categoriesAnswersSkeleton,
      },
    };
  }

  const gameDetails = {
    id: gameId,
    state: GameState.WaitingLobby,
    categories: selectedCategories,
    rounds,
    players: [],
    creator: player,
    scoreboard: {},
    rules,
  };

  await saveGame(gameId, gameDetails);

  const socketData = await getSocketFromPlayerId(player.id);
  if (socketData) {
    console.log("sending event on socket");

    socketData.socket.emit("event", {
      event: "gamecreated",
      game: toPublicGame(gameDetails),
    });
  }
}
