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

function Game(props) {
  const { width, height } = useWindowSize();
  const [dices, setDices] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  // state to store time
  const [time, setTime] = useState(0);
  // state to check stopwatch running or not
  const isRunning = props.isRunning;
  const setIsRunning = props.changeIsRunning;

  const [lastScore, setLastScore] = useState();

  let objToSetLastScore = {};

  useEffect(() => {
    if (localStorage.getItem("last-score")) {
      const res = JSON.parse(localStorage.getItem("last-score"));
      res && setLastScore(res);
    }
  }, []);

  useEffect(() => {
    if (tenzies) {
      objToSetLastScore = {
        rollCount: rollCount,
        time: time,
      };

      localStorage.setItem("last-score", JSON.stringify(objToSetLastScore));
    }
  }, [tenzies]);

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
  }, [dices, setTenzies]);

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
            <h1>Unity Roll</h1>
            <p>
              Click to roll the dice, freeze the ones you like, and aim for a
              matching set. Can you get them all to show the same number?
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
