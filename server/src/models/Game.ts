import { getPlayer } from "../services/playerStorage";

export const defaultRules = {
  roundDuration: 30,
  roundCount: 2,
  categoriesCount: 7,
  playerLimit: 8,
};

export const categories: Category[] = [
  {
    id: "animals",
    name: "Animaux",
  },
  {
    id: "jobs",
    name: "Metiers",
  },
  {
    id: "brands",
    name: "Marques",
  },
  {
    id: "fleurs",
    name: "Flowers",
  },
  {
    id: "objects",
    name: "Objects",
  },
  {
    id: "historical-event",
    name: "Evenement historique",
  },
  {
    id: "male-name",
    name: "Prenom masculin",
  },
];

export interface Category {
  id: string;
  name: string;
}

export interface Player {
  id: string;
  name: string;
  left: boolean;
}

export interface GameRules {
  roundDuration: number;
  roundCount: number;
  categoriesCount: number;
  playerLimit: number;
}

export enum GameState {
  WaitingLobby = "waiting-lobby",
  InProgress = "in-progress",
  Ended = "ended",
  Archived = "archived",
}

export interface PlayerAnswer {
  // One item in the array per player per category
  playerId: string;
  answer: string;
  // Ratings contain the votes for each player
  ratings: (boolean | undefined)[];
}

export interface Round {
  id: string;
  started: boolean;
  ended: boolean;
  letter: string;
  answersReceivedCount: number;
  answers: {
    // One key per category ID
    [key: string]: PlayerAnswer[];
  };
}

export type PublicRound = Pick<Round, "id" | "letter" | "started" | "ended">;

export interface Game {
  id: string;
  state: GameState;
  categories: Category[];
  rounds: Round[];
  roundsLeft: number;
  playerIds: string[];
  scoreboard: { playerId: string; score: number }[];
  rules: GameRules;
  creatorId: string;
}

export type PublicGame = Pick<
  Game,
  "id" | "state" | "categories" | "rules" | "roundsLeft" | "scoreboard"
> & {
  players: (Player | undefined)[];
  creator: Player | undefined;
};

export function toPublicGame(game: Game): PublicGame {
  return {
    id: game.id,
    state: game.state,
    categories: game.categories,
    players: game.playerIds.map(getPlayer),
    creator: getPlayer(game.creatorId),
    rules: game.rules,
    roundsLeft: game.roundsLeft,
    scoreboard: game.scoreboard,
  };
}

export function toPublicRound(round: Round): PublicRound {
  return {
    id: round.id,
    letter: round.letter,
    started: round.started,
    ended: round.ended,
  };
}
