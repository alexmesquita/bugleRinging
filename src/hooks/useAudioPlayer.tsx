import { useContext } from 'react'
import { AudioContext } from '../contexts/AudioContext'

export function useAudioPlayer() {
  const context = useContext(AudioContext)

  return context
}
