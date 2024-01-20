import React from "react";

function Score(props) {
  const minutes = props.minutes.toString().padStart(2, "0");
  const seconds = props.seconds.toString().padStart(2, "0");
  const milliseconds = props.milliseconds.toString().padStart(2, "0");

  return (
    <div className="score-main-contianer">
      <div className="score-item-con dies-count-con">
        <h5>{props.value} Times</h5>
      </div>
      <div className="score-item-con dies-count-con">
        <h5 className="stopwatch-time">
          {`${minutes}:${seconds}:${milliseconds}`}
        </h5>
      </div>
    </div>
  );
}

export default Score;
