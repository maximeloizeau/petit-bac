import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { PublicGame, PublicRound } from "../../../server/src/models/Game";

interface GameState {
  playerId?: string;
  gameLoading: boolean;
  currentGame?: PublicGame;
  currentRound?: PublicRound;
}

const initialState: GameState = {
  playerId: undefined,
  gameLoading: false,
  currentGame: undefined,
  currentRound: undefined,
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
    setRound: (state, action: PayloadAction<PublicRound>) => {
      state.currentRound = action.payload;
    },
  },
});

export const { setGame, setRound, setPlayerId } = gameSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectGame = (state: RootState) => state.game.currentGame;
export const selectRound = (state: RootState) => state.game.currentRound;
export const selectGameLoading = (state: RootState) => state.game.gameLoading;
export const selectPlayerId = (state: RootState) => state.game.playerId;

export default gameSlice.reducer;
