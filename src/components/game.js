import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Die from "./die";
import Score from "./score";
import LastScoreCard from "./lastScoreCard";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

function Game() {
  const { width, height } = useWindowSize();
  const [dices, setDices] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  // state to store time
  const [time, setTime] = useState(0);
  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  const [lastScore, setLastScore] = useState();
  const [objToSetLastScore, setObjToSetLastScore] = useState({});

  useEffect(() => {
    if (localStorage.getItem("last-score")) {
      const res = JSON.parse(localStorage.getItem("last-score"));
      res && setLastScore(res);
    }
  }, []);

  useEffect(() => {
    if (tenzies) {
      const newObj = {
        rollCount: rollCount,
        time: time,
      };
      setObjToSetLastScore(newObj);
      localStorage.setItem("last-score", JSON.stringify(newObj));
    }
  }, [tenzies, rollCount, time]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Time calculation
  // const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  React.useEffect(() => {
    const allHeld = dices.every((dice) => dice.isHeld === true);
    const firstValue = dices[0].value;
    const allSameValue = dices.every((dice) => dice.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setIsRunning(false);
    }
  }, [dices, setTenzies, setIsRunning]);

  function genRanNum() {
    return {
      value: Math.floor(Math.random() * (6 - 1 + 1)) + 1,
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 12; i++) {
      newDice.push(genRanNum());
    }
    return newDice;
  }

  function rollHandleClick() {
    if (!tenzies) {
      setDices((oldDices) =>
        oldDices.map((dice) => {
          return dice.isHeld === true ? dice : genRanNum();
        })
      );

      setRollCount((oldRollCount) => oldRollCount + 1);

      !isRunning && setIsRunning(true);
    } else {
      setTenzies(false);
      setDices(allNewDice());
      setRollCount(0);
      setIsRunning(true);
      setTime(0);
      setLastScore(objToSetLastScore);
    }
  }

  function numHandleClick(id) {
    setDices((oldDices) =>
      oldDices.map((dice) => {
        return dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice;
      })
    );

    !isRunning && setIsRunning(true);
  }

  function restartHndleClick() {
    setTenzies(false);
    setDices(allNewDice());
    setRollCount(0);
    setIsRunning(false);
    setTime(0);
  }

  const dice = dices.map((dice) => {
    return (
      <Die
        key={dice.id}
        value={dice.value}
        id={dice.id}
        isHeld={dice.isHeld}
        onClick={numHandleClick}
      />
    );
  });

  return (
    <div className="real-app">
      {tenzies && <Confetti width={width} height={height} />}
      <Container>
        <div className="stage-container">
          <div className="">
            <h1>DiceHarmony</h1>
            <p>
              You'll see 12 dice numbered 1 to 6. Match them all to the same
              number. Click "Roll" to roll unselected dice, click on a die to
              lock its number. Use "Restart" for a new game. Score is based on
              completion time and minimal rolls. Enjoy DiceHarmony - aim for the
              best score!
            </p>
          </div>
          <div className="score-container">
            <Score
              value={rollCount}
              minutes={minutes}
              seconds={seconds}
              milliseconds={milliseconds}
              isRunning={isRunning}
            />
          </div>
          <div className="dies-container">
            <Row>{dice}</Row>
          </div>
          <div className="dice-btn">
            <Button
              variant="primary"
              className="mt-0 btn"
              onClick={rollHandleClick}
            >
              {tenzies ? "New Game" : "Roll"}
            </Button>
            {!tenzies ? (
              <Button
                variant="primary"
                className="mt-0 btn"
                onClick={restartHndleClick}
              >
                Restart
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <LastScoreCard lastScore={lastScore} />
      </Container>
    </div>
  );
}

export default Game;
