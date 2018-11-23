import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

export default function App() {
  const [state, setState] = useState("green");

//   ~function(){
//       console.log('init');
//   }()

  const machine = {
    green: {
      TIMER: "yellow"
    },
    yellow: {
      TIMER: "red"
    },
    red: {
      TIMER: "green"
    }
  };

  // The finite state machine transition function
  const transition = (state, action) => {
    return machine[state][action];
  };

  // Any side effects
  const update = newState => {
    setState(newState);
  };

//   setTimeout(() => {
//     handleClick();
//   }, 2000);

//   setInterval(() => {
//     handleClick();
//   }, 2000);

useEffect(() => {
    const timer = setTimeout(() => {
        nextTick();
          }, 2000);
    return () => {
      // Clean up the subscription
      clearTimeout(timer);
    };
  });

  const nextTick = () => {
    // console.log("prevState", state);
    const nextState = transition(state, "TIMER");
    // console.log("nextState", nextState);
    update(nextState);
  };

  const handleClick = () => {
    nextTick()
  }

  return (
    <div className="App">
      <div className="trafficlight">
        <div className="protector" />
        <div className="protector" />
        <div className="protector" />
        <div className="red" style={{ opacity: state === "red" ? 1 : 0.1 }} />
        <div
          className="yellow"
          style={{ opacity: state === "yellow" ? 1 : 0.1 }}
        />
        <div
          className="green"
          style={{ opacity: state === "green" ? 1 : 0.1 }}
        />
      </div>
      <button className="timer" onClick={handleClick}>
        Trigger timer
      </button>
    </div>
  );
}
