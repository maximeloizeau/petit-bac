export interface Category {
  id: string;
  name: string;
  lang: string;
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

export interface Game {
  id: string;
  categories: Category[];
  players: Player[];
  answers: {
    [key: string]: PlayerAnswer[];
  };
  scoreboard: {
    [key: string]: number;
  };
  rules: GameRules;
}
