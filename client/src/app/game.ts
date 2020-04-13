import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  PublicGame,
  PublicRound,
  Round,
} from "../../../server/src/models/Game";

interface GameState {
  playerId?: string;
  gameLoading: boolean;
  currentGame?: PublicGame;
  currentRound?: PublicRound;
  currentRoundTimer: number;
  currentCountdown?: number;
  answers: {
    [key: string]: string;
  };
  roundResults?: Round;
  voteAnswers?: Round["answers"];
}

const initialState: GameState = {
  playerId: undefined,
  gameLoading: false,
  currentGame: undefined,
  currentRound: undefined,
  currentRoundTimer: 0,
  currentCountdown: undefined,
  answers: {},
  roundResults: undefined,
  voteAnswers: {},
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayerId: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setGameLoading: (state, action: PayloadAction<boolean>) => {
      state.gameLoading = action.payload;
    },
    setGame: (state, action: PayloadAction<PublicGame>) => {
      state.currentGame = action.payload;
    },
    resetRound: (state, action: PayloadAction<PublicGame>) => {
      state.answers = {};
      state.currentRoundTimer = action.payload.rules.roundDuration;
    },
    setRound: (
      state,
      action: PayloadAction<{ round: PublicRound; game: PublicGame }>
    ) => {
      state.currentRound = action.payload.round;
      state.currentRoundTimer = action.payload.game.rules.roundDuration;
    },
    setRoundResults: (state, action: PayloadAction<Round>) => {
      state.roundResults = action.payload;
      state.voteAnswers = action.payload.answers;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.currentRoundTimer = action.payload;
    },
    updateAnwser: (
      state,
      action: PayloadAction<{ categoryId: string; answer: string }>
    ) => {
      state.answers[action.payload.categoryId] = action.payload.answer;
    },
    updateCountdown: (state, action: PayloadAction<number>) => {
      state.currentCountdown = action.payload;
    },
  },
});

export const {
  setGame,
  resetRound,
  setRound,
  setRoundResults,
  setPlayerId,
  updateTimer,
  updateAnwser,
  updateCountdown,
} = gameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectGame = (state: RootState) => state.game.currentGame;
export const selectGameLoading = (state: RootState) => state.game.gameLoading;
export const selectPlayerId = (state: RootState) => state.game.playerId;
export const selectRound = (state: RootState) => state.game.currentRound;
export const selectRoundTimer = (state: RootState) =>
  state.game.currentRoundTimer;
export const selectAnswers = (state: RootState) => state.game.answers;
export const selectRoundResults = (state: RootState) => state.game.roundResults;
export const selectVoteAnswers = (state: RootState) => state.game.voteAnswers;
export const selectCategoryVoteAnswers = (state: RootState, category: string) =>
  (state.game.voteAnswers && state.game.voteAnswers[category]) || [];
export const selectCountdown = (state: RootState) =>
  state.game.currentCountdown;

export default gameSlice.reducer;
