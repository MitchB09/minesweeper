import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  MinesweeperBoard,
  MinesweeperCell,
  CellIndex,
} from "../types";
import type { RootState } from "./store";

// Define the initial state using that type
interface MinesweeperBoardState {
  status: string;
  board?: MinesweeperBoard;
  boards?: MinesweeperBoard[];
}

const initialState: MinesweeperBoardState = {
  status: "idle",
  boards: undefined,
};

export interface CellUpdate {
  index: CellIndex;
  cell: MinesweeperCell;
}

export interface GetBoardRequest {
  id: string;
  shareCode?: string;
}

export interface UpdateBoardRequest {
  board: MinesweeperBoard;
  shareCode?: string;
}

export interface UpdateBoardResponse {
  lastUpdated: Date;
}

export interface PostBoardResponse extends UpdateBoardResponse {
  id: string;
}

export interface DeleteBoardRequest {
  id: string;
}



export const boardSlice = createSlice({
  name: "board",
  initialState: initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<CellUpdate>) => {
      if (!state.board || !state.board.cells) {
        throw Error("No board selected for update");
      }

      const { index, cell } = action.payload;
      const { board } = state;

      if (board.cells) {
        board.cells[index.row][index.column] = cell;
      } else {
        throw Error("No board cells found for update");
      }

      state.board = board;
    },
    postBoard: (state, action: PayloadAction<MinesweeperBoard>) => {
      const { payload } = action;
      state.board = payload;
    },
    updateBoard: (state, action: PayloadAction<MinesweeperBoard>) => {
      if (!state.board) {
        throw Error("No board selected for update");
      }
      state.board = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateCell, postBoard, updateBoard } = boardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBoard = (state: RootState) => state.minesweeperBoard;

export default boardSlice.reducer;
