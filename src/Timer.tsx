// import { Display } from "./Stopwatch";
import { useEffect, useState } from "react";

const Timer = () => {
  const [rawTime, setRawTime] = useState([0,0,0,0,0,0]);
  const [seconds, setSeconds] = useState(parseInt(rawTime.slice(4,6).join('')));
  const [minutes, setMinutes] = useState(parseInt(rawTime.slice(2,4).join('')));
  const [hours, setHours] = useState(parseInt(rawTime.slice(0,2).join('')));
  let countdown: any;

  const addDigit = (e: any) => {
    let timeString = rawTime;
    timeString.shift();
    timeString.push(e.target.value[e.target.value.length - 1]);
    setRawTime(timeString);
    setSeconds(parseInt(rawTime.slice(4,6).join('')));
    setMinutes(parseInt(rawTime.slice(2,4).join('')));
    setHours(parseInt(rawTime.slice(0,2).join('')));
  } 

  // useEffect(() => {
  //   setSeconds(rawTime.slice(4,6).join(''));
  //   console.log('seconds are', seconds);
  // }, [rawTime])

  const tick = () => {
    setSeconds(seconds - 1);
    if (seconds === 0) {
      setSeconds(59);
      setMinutes(minutes - 1);
      if (minutes === 0) {
        setMinutes(59);
        setHours(hours - 1);
      }
    }
  };

  const startTimer = () => {
    countdown = setInterval(tick, 1000)
  };

  const alarm = () => {
    if (seconds === 0 && minutes === 0 && hours === 0) {
      clearInterval(countdown);
    }
  };

  useEffect(() => {
    alarm();
  }, [rawTime])

  const ClockDisplay = (seconds: number, minutes: number, hours: number) => {
    return (
      <div className="stopwatch-display w-full flex justify-center h-24 mt-8">
        <div className="h-full px-8 md:px-20  bg-gray-800/20 text-yellow-500 text-4xl sm:text-6xl md:text-7xl lg:text-8xl grid grid-cols-8 gap-4 overflow-hidden">
          <div className="flex items-center justify-center mr-2 ">{hours}</div>
          {/* <div className="flex items-center justify-center ">{hours[1]}</div> */}
  
          <div className="flex items-center justify-center mb-1 text-gray-600">
            :
          </div>
          <div className="flex items-center justify-center mr-2">
            {minutes}
          </div>
          {/* <div className="flex items-center justify-center ">{minutes[1]}</div> */}
  
          <div className="flex items-center justify-center mb-1 text-gray-600">
            :
          </div>
          <div className="flex items-center justify-center mr-2">
            {seconds}
          </div>
          {/* <div className="flex items-center justify-center ">{seconds[1]}</div> */}
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>Timer</h1>
      <div className='timer-body'>
        <div className='clock-face'>
          {ClockDisplay(hours, minutes, seconds)}
        <input onChange={addDigit} value={rawTime.join('')}/>
        </div>

        <div className='main-controls'>
        <button onClick={startTimer}>Start</button>
        </div>

        <div className='warning-controls'>

        </div>

        <div className='quick-settings'>

        </div>
      </div>

    </>
  )
}


export default Timer;