import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import Game from "./components/game";

import "./css/main.css";

function App() {
  const [isGameStart, setIsGameStart] = useState(false);

  function StartTheGame() {
    return (
      <>
        <div className="stage-container before-game-start">
          <h1>Unity Roll</h1>
          <p>Click Start Button to Start the Game</p>
          <Button
            variant="primary"
            className="mt-3 btn"
            onClick={() => {
              setIsGameStart(true);
            }}
          >
            Start
          </Button>
        </div>
      </>
    );
  }
  return (
    <div className="app-container">
      {isGameStart ? <Game /> : <StartTheGame />}
    </div>
  );
}

export default App;
