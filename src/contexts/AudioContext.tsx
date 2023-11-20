import { AVPlaybackStatus, Audio } from 'expo-av'
import { ReactNode, createContext, useState } from 'react'
import { AudioDTO } from '../dtos/AudioDTO'
import { playNext } from '../services/AudioController'

export type activePlayListProps = {
  name: string
  audios: Array<AudioDTO>
}

export type AudioPlayerDataProps = {
  playbackObj: Audio.Sound
  soundObj: AVPlaybackStatus | null | undefined
  audioFiles: Array<AudioDTO>
  musicFiles: Array<AudioDTO>
  currentAudio: AudioDTO
  isPlaying: Boolean
  isPlayNext: Boolean
  isPlayListRunning: Boolean
  indexOnPlayList: number
  activePlayList: activePlayListProps
  currentAudioIndex: number | null
  playbackPosition: number | null
  playbackDuration: number | null | undefined
  audioType: string
}
export type AudioContextDataProps = {
  audioPlayer: AudioPlayerDataProps
  setAudioPlayer: (context: any) => void
  onPlaybackStatusUpdate: (playbackStatus: AVPlaybackStatus) => void
}

type AudioContextProviderProps = {
  children: ReactNode
}

export const AudioContext = createContext<AudioContextDataProps>(
  {} as AudioContextDataProps,
)

export function AudioContextProvider({ children }: AudioContextProviderProps) {
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayerDataProps>({
    playbackObj: new Audio.Sound(),
    soundObj: null,
    audioFiles: [] as Array<AudioDTO>,
    musicFiles: [] as Array<AudioDTO>,
    currentAudio: {} as AudioDTO,
    isPlaying: false,
    isPlayNext: false,
    isPlayListRunning: false,
    indexOnPlayList: 0,
    activePlayList: {} as activePlayListProps,
    currentAudioIndex: null,
    playbackPosition: null,
    playbackDuration: null,
    audioType: 'BUGLES',
  })

  async function cleanAudioPlayer() {
    const newState = audioPlayer

    newState.playbackObj.unloadAsync()
    newState.soundObj = null
    newState.currentAudio =
      newState.audioType === 'BUGLES'
        ? newState.audioFiles[0]
        : newState.musicFiles[0]
    newState.isPlaying = false
    newState.currentAudioIndex = 0
    newState.playbackPosition = null
    newState.playbackDuration = null

    setAudioPlayer((audioPlayer) => ({
      ...audioPlayer,
      ...newState,
    }))
  }

  async function onPlaybackStatusUpdate(playbackStatus: AVPlaybackStatus) {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      const newState = audioPlayer

      newState.playbackPosition = playbackStatus.positionMillis
      newState.playbackDuration = playbackStatus.durationMillis

      setAudioPlayer((audioPlayer) => ({
        ...audioPlayer,
        ...newState,
      }))
    }

    // if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
    //   storeAudioForNextOpening(
    //     this.state.currentAudio,
    //     this.state.currentAudioIndex,
    //     playbackStatus.positionMillis,
    //   )
    // }

    if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
      console.log('Acabou a música')

      if (audioPlayer.isPlayNext && audioPlayer.isPlayListRunning) {
        const indexOnPlayList = audioPlayer.activePlayList.audios.findIndex(
          ({ id }) => id === audioPlayer.currentAudio.id,
        )
        const nextIndex = indexOnPlayList + 1
        const nextAudio = audioPlayer.activePlayList.audios[nextIndex]

        if (!nextAudio) {
          cleanAudioPlayer()
          return
        }

        const indexOnAllList =
          audioPlayer.audioType === 'BUGLES'
            ? audioPlayer.audioFiles.findIndex(({ id }) => id === nextAudio.id)
            : audioPlayer.musicFiles.findIndex(({ id }) => id === nextAudio.id)

        const status = await playNext(
          audioPlayer.playbackObj,
          nextAudio.uriAudio,
        )
        const newState = audioPlayer

        newState.soundObj = status
        newState.isPlaying = true
        newState.currentAudio = nextAudio
        newState.currentAudioIndex = indexOnAllList

        setAudioPlayer((audioPlayer) => ({
          ...audioPlayer,
          ...newState,
        }))

        return
      }

      const nextAudioIndex = audioPlayer.currentAudioIndex
        ? audioPlayer.currentAudioIndex + 1
        : 1
      // there is no next audio to play or the current audio is the last
      if (
        !audioPlayer.isPlayNext ||
        nextAudioIndex >=
          (audioPlayer.audioType === 'BUGLES'
            ? audioPlayer.audioFiles.length
            : audioPlayer.musicFiles.length)
      ) {
        cleanAudioPlayer()
        return
        // TODO verificar se será preciso usar a função: storeAudioForNextOpening, tem em outros arquivos
        // return await storeAudioForNextOpening(audioFiles[0], 0)
      }
      // otherwise we want to select the next audio
      const audio =
        audioPlayer.audioType === 'BUGLES'
          ? audioPlayer.audioFiles[nextAudioIndex]
          : audioPlayer.musicFiles[nextAudioIndex]
      const status = await playNext(audioPlayer.playbackObj, audio.uriAudio)

      const newState = audioPlayer

      newState.soundObj = status
      newState.currentAudio = audio
      newState.isPlaying = true
      newState.currentAudioIndex = nextAudioIndex

      setAudioPlayer((audioPlayer) => ({
        ...audioPlayer,
        ...newState,
      }))
      // await storeAudioForNextOpening(audio, nextAudioIndex)
    }
  }

  return (
    <AudioContext.Provider
      value={{ audioPlayer, setAudioPlayer, onPlaybackStatusUpdate }}
    >
      {children}
    </AudioContext.Provider>
  )
}
