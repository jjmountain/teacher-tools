import React, { useEffect, useState, useRef, Dispatch, useReducer } from "react";
import { TimerState, TimerActionPayload, DisplayState }  from "./types";
import { PlayButton } from "./components/PlayButton";
import { ResetButton } from "./components/ResetButton";
import { AddMinuteButton } from "./components/AddMinuteButton";

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
    case "PRESET":
      return { ...state, seconds: action.payload };
    case "SET":
      return { ...state, seconds: toSeconds(action.payload) };
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
    case "ADDMIN":
      return { ...state, seconds: state.seconds + 60 };
    default:
      throw new Error();
  }
};


export const Display = ({ seconds, minutes, hours }: DisplayState) => {

  const clockFace = document.getElementById('clock-face');
  const children = clockFace?.children as HTMLCollectionOf<HTMLElement>;

  useEffect(() => {
    if (children?.length) {
      let yellow = false;
      for (let i = 0; i < children?.length; i++) {
        if ('123456789'.includes(children[i].innerHTML)) yellow = true;
        if (yellow) {
          children[i].style.color = 'rgb(219, 190, 27)';
        } else {
          children[i].style.color = '#6B7280';
        }
      }
    }
  }, [seconds, minutes, hours]);

  return (
    <div className="stopwatch-display w-full flex justify-center h-24 mt-8">
      <div id="clock-face" className="relative h-full px-8 md:px-20  bg-gray-800/20 text-gray-500 text-4xl sm:text-6xl md:text-7xl lg:text-8xl grid grid-cols-8 gap-4 overflow-hidden">
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
  _setClockInput,
  presetting,
  setPresetting,
}: {
  state: TimerState;
  dispatch: Dispatch<TimerActionPayload>;
  clockInput: string[];
  _setClockInput: any;
  presetting: boolean;
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
    dispatch({type: "SET", payload: clockInput})
  }

  const addMinute = () => {
    if (!presetting) {
      dispatch({ type: "ADDMIN", payload: null})
    } else {
      let tempClockArray: number[] = [];
      clockInput.forEach(digit => tempClockArray.push(parseInt(digit)));
      tempClockArray[3] += 1;
      if (tempClockArray[3] > 9) {
        tempClockArray[3] = 0
        tempClockArray[2] += 1;
        if (tempClockArray[2] > 5) {
          tempClockArray[2] = 0
          tempClockArray[1] += 1;
          if (tempClockArray[1] > 9) {
            tempClockArray[1] = 0
            tempClockArray[0] += 1;
            if (tempClockArray[0] > 9) {
              tempClockArray[0] = 9
            }
          }
        }
      }
      dispatch({type: "PRESET", payload: tempClockArray})
      _setClockInput(tempClockArray)
    }
  }

  return (
    <div className="flex h-full flex-row cursor-pointer items-center justify-center ">
      <PlayButton state={state} onClick={toggle} />
      <ResetButton onClick={reset} />
      <AddMinuteButton addMinute={addMinute}/>
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
      setPresetting(true);
      dispatch({ type: "PRESET", payload: timeArray});
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
            let tempClockArray = clockInputRef.current;
            tempClockArray.unshift('0');
            tempClockArray.pop();
            console.log(tempClockArray)
            _setClockInput(tempClockArray);
            dispatch({ type: "PRESET", payload: tempClockArray});
          }
        });
      }

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
    <div className="timer-page flex flex-col justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-700 min-h-[calc(100vh-100px)]">

      <div className='timer-body flex flex-col my-10 h-160 w-10/12 bg-gray-700/90 rounded-xl max-w-[800px]'>
        <h1 className='title text-[#B2DB1B] text-5xl mt-8 text-center'>Timer</h1>
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
            _setClockInput={_setClockInput}
            presetting={presetting}
            setPresetting={setPresetting} 
          />
        </div>

        <div className='warning-controls flex flex-col items-center'>
          <label className="text-white mb-2 select-none" htmlFor='slider'>Countdown Warning Threshold: {warningThreshold} Seconds </label>
          <input 
            type="range" 
            min="0"
            max="15"
            onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
            value={warningThreshold}
            id='slider'
          />
        </div>
        <div className='remaining-time-reminders mt-5 flex flex-row justify-center mb-5'>
          <label className='text-white mr-5' htmlFor="cars">Remind me of remaining time:</label>
          <select onChange={(e) => setReminderInterval(parseInt(e.target.value))} name="intervals" id="intervals">
            <option value="-1">never</option>
            <option value="1">every minute</option>
            <option value="5">every 5 minutes</option>
            <option value="10">every 10 minutes</option>
          </select>
        </div>
        <div></div>
      </div>

    </div>
  )
  
};


export default Timer;