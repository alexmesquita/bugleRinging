import { AVPlaybackStatus, Audio } from 'expo-av'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { useToast } from 'native-base'
import { AudioDTO } from '../dtos/AudioDTO'
import { pause, playNext } from '../services/AudioController'
import { AudioType } from '../@types/audioTypes'
import { Asset } from 'expo-asset'
import { buglesUrls } from '../storage/audiosInfos/bugles/urls'
import { buglesData } from '../storage/audiosInfos/bugles/infos'
import { musicsData } from '../storage/audiosInfos/musics/infos'
import { urlsMusics } from '../storage/audiosInfos/musics/urlsMusics'
import { urlsImgs } from '../storage/audiosInfos/musics/urlsImgs'
import { Loading } from '../components/Loading'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const beat = require('../../assets/audios/bugles/beat.mp3')

export type activePlayListProps = {
  name: string
  audios: Array<AudioDTO>
}

export type AudioPlayerDataProps = {
  playbackObj: Audio.Sound
  soundObj: AVPlaybackStatus | null | undefined
  audioFiles: Array<AudioDTO>
  musicFiles: Array<AudioDTO>
  beatFile: AudioDTO
  currentAudio: AudioDTO
  isPlaying: boolean
  isPlayNext: boolean
  isPlayListRunning: boolean
  indexOnPlayList: number
  activePlayList: activePlayListProps
  currentAudioIndex: number | null
  playbackPosition: number | null
  playbackDuration: number | null | undefined
  audioType: string
  urisUpdated: boolean
}
export type AudioContextDataProps = {
  audioPlayer: AudioPlayerDataProps
  setAudioPlayer: (context: any) => void
  onPlaybackStatusUpdate: (playbackStatus: AVPlaybackStatus) => void
  cleanAudioPlayer: (audioPlayer: AudioPlayerDataProps) => void
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
    beatFile: {} as AudioDTO,
    currentAudio: {} as AudioDTO,
    isPlaying: false,
    isPlayNext: false,
    isPlayListRunning: false,
    indexOnPlayList: -1,
    activePlayList: {} as activePlayListProps,
    currentAudioIndex: null,
    playbackPosition: null,
    playbackDuration: null,
    audioType: AudioType.BUGLE,
    urisUpdated: false,
  })

  const toast = useToast()

  async function updateAudiosUris() {
    try {
      console.log('As Uris foram atualizadas?')
      console.log(audioPlayer.urisUpdated)
      if (audioPlayer.urisUpdated) return

      const buglesAssets = await Asset.loadAsync(buglesUrls)
      console.log('loaded bugle')
      const musicsAssets = await Asset.loadAsync(urlsMusics)
      console.log('loaded musics')
      const beatAsset = await Asset.loadAsync(beat)
      console.log('loaded beat')
      const imgsAssets = await Asset.loadAsync(urlsImgs)
      console.log('loaded images')

      if (buglesAssets && buglesAssets.length === buglesData.length) {
        buglesData.forEach((value, index) => {
          value.uriAudio = buglesAssets[index].uri
        })
      }

      if (musicsAssets && musicsAssets.length === musicsData.length) {
        musicsData.forEach((value, index) => {
          value.uriAudio = musicsAssets[index].uri
        })
      }

      if (imgsAssets && imgsAssets.length === musicsData.length) {
        musicsData.forEach((value, index) => {
          value.uriImg = imgsAssets[index].uri
        })
      }
      const newState = audioPlayer

      newState.audioFiles = buglesData
      newState.musicFiles = musicsData
      newState.beatFile = { uriAudio: beatAsset[0].uri } as AudioDTO
      newState.urisUpdated = true

      setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
        ...audioPlayer,
        ...newState,
      }))
      console.log('As Uris foram atualizadas no final?')
      console.log(audioPlayer.urisUpdated)
    } catch (error) {
      toast.show({
        title: 'Não foi possível buscar os áudios.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
    }
  }

  async function cleanAudioPlayer(audioPlayerToClean: AudioPlayerDataProps) {
    if (
      audioPlayerToClean.isPlaying &&
      audioPlayerToClean.soundObj &&
      audioPlayerToClean.soundObj.isLoaded
    ) {
      await pause(audioPlayerToClean.playbackObj)
    }

    const newState = audioPlayerToClean

    newState.playbackObj.unloadAsync()
    newState.soundObj = null
    newState.isPlaying = false
    newState.currentAudioIndex = 0
    newState.playbackPosition = null
    newState.playbackDuration = null

    setAudioPlayer((audioPlayerToClean) => ({
      ...audioPlayerToClean,
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
      if (audioPlayer.isPlayNext && audioPlayer.isPlayListRunning) {
        const indexOnPlayList = audioPlayer.activePlayList.audios.findIndex(
          ({ id }) => id === audioPlayer.currentAudio.id,
        )
        const nextIndex = indexOnPlayList + 1
        const nextAudio = audioPlayer.activePlayList.audios[nextIndex]

        if (!nextAudio) {
          cleanAudioPlayer(audioPlayer)
          return
        }

        const indexOnAllList =
          nextAudio.type === AudioType.BUGLE
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
          (audioPlayer.audioType === AudioType.BUGLE
            ? audioPlayer.audioFiles.length
            : audioPlayer.musicFiles.length)
      ) {
        cleanAudioPlayer(audioPlayer)
        return
        // TODO verificar se será preciso usar a função: storeAudioForNextOpening, tem em outros arquivos
        // return await storeAudioForNextOpening(audioFiles[0], 0)
      }
      // otherwise we want to select the next audio
      const audio =
        audioPlayer.audioType === AudioType.BUGLE
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

  useEffect(() => {
    updateAudiosUris()
  }, [])

  return (
    <>
      {audioPlayer.urisUpdated ? (
        <AudioContext.Provider
          value={{
            audioPlayer,
            setAudioPlayer,
            onPlaybackStatusUpdate,
            cleanAudioPlayer,
          }}
        >
          {children}
        </AudioContext.Provider>
      ) : (
        <Loading />
      )}
    </>
  )
}
