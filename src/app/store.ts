import { configureStore } from '@reduxjs/toolkit'
import stopwatchSlice from './features/stopwatch/stopwatchSlice'

const store = configureStore({
  reducer: {
    stopwatch: stopwatchSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
