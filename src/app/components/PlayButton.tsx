// import React, { Dispatch } from "React";
// import { TimerState, TimerAction, DisplayState } from "../types";

export const PlayButton = ({ onClick, state }: any) => {
  const PausedPath = () => {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    );
  };

  const PlayingPath = () => {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-spring-wood-50 group border-2 p-5 border-gray-600 active:bg-gray-300 mr-3 ml-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1"
        className={`w-10 h-10 md:w-16 md:h-16 fill-green-600 group-hover:fill-green-500 ${
          state.timerState === "playing" ? "stroke-gray-900" : "stroke-none"
        } `}
      >
        {state.timerState === "playing" && <PausedPath />}
        {(state.timerState === "paused" || state.timerState === "stopped") && (
          <PlayingPath />
        )}
      </svg>
    </div>
  );
};
