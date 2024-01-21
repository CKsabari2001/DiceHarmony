import React from "react";

function LastScoreCard(props) {
  const time = props.lastScore?.time;
  const rollCount = props.lastScore?.rollCount;

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  const finalTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;

  const isThereTime = () => {
    return (
      <>
        <div className="last-score-section">
          <h2>Previous Score</h2>
          <div className="last-score-card">
            <div className="score-con">
              <h5>
                Total Time <span>{finalTime}</span>
              </h5>
            </div>

            <div className="score-con">
              <h5>
                Total Count <span>{rollCount}</span>
              </h5>
            </div>
          </div>
        </div>
      </>
    );
  };

  const isThereNoTime = () => {
    return (
      <div className="last-score-card">
        <div className="score-con">
          <h5>No Record</h5>
        </div>
      </div>
    );
  };

  return <div>{time ? isThereTime() : isThereNoTime()}</div>;
}

export default LastScoreCard;
