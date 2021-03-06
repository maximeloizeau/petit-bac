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
      answersReceivedCount: 0,
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
    inProgress: false,
    state: GameState.WaitingLobby,
    categories: selectedCategories,
    currentRound: -1,
    rounds,
    roundsIds: rounds.map((round) => round.id),
    roundsLeft: rounds.length,
    playerIds: [],
    creatorId: player.id,
    scoreboard: [],
    rules,
  };

  const createdGame = await saveGame(gameId, gameDetails);

  const socketData = await getSocketFromPlayerId(player.id);
  if (socketData) {
    console.log("sending event on socket");

    socketData.socket.emit("event", {
      event: "gamecreated",
      game: await toPublicGame(createdGame),
    });
  }
}
