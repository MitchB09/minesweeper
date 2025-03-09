import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { postBoard } from "../../redux/boardSlice";
import { useAppDispatch } from "../../redux/hooks";
import { CellGuess, CellIndex, CellMode, MinesweeperBoard } from "../../types";

interface DialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

function CreateDialog(props: DialogProps) {
  const { isOpen, handleClose } = props;
  const dispatch = useAppDispatch();
  const [width, setWidth] = useState<number>(18);
  const [height, setHeight] = useState<number>(14);
  const [mines, setMines] = useState<number>(40);

  const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
  }

  const placeMines = (board: MinesweeperBoard, mines: number) => {
    if (!board.cells) {
      return;
    }

    for (let i = 0; i < mines; i++) {
      let row = getRandomInt(height);
      let column = getRandomInt(width);
      while (board.cells[row][column].mined) {
        row = getRandomInt(height);
        column = getRandomInt(width);
      }
      board.cells[row][column].mined = true;
    }
  }

  const getSurroundingMines = (board: MinesweeperBoard, index: CellIndex): number => {
    if (!board.cells) {
      return 0;
    }

    let count = 0;
    for (let rowSearch = -1; rowSearch <= 1; rowSearch++) {
      for (let colSearch = -1; colSearch <= 1; colSearch++) {
        try {
          if (index.row + rowSearch < 0 || index.column + colSearch < 0 || index.row + rowSearch >= board.cells?.length || index.column + colSearch >= board.cells[0].length) {
            continue;
          } else if (rowSearch === 0 && colSearch === 0) {
            continue;
          } else if (board.cells[index.row + rowSearch][index.column + colSearch].mined) {
            count++;
          }
        } catch (ex) {
          console.dir(`bungled: index: [${index.row}, ${index.column}]; i,j: [${rowSearch}, ${colSearch}]': ${ex}`);
        }
      }
    }

    return count;
  }

  const placeNumbers = (board: MinesweeperBoard) => {
    if (!board.cells) {
      return;
    }

    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        board.cells[row][column].number = getSurroundingMines(board, { row, column })
      }
    }
  }

  const createBoard = () => {
    const cells = [];
    for (let rowSize = 0; rowSize < height; rowSize++) {
      const row = [];
      for (let colSize = 0; colSize < width; colSize++) {
        row.push({ mined: false, mode: CellMode.HIDDEN, guess: CellGuess.NONE });
      }
      cells.push(row);
    }

    const board: MinesweeperBoard = {
      cells
    };

    placeMines(board, mines);
    placeNumbers(board);
    dispatch(postBoard(board));
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create Board</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pick the size of the puzzle and then you'll be able to fill the grid
          and set the numbers
        </DialogContentText>
        <Grid
          container
          justifyContent="center"
          alignItems="stretch"
          direction="column"
          spacing={4}
        >
          <Grid item>
            <TextField
              variant="filled"
              value={width || ""}
              className="value"
              style={{ width: "100%" }}
              label="Width"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  setWidth(18);
                } else {
                  setWidth(+event.target.value);
                }
              }}
            >
              {[...Array(50).keys()].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              value={height || ""}
              className="value"
              style={{ width: "100%" }}
              label="Height"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  setHeight(14);
                } else {
                  setHeight(
                    isNaN(+event.target.value) ? 14 : +event.target.value
                  );
                }
              }}
            >
              {[...Array(50).keys()].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              value={mines || ""}
              className="value"
              style={{ width: "100%" }}
              label="Mines"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  setMines(40);
                } else {
                  setMines(
                    isNaN(+event.target.value) ? 40 : +event.target.value
                  );
                }
              }}
            >
              {[...Array(50).keys()].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={createBoard}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateDialog;
