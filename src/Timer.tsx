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


const clockString = (timeInput: string[]) => {

};


const reducer = (
  state: typeof initialState,
  action: TimerActionPayload
): TimerState => {
  switch (action.type) {
    case "PRESET":
      return { ...state, seconds: action.payload};
    case "SET":
      return { ...state, seconds: toSeconds(action.payload)};
    case "TICK":
      return { ...state, seconds: state.seconds - 1 };
    case "PLAY":
      return { ...state, seconds: toSeconds(action.payload), timerState: "playing" };
    case "RESTART":
      return { ...state, timerState: "playing" };
    case "PAUSE":
      return { ...state, timerState: "paused" };
    case "RESET":
      return { ...state, seconds: toSeconds(action.payload), timerState: "stopped" };
    case "ZERO":
      return { ...state, seconds: 0, timerState: "stopped" };
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
  setPresetting,
}: {
  state: TimerState;
  dispatch: Dispatch<TimerActionPayload>;
  clockInput: string[];
  setPresetting: any;
}) => {
  const reset = () => {
    alarmSound.pause();
    dispatch({ type: "RESET", payload: clockInput });
  }

  const toggle = () => {
    if (state.timerState === "stopped") {
      reduceBigTime();
      setPresetting(false);
      dispatch({ type: "PLAY", payload: clockInput });
    } else if (state.timerState === "playing") {
      dispatch({ type: "PAUSE", payload: null });
    } else {
      setPresetting(false);
      dispatch({ type: "RESTART", payload: null });
    }
  };

  const reduceBigTime = () => {
    if (parseInt(clockInput[2]) > 5) {
      clockInput[2] = '5';
      clockInput[3] = '9';
    };
    if (parseInt(clockInput[4]) > 5) {
      clockInput[4] = '5';
      clockInput[5] = '9';
    };
    console.log('reducing big time to ', clockInput)
    dispatch({type: "SET", payload: clockInput})
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
  const [presetting, setPresetting] = useState(true)
  const [state, dispatch] = useReducer(reducer, initialState);
  const [reminderInterval, setReminderInterval] = useState(-1)
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

  const checkForReminder = () => {
    if (state.seconds > 0 && state.seconds % (60 * reminderInterval) === 0) {
      let msg = new SpeechSynthesisUtterance();
      let mins = state.seconds / 60
      msg.text = mins === 1 ? `${state.seconds / 60} minute remains` : `${state.seconds / 60} minutes remain`;
      window.speechSynthesis.speak(msg);
    }
  }

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

  useEffect(() => {
    if (reminderInterval > 0) checkForReminder();
  }, [state.seconds])


  const [clockInput, setClockInput] = useState(['0','0','0','0','0','0']);
  const clockInputRef = useRef(clockInput);
  const _setClockInput = (value: string[]) => {
    clockInputRef.current = value;
    setClockInput(value);
  }

  const addDigit = (e: any) => {
    let timeArray = clockInput;
    let nums = '0123456789';
    let lastDigit = e.target.value[e.target.value.length - 1];
    if (nums.includes(lastDigit)) {
      timeArray.shift();
      timeArray.push(lastDigit);
      _setClockInput(timeArray);
      console.log(timeArray);
      setPresetting(true);
      dispatch({ type: "PRESET", payload: timeArray});
    } else {
      // TODO: deal with delete and with numbers greater than 59 
    }
  } 

  const alarm = () => {
    if (state.timerState === 'playing' && state.seconds <= 0) {
      alarmSound.play();
      dispatch({type: 'ZERO', payload: null});
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
    alarmSound.pause();
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

  let deleteListener: any;
  
  const allowTimeSetting = () => {
    // TODO: refactor and remove redundancy
    _setClockInput(['0','0','0','0','0','0']);
    dispatch({ type: "ZERO", payload: null });
    const timeEntryField = document.getElementById('time-entry-field');
    const cursor = document.getElementById('cursor');
    if (timeEntryField && cursor) {

      if (!deleteListener) {
        deleteListener = timeEntryField.addEventListener('keydown', (e) => {
          if (e.keyCode === 8 || e.which === 8) {
            e.preventDefault();
            let newClockArray = clockInputRef.current;
            newClockArray.unshift('0');
            newClockArray.pop();
            _setClockInput(newClockArray);
            console.log(newClockArray)
            dispatch({ type: "PRESET", payload: newClockArray});
          }
        });
      }

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
  };


  return (
    <div className="timer-page">
      
      <div className='timer-body rounded-lg h-900'>
        <h1 className='title'>Timer</h1>
        <input id='time-entry-field' className='h-0 w-0' onChange={addDigit} />
        <div onClick={allowTimeSetting} className="clock">
          <Display
            seconds={presetting ? clockInput.slice(4,6).join('') : formatSeconds(state.seconds)}
            minutes={presetting ? clockInput.slice(2,4).join('') : formatMinutes(state.seconds)}
            hours={presetting ? clockInput.slice(0,2).join('') : formatHours(state.seconds)}
          />
        </div>
        <div className='main-controls mt-5 mb-5'>
          <Controls 
            state={state} 
            dispatch={dispatch} 
            clockInput={clockInput}
            setPresetting={setPresetting} 
          />
        </div>

        <div className='warning-controls flex flex-col items-center'>
          <label className="text-white mb-5" htmlFor='slider'>Countdown Warning Threshold: {warningThreshold} Seconds </label>
          <input 
            type="range" 
            min="0"
            max="15"
            onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
            value={warningThreshold}
            id='slider'
          />
        </div>
        <div className='remaining-time-reminders mt-5'>
        <label className='text-white mr-5' htmlFor="cars">Remind me of remaining time:</label>

        <select onChange={(e) => setReminderInterval(parseInt(e.target.value))} name="intervals" id="intervals">
          <option value="-1">never</option>
          <option value="1">every minute</option>
          <option value="5">every 5 minutes</option>
          <option value="10">every 10 minutes</option>
        </select>

        </div>
      </div>

    </div>
  )
  
};


export default Timer;