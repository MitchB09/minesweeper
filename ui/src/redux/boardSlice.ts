import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  MinesweeperBoard,
  MinesweeperCell,
  CellIndex,
  CellMode,
} from "../types";
import type { RootState } from "./store";
import { useAppSelector } from "./hooks";

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

export interface CellClick {
  index: CellIndex;
}

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

const boardSearch = (board: MinesweeperBoard, index: CellIndex) => {

  if (!board || !board.cells) {
    throw Error("No board selected for update");
  }

  for (let rowSearch = -1; rowSearch <= 1; rowSearch++) {
    for (let colSearch = -1; colSearch <= 1; colSearch++) {
      // Do something after the sleep!
      try {

        // Out of index
        if (index.row + rowSearch < 0 || index.column + colSearch < 0 || index.row + rowSearch >= board.cells?.length || index.column + colSearch >= board.cells[0].length) {
          continue;
        }

        let cell = board.cells[index.row + rowSearch][index.column + colSearch];

        // Cell is already revealed
        if (cell.mode === CellMode.REVEALED) {
          continue;
        }

        // Current Cell, always reveal if not already
        else if (rowSearch === 0 && colSearch === 0) {
          board.cells[index.row + rowSearch][index.column + colSearch].mode = CellMode.REVEALED;
        }

        // If Cell is not mined reveal it
        else if (!cell.mined) {
          board.cells[index.row + rowSearch][index.column + colSearch].mode = CellMode.REVEALED;

          // If cell is blank, trigger new search from here 
          if (cell.number === 0) {
            boardSearch(board, { row: index.row + rowSearch, column: index.column + colSearch })
          }
        }
      } catch (ex) {
        console.dir(`bungled: index: [${index.row}, ${index.column}]; i,j: [${rowSearch}, ${colSearch}]': ${ex}`);
      }
    }
  }
}

export const boardSlice = createSlice({
  name: "board",
  initialState: initialState,
  reducers: {
    clickCell: (state, action: PayloadAction<CellClick>) => {

      const { index } = action.payload;
      const { board } = state;

      if (!board || !board.cells) {
        throw Error("No board selected for update");
      }

      const cell = board.cells[index.row][index.column];
      if (cell.mined || cell.number) {
        cell.mode = CellMode.REVEALED;
        board.cells[index.row][index.column] = cell;
        return;
      }

      boardSearch(board, index);


      state.board = board;
    },
    updateCell: (state, action: PayloadAction<CellUpdate>) => {


      const { index, cell } = action.payload;
      const { board } = state;

      if (!board || !board.cells) {
        throw Error("No board selected for update");
      }

      board.cells[index.row][index.column] = cell;


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
export const { clickCell, updateCell, postBoard, updateBoard } = boardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBoard = (state: RootState) => state.minesweeperBoard;

export default boardSlice.reducer;
