import { createSlice } from "@reduxjs/toolkit";

interface StopwatchState {
  timerState: "playing" | "paused" | "stopped";
  seconds: number;
}

const initialState: StopwatchState = {
  timerState: "stopped",
  seconds: 0,
};

export const stopwatchSlice = createSlice({
  name: "stopwatch",
  initialState,
  reducers: {
    tick: (state) => {
      state.seconds += 1;
    },
    play: (state) => {
      state.timerState = "playing";
    },
    pause: (state) => {
      state.timerState = "paused";
    },
    reset: (state) => {
      state.timerState = "stopped";
      state.seconds = 0;
    },
  },
});

export const { tick, play, pause, reset } = stopwatchSlice.actions;

export default stopwatchSlice.reducer;
