import { Audio } from 'expo-av'
import { AudioDTO } from '../dtos/AudioDTO'
import {
  AudioContextDataProps,
  AudioPlayerDataProps,
  activePlayListProps,
} from '../contexts/AudioContext'
import { getAudioIdByPlaylist } from '../storage/audio/getAudioByPlaylist'
import { Dispatch, SetStateAction } from 'react'

type playListInfoProps = {
  activePlayList: activePlayListProps
  isPlayListRunning: Boolean
}

export function getAudiosByIds(audioFiles: AudioDTO[], ids: string[]) {
  const filteredAudios: AudioDTO[] = audioFiles.filter((item) =>
    ids.includes(item.id),
  )

  return filteredAudios
}

export async function getAudiosByPlaylist(
  audioPlayerContext: AudioContextDataProps,
  playListToSearch: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
) {
  let audiosPlaylist: AudioDTO[] = []
  try {
    setLoading(true)

    const audiosIds: string[] = await getAudioIdByPlaylist(playListToSearch)
    audiosPlaylist = getAudiosByIds(
      audioPlayerContext.audioPlayer.audioFiles,
      audiosIds,
    )
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
  return audiosPlaylist
}

// play audio
export async function play(
  playbackObj: Audio.Sound,
  uri: string,
  lastPosition?: number,
) {
  try {
    if (!lastPosition)
      return await playbackObj.loadAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
      )

    // but if there is lastPosition then we will play audio from the lastPosition
    await playbackObj.loadAsync({ uri }, { progressUpdateIntervalMillis: 1000 })

    return await playbackObj.playFromPositionAsync(lastPosition)
  } catch (error) {
    console.log('error inside play helper method', error)
  }
}

// pause audio
export async function pause(playbackObj: Audio.Sound) {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    })
  } catch (error) {
    console.log('error inside pause helper method', error)
  }
}

// resume audio
export const resume = async (playbackObj: Audio.Sound) => {
  try {
    return await playbackObj.playAsync()
  } catch (error) {
    console.log('error inside resume helper method', error)
  }
}

export async function selectAudio(
  audio: AudioDTO,
  audioPlayerContext: AudioContextDataProps,
  playListInfo?: playListInfoProps,
) {
  const { audioPlayer, setAudioPlayer, onPlaybackStatusUpdate } =
    audioPlayerContext

  try {
    // playing audio for the first time.
    if (audioPlayer.soundObj === null || audioPlayer.soundObj === undefined) {
      const status = await play(audioPlayer.playbackObj, audio.uri)
      const index = audioPlayer.audioFiles.findIndex(
        ({ id }) => id === audio.id,
      )

      audioPlayer.playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

      const newState = audioPlayer

      newState.currentAudio = audio
      newState.soundObj = status
      newState.isPlaying = true
      newState.currentAudioIndex = index
      newState.activePlayList =
        playListInfo && playListInfo.activePlayList
          ? playListInfo.activePlayList
          : ({} as activePlayListProps)
      newState.isPlayListRunning =
        playListInfo && playListInfo.isPlayListRunning
          ? playListInfo.isPlayListRunning
          : false

      setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
        ...audioPlayer,
        ...newState,
      }))

      // return storeAudioForNextOpening(audio, index)
      return
    }

    // pause audio
    if (
      audioPlayer.soundObj.isLoaded &&
      audioPlayer.soundObj.isPlaying &&
      audioPlayer.currentAudio.id === audio.id
    ) {
      const status = await pause(audioPlayer.playbackObj)
      const newState = audioPlayer

      newState.soundObj = status
      newState.isPlaying = false
      newState.playbackPosition =
        status && status.isLoaded ? status.positionMillis : 0

      setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
        ...audioPlayer,
        ...newState,
      }))

      return
    }

    // resume audio
    if (
      audioPlayer.soundObj.isLoaded &&
      !audioPlayer.soundObj.isPlaying &&
      audioPlayer.currentAudio.id === audio.id
    ) {
      const status = await resume(audioPlayer.playbackObj)
      const newState = audioPlayer

      newState.soundObj = status
      newState.isPlaying = true

      setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
        ...audioPlayer,
        ...newState,
      }))

      return
    }

    // select another audio
    if (
      audioPlayer.soundObj.isLoaded &&
      audioPlayer.currentAudio.id !== audio.id
    ) {
      const status = await playNext(audioPlayer.playbackObj, audio.uri)
      const index = audioPlayer.audioFiles.findIndex(
        ({ id }) => id === audio.id,
      )
      const newState = audioPlayer

      newState.currentAudio = audio
      newState.soundObj = status
      newState.isPlaying = true
      newState.currentAudioIndex = index
      newState.isPlayListRunning = false
      newState.activePlayList = {} as activePlayListProps
      newState.activePlayList =
        playListInfo && playListInfo.activePlayList
          ? playListInfo.activePlayList
          : ({} as activePlayListProps)
      newState.isPlayListRunning =
        playListInfo && playListInfo.isPlayListRunning
          ? playListInfo.isPlayListRunning
          : false

      setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
        ...audioPlayer,
        ...newState,
      }))
      // return storeAudioForNextOpening(audio, index)
    }
  } catch (error) {
    console.log('error inside select audio method.', error)
  }
}

// select another audio
export const playNext = async (playbackObj: Audio.Sound, uri: string) => {
  try {
    await playbackObj.stopAsync()
    await playbackObj.unloadAsync()
    return await play(playbackObj, uri)
  } catch (error) {
    console.log('error inside playNext helper method', error)
  }
}
