

export enum CellMode {
  HIDDEN,
  REVEALED
}

export enum CellGuess {
  NONE,
  FLAGGED,
  UNKNOWN
}


export interface MinesweeperCell {
  number?: number
  mode?: CellMode
  mined: boolean
  guess: CellGuess
}

export interface CellIndex {
  row: number;
  column: number;
}

export interface MinesweeperBoard {
  id?: string,
  title?: string,
  cells?: MinesweeperCell[][]
}

export interface User {
  userId: string,
}