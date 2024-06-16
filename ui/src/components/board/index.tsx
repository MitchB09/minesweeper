import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Cell from "../cell";
import { useAppSelector } from "../../redux/hooks";
import { MinesweeperCell } from "../../types";
import "./board.css";
import Button from "@mui/material/Button";
import CreateDialog from "../createdialog";

function Board() {

  const { board } = useAppSelector((state) => state.minesweeperBoard);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {!board && (
        <>
          No Board
        </>
      )}
      <Grid
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
      >
        {board &&
          board.cells &&
          board.cells.map((row: MinesweeperCell[], rowIndex: number) => {
            return (
              <Grid
                key={`${rowIndex}`}
                item
                container
                direction="row"
                alignContent="center"
                justifyContent="center"
              >
                {row.map((cell, columnIndex) => {
                  return (
                    <Cell
                      key={`${rowIndex}.${columnIndex}`}
                      cell={cell}
                      index={{ row: rowIndex, column: columnIndex }}
                    />
                  );
                })}
              </Grid>
            );
          })}
        {!board && (
          <>
            <Button
              variant="contained"
              style={{ margin: "1em" }}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Create
            </Button>
            <CreateDialog
              isOpen={isOpen}
              handleClose={() => {
                setIsOpen(false);
              }}
            />
          </>
        )}
      </Grid>
    </>
  );
}

export default Board;
