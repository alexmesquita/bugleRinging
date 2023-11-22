import { Audio } from 'expo-av'
import { AudioDTO } from '../dtos/AudioDTO'
import {
  AudioContextDataProps,
  AudioPlayerDataProps,
  activePlayListProps,
} from '../contexts/AudioContext'
import { getAudioIdByPlaylist } from '../storage/audio/getAudioByPlaylist'
import { Dispatch, SetStateAction } from 'react'
import { AudioType } from '../@types/audioTypes'
import { storageAudioInPlaylistProps } from '../storage/audio/audioCreateByPlaylist'

type playListInfoProps = {
  activePlayList: activePlayListProps
  isPlayListRunning: Boolean
  indexOnPlayList: number
}

const UPDATE_TIME_IN_MILLIS = 1000

export function getAudiosByIds(
  bugleFiles: AudioDTO[],
  musicFiles: AudioDTO[],
  audiosStoreged: storageAudioInPlaylistProps[],
) {
  const filteredAudios: AudioDTO[] = []
  audiosStoreged.forEach((item) => {
    if (item.audioType === AudioType.BUGLE) {
      const audioDTO = bugleFiles.find((audio) => audio.id === item.id)
      if (audioDTO) filteredAudios.push(audioDTO)
    } else if (item.audioType === AudioType.MUSIC) {
      const audioDTO = musicFiles.find((audio) => audio.id === item.id)
      if (audioDTO) filteredAudios.push(audioDTO)
    }
  })

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

    const audiosStored: storageAudioInPlaylistProps[] =
      await getAudioIdByPlaylist(playListToSearch)
    audiosPlaylist = getAudiosByIds(
      audioPlayerContext.audioPlayer.audioFiles,
      audioPlayerContext.audioPlayer.musicFiles,
      audiosStored,
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
        {
          shouldPlay: true,
          progressUpdateIntervalMillis: UPDATE_TIME_IN_MILLIS,
        },
      )

    // but if there is lastPosition then we will play audio from the lastPosition
    await playbackObj.loadAsync(
      { uri },
      { progressUpdateIntervalMillis: UPDATE_TIME_IN_MILLIS },
    )

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
export async function resume(playbackObj: Audio.Sound) {
  try {
    return await playbackObj.playAsync()
  } catch (error) {
    console.log('error inside resume helper method', error)
  }
}

// select another audio
export async function playNext(playbackObj: Audio.Sound, uri: string) {
  try {
    await playbackObj.stopAsync()
    await playbackObj.unloadAsync()
    return await play(playbackObj, uri)
  } catch (error) {
    console.log('error inside playNext helper method', error)
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
      const status = await play(audioPlayer.playbackObj, audio.uriAudio)
      const index =
        audio.type === AudioType.BUGLE
          ? audioPlayer.audioFiles.findIndex(({ id }) => id === audio.id)
          : audioPlayer.musicFiles.findIndex(({ id }) => id === audio.id)

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
      newState.indexOnPlayList =
        playListInfo && playListInfo.isPlayListRunning
          ? playListInfo.indexOnPlayList
          : 0

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
      const status = await playNext(audioPlayer.playbackObj, audio.uriAudio)
      const index =
        audio.type === AudioType.BUGLE
          ? audioPlayer.audioFiles.findIndex(({ id }) => id === audio.id)
          : audioPlayer.musicFiles.findIndex(({ id }) => id === audio.id)
      const newState = audioPlayer

      newState.currentAudio = audio
      newState.soundObj = status
      newState.isPlaying = true
      newState.currentAudioIndex = index
      newState.isPlayListRunning = false
      newState.indexOnPlayList = -1
      newState.activePlayList = {} as activePlayListProps
      newState.activePlayList =
        playListInfo && playListInfo.activePlayList
          ? playListInfo.activePlayList
          : ({} as activePlayListProps)
      newState.isPlayListRunning =
        playListInfo && playListInfo.isPlayListRunning
          ? playListInfo.isPlayListRunning
          : false
      newState.indexOnPlayList =
        playListInfo && playListInfo.isPlayListRunning
          ? playListInfo.indexOnPlayList
          : 0

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

async function selectAudioFromPlayList(
  audioPlayerContext: AudioContextDataProps,
  selectedButton: string,
) {
  const { audioPlayer, setAudioPlayer } = audioPlayerContext
  const { activePlayList, currentAudio, audioFiles, musicFiles, playbackObj } =
    audioPlayer
  let defaultIndex = 0
  let nextIndex = 0

  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id,
  )

  if (selectedButton === 'next') {
    nextIndex = indexOnPlayList + 1
    defaultIndex = 0
  } else if (selectedButton === 'previous') {
    nextIndex = indexOnPlayList - 1
    defaultIndex = activePlayList.audios.length - 1
  }
  let audio = activePlayList.audios[nextIndex]

  if (!audio) audio = activePlayList.audios[defaultIndex]

  const indexOnAllList =
    audio.type === AudioType.BUGLE
      ? audioPlayer.audioFiles.findIndex(({ id }) => id === audio.id)
      : audioPlayer.musicFiles.findIndex(({ id }) => id === audio.id)

  const status = await playNext(playbackObj, audio.uriAudio)

  const newState = audioPlayer
  newState.currentAudio = audio
  newState.soundObj = status
  newState.isPlaying = true
  newState.currentAudioIndex = indexOnAllList
  setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
    ...audioPlayer,
    ...newState,
  }))
}

export async function changeAudio(
  audioPlayerContext: AudioContextDataProps,
  selectedButton: string,
) {
  const { audioPlayer, setAudioPlayer, onPlaybackStatusUpdate } =
    audioPlayerContext
  const { playbackObj, audioFiles, musicFiles, isPlayListRunning } = audioPlayer
  let { currentAudioIndex } = audioPlayer
  currentAudioIndex = currentAudioIndex === null ? 0 : currentAudioIndex

  if (isPlayListRunning)
    return selectAudioFromPlayList(audioPlayerContext, selectedButton)

  try {
    const { isLoaded } = await playbackObj.getStatusAsync()
    const isLastAudio =
      currentAudioIndex + 1 ===
      (audioPlayer.audioType === AudioType.BUGLE
        ? audioFiles.length
        : musicFiles.length)

    const isFirstAudio = currentAudioIndex <= 0
    let audio = audioPlayer.currentAudio
    let index = audioPlayer.currentAudioIndex
    let status

    // for next
    if (selectedButton === 'next') {
      audio =
        audioPlayer.audioType === AudioType.BUGLE
          ? audioFiles[currentAudioIndex + 1]
          : musicFiles[currentAudioIndex + 1]
      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1
        status = await play(playbackObj, audio.uriAudio)
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
      }

      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1
        status = await playNext(playbackObj, audio.uriAudio)
      }

      if (isLastAudio) {
        index = 0
        audio =
          audioPlayer.audioType === AudioType.BUGLE
            ? audioFiles[index]
            : musicFiles[index]
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uriAudio)
        } else {
          status = await play(playbackObj, audio.uriAudio)
        }
      }
    }

    // for previous
    if (selectedButton === 'previous') {
      audio =
        audioPlayer.audioType === AudioType.BUGLE
          ? audioFiles[currentAudioIndex - 1]
          : musicFiles[currentAudioIndex - 1]
      if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1
        status = await play(playbackObj, audio.uriAudio)
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
      }

      if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1
        status = await playNext(playbackObj, audio.uriAudio)
      }

      if (isFirstAudio) {
        if (audioPlayer.audioType === AudioType.BUGLE) {
          index = audioFiles.length - 1
          audio = audioFiles[index]
        } else {
          index = musicFiles.length - 1
          audio = musicFiles[index]
        }
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uriAudio)
        } else {
          status = await play(playbackObj, audio.uriAudio)
        }
      }
    }

    const newState = audioPlayer
    newState.currentAudio = audio
    newState.soundObj = status
    newState.isPlaying = true
    newState.currentAudioIndex = index
    newState.playbackPosition = null
    newState.playbackDuration = null
    setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
      ...audioPlayer,
      ...newState,
    }))
    // storeAudioForNextOpening(audio, index)
  } catch (error) {
    console.log('error inside cahnge audio method.', error)
  }
}

export async function moveAudio(
  audioPlayerContext: AudioContextDataProps,
  value: number,
) {
  const { audioPlayer, setAudioPlayer } = audioPlayerContext
  const { soundObj, isPlaying, playbackObj } = audioPlayer
  if (soundObj === null || soundObj === undefined || !isPlaying) return

  try {
    if (soundObj !== null && soundObj.isLoaded && soundObj.isPlaying) {
      const position = soundObj.durationMillis
        ? Math.floor(soundObj.durationMillis * value)
        : 0
      const status = await playbackObj.setPositionAsync(position)

      const updatedPosition =
        status.isLoaded && status.isPlaying ? status.positionMillis : 0
      const newState = audioPlayer
      newState.soundObj = status
      newState.playbackPosition = updatedPosition
      setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
        ...audioPlayer,
        ...newState,
      }))

      await resume(playbackObj)
    }
  } catch (error) {
    console.log('error inside onSlidingComplete callback', error)
  }
}
