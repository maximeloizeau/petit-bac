import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { PublicGame, PublicRound } from "../../../server/src/models/Game";

interface GameState {
  playerId?: string;
  gameLoading: boolean;
  currentGame?: PublicGame;
  currentRound?: PublicRound;
  currentRoundTimer: number;
}

const initialState: GameState = {
  playerId: undefined,
  gameLoading: false,
  currentGame: undefined,
  currentRound: undefined,
  currentRoundTimer: 0,
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
    setRound: (
      state,
      action: PayloadAction<{ round: PublicRound; game: PublicGame }>
    ) => {
      state.currentRound = action.payload.round;
      state.currentRoundTimer = action.payload.game.rules.roundDuration;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.currentRoundTimer = action.payload;
    },
  },
});

export const {
  setGame,
  setRound,
  setPlayerId,
  updateTimer,
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

export default gameSlice.reducer;
