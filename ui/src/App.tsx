import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./App.css";
import Board from "./components/board";
import Header from "./components/header";
import SnackbarProvider from "./components/snackbar/SnackbarProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider>
          <div className="App">
            <Header />
            <div className="App-header">
              <Routes>
                <Route path="/home" element={<Board />} />
                <Route path="/" element={<Board />} />
              </Routes>
            </div>
          </div>
        </SnackbarProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
