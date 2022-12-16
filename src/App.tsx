import React, { useReducer, Dispatch } from "react";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";

import "./App.css";

// types

const initialState: TimerState = {
  timerState: "stopped",
  milliseconds: 0,
};

type TimerState = {
  milliseconds: number;
  timerState: "stopped" | "playing" | "paused";
};

type TimerAction = {
  type: "PLAY" | "PAUSE" | "RESET";
};

type DisplayState = {
  minutes: number;
  seconds: number;
};

// create a timer that logs the time to the screen and has a start stop and reset button

const reducer = (
  state: typeof initialState,
  action: TimerAction
): TimerState => {
  switch (action.type) {
    case "PLAY":
      return { milliseconds: 2, timerState: "stopped" };
    case "PAUSE":
      return { milliseconds: 2, timerState: "stopped" };
    case "RESET":
      return {
        milliseconds: 0,
        timerState: "stopped",
      };
    default:
      throw new Error();
  }
};

const Display = ({ minutes, seconds }: DisplayState) => {
  return (
    <div className="w-full flex justify-center h-24 mt-8 border-gray-500 ">
      <div className="h-full w-1/3 border-2 border-gray-500 bg-white text-5xl flex items-center justify-center">
        {minutes}:{seconds}
      </div>
    </div>
  );
};

const Controls = ({
  dispatch,
  state,
}: {
  state: TimerState;
  dispatch: Dispatch<TimerAction>;
}) => {
  return (
    <div className="flex h-full flex-row cursor-pointer items-center justify-center ">
      <PlayButton />
      <ResetButton />
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = () => dispatch({ type: "RESET" });

  const toggle = () => {
    if (state.timerState === "paused" || state.timerState === "stopped") {
      dispatch({ type: "PLAY" });
    } else if (state.timerState === "playing") {
      dispatch({ type: "PAUSE" });
    }
  };

  return (
    <div className="h-screen flex justify-center max-w-7xl bg-white">
      <div className="flex flex-col text-4xl my-10 h-96 w-1/2 border-2 bg-blue-900 border-gray-500">
        <Display minutes={100} seconds={2} />
        <Controls state={state} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default App;
