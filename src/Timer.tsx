// import { Display } from "./Stopwatch";
import React, { useEffect, useState, useRef, Dispatch, useReducer } from "react";
import { TimerState, TimerActionPayload, DisplayState }  from "./types";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";
import './timer.css';

const alarm = require('./sounds/alarm-beep.wav');
const alarmSound = new Audio(alarm);
const warning = require('./sounds/warning.wav');
const warningSound = new Audio(warning);

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
        seconds: toSeconds(action.payload),
        timerState: "stopped",
      };
    case "ALARM":
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
      <div id="clock-face" className="relative h-full px-8 md:px-20  bg-gray-800/20 text-yellow-500 text-4xl sm:text-6xl md:text-7xl lg:text-8xl grid grid-cols-8 gap-4 overflow-hidden">
        <div className="flex items-center justify-center mr-2 ">{hours[0]}</div>
        <div className="flex items-center justify-center ">{hours[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-600">
          :
        </div>
        <div className="flex items-center justify-center mr-2 ">
          {minutes[0]}
        </div>
        <div className="flex items-center justify-center ">{minutes[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-600">
          :
        </div>
        <div className="flex items-center justify-center mr-2">
          {seconds[0]}
        </div>
        <div id='last-digit' className="flex items-center justify-center">{seconds[1]}</div>
        <div id='cursor' className="h-100px absolute right-14 border-5 border-solid border-indigo-300"></div>
      </div>
    </div>
  );
};


const Controls = ({
  dispatch,
  state,
  clockInput,
}: {
  state: TimerState;
  dispatch: Dispatch<TimerActionPayload>;
  clockInput: string[];
}) => {
  const reset = () => {
    alarmSound.pause();
    dispatch({ type: "RESET", payload: clockInput });
  }

  const toggle = () => {
    if (state.timerState === "paused" || state.timerState === "stopped") {
      if (state.timerState === "stopped") reduceBigTime();
      dispatch({ type: "PLAY", payload: null });
    } else if (state.timerState === "playing") {
      dispatch({ type: "PAUSE", payload: null });
    }
  };

  const reduceBigTime = () => {
    console.log('reducing big time')
    if (parseInt(clockInput[2]) > 5) {
      clockInput[2] = '5';
      clockInput[2] = '9';
    };
    if (parseInt(clockInput[5]) > 5) {
      clockInput[5] = '5';
      clockInput[6] = '9';
    };
    dispatch({type: 'SET', payload: clockInput})
  }

  return (
    <div className="flex h-full flex-row cursor-pointer items-center justify-center ">
      <PlayButton state={state} onClick={toggle} />
      <ResetButton onClick={reset} />
    </div>
  );
};

const Timer = () => {

  const [warningThreshold, setWarningThreshold] = useState(0);
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
    let nums = '0123456789';
    let lastDigit = e.target.value[e.target.value.length - 1];
    if (nums.includes(lastDigit)) {
      timeArray.shift();
      timeArray.push(lastDigit);
      setClockInput(timeArray);
      console.log(timeArray)
      dispatch({ type: "SET", payload: timeArray });
    } else {
      // TODO: deal with delete and with numbers greater than 59 
    }
  } 

  const alarm = () => {
    if (state.timerState === 'playing' && state.seconds <= 0) {
      alarmSound.play();
      dispatch({type: 'ALARM', payload: null});
    }
  }

  useEffect(() => {
    if (state.timerState === 'playing' && state.seconds <= warningThreshold && state.seconds > 0) {
      warningSound.play();
    }
    alarm();
  }, [state.seconds]);


  let cursorBlinker: any;
  let cursorGreen: any;
  let cursorGreen2: any;

  document.addEventListener('click', () => {
    const timeEntryField = document.getElementById('time-entry-field');
    const cursor = document.getElementById('cursor');
    if (timeEntryField && cursor) {
      if (timeEntryField !== document.activeElement && cursorBlinker) {
        clearInterval(cursorBlinker);
        cursor.style.border = 'none';
        if (cursorGreen) clearTimeout(cursorGreen);
        if (cursorGreen2) clearTimeout(cursorGreen2);
      }
    }
  })

  
  const allowTimeSetting = () => {
    // TODO: refactor and remove redundancy
    const timeEntryField = document.getElementById('time-entry-field');
    const cursor = document.getElementById('cursor');
    if (timeEntryField && cursor) {
      console.log('time entry clicked')
      timeEntryField.style.backgroundColor = "green";
      timeEntryField.focus();
      cursor.style.height = "100%";
      cursor.style.borderRight = "3px solid purple";
      cursorGreen = setTimeout(() => {
        cursor.style.borderRight = "3px solid green";
      }, 1000)
      cursorBlinker = setInterval(() => {
        cursor.style.borderRight = "3px solid purple";
        cursorGreen2 = setTimeout(() => {
          cursor.style.borderRight = "3px solid green";
        }, 1000)
      }, 2000)
    }

  }


  return (
    <div className="timer-page">
      
      <div className='timer-body'>
        <h1 className='title'>Timer</h1>
        <input id='time-entry-field' className='h-0 w-0' onChange={addDigit} value={clockInput.join('')}/>
        <div onClick={allowTimeSetting} className="clock">
          <Display
            seconds={formatSeconds(state.seconds)}
            minutes={formatMinutes(state.seconds)}
            hours={formatHours(state.seconds)}
          />
        </div>
        <div className='main-controls'>
          <Controls state={state} dispatch={dispatch} clockInput={clockInput}/>
        </div>

        <div className='warning-controls flex flex-col items-center'>
          <label htmlFor='slider'>Warning Threshold: {warningThreshold} Seconds </label>
          <input 
            type="range" 
            min="0"
            max="15"
            onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
            // style={getBackgroundSize()}
            value={warningThreshold}
            id='slider'
          />
        </div>
        <div className='quick-settings'>

        </div>
      </div>

    </div>
  )
  
};


export default Timer;