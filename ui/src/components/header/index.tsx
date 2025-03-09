import React from "react";
import { Grid, Link, Typography } from "@mui/material";

function Header() {

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      style={{
        padding: "4px 25px",
        marginBottom: "1em",
        backgroundColor: "#0e0e0e",
        color: "white",
      }}
    >
      <Grid item>
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
          <Typography variant="h5">Minesweeper</Typography>
        </Link>
      </Grid>
      <Grid flexGrow={1} />
    </Grid>
  );
}

export default Header;
