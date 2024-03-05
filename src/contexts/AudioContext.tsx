import { AVPlaybackStatus, Audio } from 'expo-av'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { useToast } from 'native-base'
import { AudioDTO } from '../dtos/AudioDTO'
import { pause } from '../services/AudioController'
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
  currentAudio: AudioDTO
  isPlaying: boolean
  isPlayListRunning: boolean
  indexOnPlayList: number
  activePlayList: activePlayListProps
  currentAudioIndex: number | null
  audioType: string
}

export type AudiosDataPros = {
  audioFiles: Array<AudioDTO>
  musicFiles: Array<AudioDTO>
  beatFile: AudioDTO
  urisUpdated: boolean
}

export type AudioContextDataProps = {
  audioPlayer: AudioPlayerDataProps
  setAudioPlayer: (context: any) => void
  onPlaybackStatusUpdate: (playbackStatus: AVPlaybackStatus) => void
  cleanAudioPlayer: (audioPlayer: AudioPlayerDataProps) => void
  setOnMusicPlayer: (context: any) => void
  audiosData: AudiosDataPros
  playbackPosition: number | null
  setPlaybackPosition: (context: any) => void
}

type AudioContextProviderProps = {
  children: ReactNode
}

export const AudioContext = createContext<AudioContextDataProps>(
  {} as AudioContextDataProps,
)

export function AudioContextProvider({ children }: AudioContextProviderProps) {
  const [onMusicPlayer, setOnMusicPlayer] = useState<boolean>(false)
  const [playbackPosition, setPlaybackPosition] = useState<number>(0)

  const [audioPlayer, setAudioPlayer] = useState<AudioPlayerDataProps>({
    playbackObj: new Audio.Sound(),
    soundObj: null,
    currentAudio: {} as AudioDTO,
    isPlaying: false,
    isPlayListRunning: false,
    indexOnPlayList: -1,
    activePlayList: {} as activePlayListProps,
    currentAudioIndex: null,
    audioType: AudioType.BUGLE,
  })

  const [audiosData, setAudiosData] = useState<AudiosDataPros>({
    audioFiles: [] as Array<AudioDTO>,
    musicFiles: [] as Array<AudioDTO>,
    beatFile: {} as AudioDTO,
    urisUpdated: false,
  })

  const toast = useToast()

  async function updateAudiosUris() {
    try {
      if (audiosData.urisUpdated) return

      const buglesAssets = await Asset.loadAsync(buglesUrls)
      const musicsAssets = await Asset.loadAsync(urlsMusics)
      const beatAsset = await Asset.loadAsync(beat)
      const imgsAssets = await Asset.loadAsync(urlsImgs)

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

      setAudiosData({
        audioFiles: buglesData,
        musicFiles: musicsData,
        beatFile: { uriAudio: beatAsset[0].uri } as AudioDTO,
        urisUpdated: true,
      })
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

    setPlaybackPosition(0)

    const newState = audioPlayerToClean

    newState.playbackObj.unloadAsync()
    newState.soundObj = null
    newState.isPlaying = false
    newState.currentAudioIndex = 0

    setAudioPlayer((audioPlayerToClean) => ({
      ...audioPlayerToClean,
      ...newState,
    }))
  }

  async function onPlaybackStatusUpdate(playbackStatus: AVPlaybackStatus) {
    if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
      cleanAudioPlayer(audioPlayer)
      return
    }

    if (onMusicPlayer && playbackStatus.isLoaded && playbackStatus.isPlaying) {
      setPlaybackPosition(playbackStatus.positionMillis)
    }
  }

  useEffect(() => {
    updateAudiosUris()
  }, [])

  return (
    <>
      {audiosData.urisUpdated ? (
        <AudioContext.Provider
          value={{
            audioPlayer,
            setAudioPlayer,
            onPlaybackStatusUpdate,
            cleanAudioPlayer,
            audiosData,
            setOnMusicPlayer,
            playbackPosition,
            setPlaybackPosition,
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
