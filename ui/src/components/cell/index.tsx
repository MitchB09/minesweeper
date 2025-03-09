import React from "react";
import { clickCell, postBoard, updateCell } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { CellGuess, CellIndex, CellMode, MinesweeperBoard, MinesweeperCell } from "../../types";
import FlagIcon from '@mui/icons-material/Flag';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ErrorIcon from '@mui/icons-material/Error';
import "./cell.css";

interface CellProps {
  cell: MinesweeperCell;
  index: CellIndex;
}

function Cell(props: CellProps) {
  const { cell, index } = props;
  const { board } = useAppSelector((state) => state.minesweeperBoard);

  if (!board) {
    throw Error("No board selected for update");
  }

  const dispatch = useAppDispatch();

  const getClassByMode = (mode?: CellMode) => {
    switch (mode) {
      case CellMode.HIDDEN:
        return "block";
      default:
        return "";
    }
  };


  return (
    <div className="cell">
      <div className={getClassByMode(cell.mode)}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
          let guess: CellGuess;
          if (cell.guess === CellGuess.NONE) {
            guess = CellGuess.FLAGGED;
          } else if (cell.guess === CellGuess.FLAGGED) {
            guess = CellGuess.UNKNOWN;
          } else {
            guess = CellGuess.NONE;
          }
          dispatch(updateCell({
            index,
            cell: { ...cell, guess: guess }
          }));
        }}
        onClick={() => {
          dispatch(clickCell({
            index: index
          }));
        }}>
        {cell.mode === CellMode.HIDDEN && cell.guess === CellGuess.FLAGGED && (
          <FlagIcon />
        )}
        {cell.mode === CellMode.HIDDEN && cell.guess === CellGuess.UNKNOWN && (
          <QuestionMarkIcon />
        )}
        {cell.mode === CellMode.REVEALED &&
          (cell.mined ? <ErrorIcon /> : cell.number ? cell.number : "")}
      </div>
    </div>
  );
}

export default Cell;
