export type TimerState = {
  seconds: number;
  timerState: "stopped" | "playing" | "paused";
};

export type TimerAction = {
  type: "PLAY" | "PAUSE" | "RESET" | "TICK";
};

export type DisplayState = {
  seconds: number;
};
