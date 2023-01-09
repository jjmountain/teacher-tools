import React, { useReducer, Dispatch, useEffect } from "react";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";
import { TimerState, TimerAction, DisplayState } from "./types";
import "./App.css";
import GithubLogo from "./github-mark.png";

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
      return { ...state, timerState: "paused" };
    case "RESET":
      return {
        seconds: 0,
        timerState: "stopped",
      };
    default:
      throw new Error();
  }
};

export const Display = ({ seconds, minutes, hours }: DisplayState) => {
  return (
    <div className="stopwatch-display w-full flex justify-center h-24 mt-8">
      <div className="h-full px-8 md:px-20   text-gray-900 text-4xl sm:text-6xl md:text-7xl lg:text-8xl grid grid-cols-8 gap-4 overflow-hidden">
        <div className="flex items-center justify-center mr-2 ">{hours[0]}</div>
        <div className="flex items-center justify-center ">{hours[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-900">
          :
        </div>
        <div className="flex items-center justify-center mr-2">
          {minutes[0]}
        </div>
        <div className="flex items-center justify-center ">{minutes[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-900">
          :
        </div>
        <div className="flex items-center justify-center mr-2">
          {seconds[0]}
        </div>
        <div className="flex items-center justify-center ">{seconds[1]}</div>
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
      <PlayButton state={state} onClick={toggle} />
      <ResetButton onClick={reset} />
    </div>
  );
};

const Stopwatch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { timerState } = state;

  const idRef = React.useRef<ReturnType<typeof setInterval | any>>(0);

  const formatSeconds = (seconds: number) => {
    return `0${seconds % 60}`.slice(-2);
  };

  const formatMinutes = (seconds: number) => {
    const minutes: string = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${+minutes % 60}`.slice(-2);

    return getMinutes;
  };

  const formatHours = (seconds: number) => {
    return `0${Math.floor(seconds / 3600)}`.slice(-2);
  };

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
    <div className="h-screen min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between items-center ">
        <div>
          <div className="mt-8 flex justify-center flex-col items-center">
            <div className="flex flex-col my-10 h-96 w-10/12 border border-gray-800 bg-beige">
              <Display
                seconds={formatSeconds(state.seconds)}
                minutes={formatMinutes(state.seconds)}
                hours={formatHours(state.seconds)}
              />
              <Controls state={state} dispatch={dispatch} />
            </div>
          </div>
        </div>
        {/* <div className="text-lg">
          Built in React and Typescript by{" "}
          <a
            href="https://github.com/jjmountain"
            target="_blank"
            rel="noreferrer"
            className="text-blue-700"
          >
            @jjmountain
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Stopwatch;
