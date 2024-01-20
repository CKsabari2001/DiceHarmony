import React from "react";
import Col from "react-bootstrap/Col";

function Die(props) {
  const changeClr = props.isHeld && "isHeld";
  const diceImgUrl = `/img/dice-${props.value}-svgrepo-com.svg`;
  return (
    <Col xs={3} lg={2}>
      <div
        className={`die-box ${changeClr}`}
        onClick={() => props.onClick(props.id)}
      >
        <img src={diceImgUrl} className="img-fluid" alt="" />
      </div>
    </Col>
  );
}

export default Die;
