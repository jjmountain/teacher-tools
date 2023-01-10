import { PlayButton } from '../../components/PlayButton'
import { ResetButton } from '../../components/ResetButton'
import { play, pause, reset } from './stopwatchSlice'
import { useAppDispatch, useAppSelector } from '../../hooks'

const Controls = () => {
  const stopwatchState = useAppSelector((state) => state.stopwatch)
  const timerState = useAppSelector((state) => state.stopwatch.timerState)

  const dispatch = useAppDispatch()

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
      <PlayButton onClick={toggle} />
      <ResetButton onClick={() => dispatch(reset())} />
    </div>
  )
}

export default Controls
