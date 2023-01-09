import React, { useEffect } from "react";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";
import { DisplayState } from "../types";
import "../App.css";
import { useAppSelector, useAppDispatch } from "./hooks";
import { tick, play, pause, reset } from "./features/stopwatch/stopwatchSlice";

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

const Controls = () => {
  const stopwatchState = useAppSelector((state) => state.stopwatch);
  const dispatch = useAppDispatch();

  const { timerState } = stopwatchState;

  const toggle = () => {
    if (timerState === "paused" || timerState === "stopped") {
      console.log("toggle clicked", play, stopwatchState);
      dispatch(play());
    } else if (timerState === "playing") {
      dispatch(pause());
    }
  };

  return (
    <div className="flex h-full flex-row cursor-pointer items-center justify-center ">
      <PlayButton state={stopwatchState} onClick={toggle} />
      <ResetButton onClick={() => dispatch(reset())} />
    </div>
  );
};

const Stopwatch = () => {
  const stopwatchState = useAppSelector((state) => state.stopwatch);
  const dispatch = useAppDispatch();

  const { timerState, seconds } = stopwatchState;

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
        dispatch(tick());
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
                seconds={formatSeconds(seconds)}
                minutes={formatMinutes(seconds)}
                hours={formatHours(seconds)}
              />
              <Controls />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
