import React, { useEffect } from 'react'
import { PlayButton } from '../../components/PlayButton'
import { ResetButton } from '../../components/ResetButton'
import Display from '../../components/Display'
import '../../../App.css'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { tick, play, pause, reset } from './stopwatchSlice'

const Controls = () => {
  const stopwatchState = useAppSelector((state) => state.stopwatch)
  const dispatch = useAppDispatch()

  const { timerState } = stopwatchState

  const toggle = () => {
    if (timerState === 'paused' || timerState === 'stopped') {
      console.log('toggle clicked', play, stopwatchState)
      dispatch(play())
    } else if (timerState === 'playing') {
      dispatch(pause())
    }
  }

  return (
    <div className='flex h-full flex-row cursor-pointer items-center justify-center '>
      <PlayButton state={stopwatchState} onClick={toggle} />
      <ResetButton onClick={() => dispatch(reset())} />
    </div>
  )
}

const Stopwatch = () => {
  const stopwatchState = useAppSelector((state) => state.stopwatch)
  const dispatch = useAppDispatch()

  const { timerState, seconds } = stopwatchState

  const idRef = React.useRef<ReturnType<typeof setInterval | any>>(0)

  const formatSeconds = (seconds: number) => {
    return `0${seconds % 60}`.slice(-2)
  }

  const formatMinutes = (seconds: number) => {
    const minutes = `${Math.floor(seconds / 60)}`
    const getMinutes = `0${+minutes % 60}`.slice(-2)

    return getMinutes
  }

  const formatHours = (seconds: number) => {
    return `0${Math.floor(seconds / 3600)}`.slice(-2)
  }

  useEffect(() => {
    if (timerState === 'playing') {
      idRef.current = setInterval(() => {
        dispatch(tick())
      }, 1000)
    }
    return () => {
      clearInterval(idRef.current)
      idRef.current = 0
    }
  }, [timerState])

  return (
    <div className='min-h-[calc(100vh-300px)] max-h-[calc(100vh-100px)]'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between items-center '>
        <div>
          <div className='mt-8 flex justify-center flex-col items-center'>
            <div className='flex flex-col my-10 h-96 w-10/12 border border-gray-800 bg-spring-wood-100'>
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
  )
}

export default Stopwatch
