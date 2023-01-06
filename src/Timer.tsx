// import { Display } from "./Stopwatch";
import React, { useEffect, useState, useRef, Dispatch, useReducer } from "react";
import { TimerState, TimerActionPayload, DisplayState }  from "./types";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";
import './timer.css';

const alarm = require('./sounds/alarm-beep.wav');
const alarmSound = new Audio(alarm);

const initialState: TimerState = {
  timerState: 'stopped',
  seconds: 0,
}

const toSeconds = (timeInput: string[]) => {
  let hours = parseInt(timeInput.slice(0,2).join(''));
  let minutes = parseInt(timeInput.slice(2,4).join(''));
  let seconds = parseInt(timeInput.slice(4,6).join(''));

  return seconds + minutes * 60 + hours * 3600;
};

const reducer = (
  state: typeof initialState,
  action: TimerActionPayload
): TimerState => {
  switch (action.type) {
    case "SET":
      return { ...state, seconds: toSeconds(action.payload)}
    case "TICK":
      return { ...state, seconds: state.seconds - 1 };
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
      <div className="h-full px-8 md:px-20  bg-gray-800/20 text-yellow-500 text-4xl sm:text-6xl md:text-7xl lg:text-8xl grid grid-cols-8 gap-4 overflow-hidden">
        <div className="flex items-center justify-center mr-2 ">{hours[0]}</div>
        <div className="flex items-center justify-center ">{hours[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-600">
          :
        </div>
        <div className="flex items-center justify-center mr-2">
          {minutes[0]}
        </div>
        <div className="flex items-center justify-center ">{minutes[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-600">
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
  dispatch: Dispatch<TimerActionPayload>;
}) => {
  const reset = () => dispatch({ type: "RESET", payload: null });

  const toggle = () => {
    if (state.timerState === "paused" || state.timerState === "stopped") {
      dispatch({ type: "PLAY", payload: null });
    } else if (state.timerState === "playing") {
      dispatch({ type: "PAUSE", payload: null });
    }
  };

  return (
    <div className="flex h-full flex-row cursor-pointer items-center justify-center ">
      <PlayButton state={state} onClick={toggle} />
      <ResetButton onClick={reset} />
    </div>
  );
};

const Timer = () => {

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
        dispatch({ type: "TICK", payload: null });
      }, 1000);
    }
    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [timerState]);


  const [clockInput, setClockInput] = useState(['0','0','0','0','0','0']);

  const addDigit = (e: any) => {
    let timeArray = clockInput;
    timeArray.shift();
    timeArray.push(e.target.value[e.target.value.length - 1]);
    setClockInput(timeArray);
    dispatch({ type: "SET", payload: timeArray });
  } 

  const alarm = () => {
    if (state.timerState === 'playing' && state.seconds <= 0) {
      alarmSound.play();
      dispatch({type: 'RESET', payload: null});
    }
  }

  useEffect(() => {
    alarm();
  }, [state.seconds])



  return (
    <div className="timer-page">
      
      <div className='timer-body'>
        <h1 className='title'>Timer</h1>
        <input onChange={addDigit}/>
        <div className="clock">
          <Display
            seconds={formatSeconds(state.seconds)}
            minutes={formatMinutes(state.seconds)}
            hours={formatHours(state.seconds)}
          />
        </div>
        <div className='main-controls'>
          <Controls state={state} dispatch={dispatch}/>
        </div>

        <div className='warning-controls'>

        </div>

        <div className='quick-settings'>

        </div>
      </div>

    </div>
  )
}


export default Timer;