export const defaultRules = {
  roundDuration: 90,
  roundCount: 5,
  categoriesCount: 2,
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
];

export interface Category {
  id: string;
  name: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface PlayerAnswer {
  categoryId: string;
  playerId: string;
  answer: string;
  scoring: {
    [key: string]: boolean | undefined;
  };
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

export interface Round {
  id: string;
  started: boolean;
  ended: boolean;
  letter: string;
  answers: {
    // One key per category ID
    [key: string]: Array<{
      // One item in the array per player per category
      playerId: string;
      answer: string;
      // Ratings contain the votes for each player
      ratings: boolean[];
    }>;
  };
}

export type PublicRound = Pick<Round, "id" | "letter">;

export interface Game {
  id: string;
  state: GameState;
  categories: Category[];
  rounds: Round[];
  players: Player[];
  scoreboard: {
    [key: string]: number;
  };
  rules: GameRules;
  creator: Player;
}

export type PublicGame = Pick<
  Game,
  "id" | "state" | "categories" | "players" | "creator"
>;

export function toPublicGame(game: Game): PublicGame {
  return {
    id: game.id,
    state: game.state,
    categories: game.categories,
    players: game.players,
    creator: game.creator,
  };
}

export function toPublicRound(round: Round): PublicRound {
  return { id: round.id, letter: round.letter };
}
