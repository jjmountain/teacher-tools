import React, { useReducer, Dispatch, useEffect } from "react";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";
import { TimerState, TimerAction, DisplayState } from "./types";
import "./App.css";

const initialState: TimerState = {
  timerState: "stopped",
  seconds: 0,
};

// create a timer that logs the time to the screen and has a start stop and reset button

// on reset

const reducer = (
  state: typeof initialState,
  action: TimerAction
): TimerState => {
  switch (action.type) {
    case "TICK":
      return { ...state, seconds: state.seconds + 1 };
    case "PLAY":
      return { ...state, timerState: "playing" };
    case "PAUSE":
      return { ...state, timerState: "stopped" };
    case "RESET":
      return {
        seconds: 0,
        timerState: "stopped",
      };
    default:
      throw new Error();
  }
};

const Display = ({ seconds }: DisplayState) => {
  return (
    <div className="w-full flex justify-center h-24 mt-8 border-gray-500 ">
      <div className="h-full w-1/3 border-2 border-gray-500 bg-white text-5xl flex items-center justify-center">
        {seconds}
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
  const reset = () => dispatch({ type: "RESET" });

  const toggle = () => {
    if (state.timerState === "paused" || state.timerState === "stopped") {
      dispatch({ type: "PLAY" });
    } else if (state.timerState === "playing") {
      dispatch({ type: "PAUSE" });
    }
  };

  return (
    <div className="flex h-full flex-row cursor-pointer items-center justify-center ">
      <PlayButton onClick={toggle} />
      <ResetButton onClick={reset} />
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { timerState } = state;

  const idRef = React.useRef<ReturnType<typeof setInterval | any>>(0);

  useEffect(() => {
    if (timerState === "playing") {
      idRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }
    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [timerState]);

  return (
    <div className="h-screen flex justify-center max-w-7xl bg-white">
      <div className="flex flex-col text-4xl my-10 h-96 w-1/2 border-2 bg-blue-900 border-gray-500">
        <Display seconds={state.seconds} />
        <Controls state={state} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default App;
