export type TimerState = {
  seconds: number;
  timerState: "stopped" | "playing" | "paused";
};

export type TimerAction = {
  type: "SET" | "PLAY" | "PAUSE" | "RESET" | "TICK";  
};

export type DisplayState = {
  hours: string;
  minutes: string;
  seconds: string;
};


export const setClock = (clockInput: string[]) => {
  return({
    type: 'SET',
    clockInput
  })
}

export type TimerActionPayload = {
  type: "SET" | "PRESET" | "DELETE" | "PLAY" | "PAUSE" | "RESTART" | "RESET" | "TICK" | "ZERO"; 
  payload: any;
}