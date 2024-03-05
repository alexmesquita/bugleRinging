import React, { useState, useEffect, useCallback } from 'react'
import { Dimensions, FlatList } from 'react-native'

import { AudioInfo } from '../../components/AudioInfo'
import { AudioControl } from '../../components/AudioControl'
import { AudioSlider } from '../../components/AudioSlider'

import { Header } from '../../components/Header'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { Box, Center, Image, Text } from 'native-base'
import {
  changeAudio,
  moveAudio,
  pause,
  selectAudio,
} from '../../services/AudioController'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { AudioPlayerDataProps } from '../../contexts/AudioContext'
import { AudioType } from '../../@types/audioTypes'
import { Loading } from '../../components/Loading'

type RouteParamsProps = {
  musicId: string
}

export function MusicPlayer() {
  const route = useRoute()
  const { musicId } = route.params as RouteParamsProps
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isLoading, setIsloading] = useState(false)

  const audioPlayerContext = useAudioPlayer()
  const { audioPlayer, audiosData, setAudioPlayer, playbackPosition } =
    audioPlayerContext

  const [playing, setPlay] = useState<boolean>(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { width } = Dimensions.get('window')

  async function playAudio() {
    setIsloading(true)
    const index = audiosData.musicFiles.findIndex(({ id }) => id === musicId)
    const audio = audiosData.musicFiles[index]

    const newState = audioPlayer

    newState.currentAudio = audio
    newState.currentAudioIndex = index

    setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
      ...audioPlayer,
      ...newState,
    }))
    setIsloading(false)
  }

  async function handlePlayPause() {
    await selectAudio(audioPlayer.currentAudio, audioPlayerContext)
    setPlay(audioPlayer.isPlaying)
  }

  async function handleNext() {
    await changeAudio(audioPlayerContext, 'next')
  }
  async function handlePrevious() {
    await changeAudio(audioPlayerContext, 'previous')
  }

  function calculateSliderPositionMillis() {
    return playbackPosition != null ? playbackPosition : 0
  }
  async function onSlidingStart() {
    if (!audioPlayer.isPlaying) return

    try {
      await pause(audioPlayer.playbackObj)
    } catch (error) {
      console.log('error inside onSlidingStart callback', error)
    }
  }

  async function setTrackPosition(positionMillis: number) {
    if (audioPlayer.isPlaying && audioPlayer.playbackObj) {
      await audioPlayer.playbackObj.setPositionAsync(Math.trunc(positionMillis))
      setCurrentPosition(positionMillis)
    }
  }

  async function onSlidingComplete(value: number) {
    await moveAudio(audioPlayerContext, value)
    setCurrentPosition(0)
  }

  useEffect(() => {
    playAudio()
  }, [])

  useFocusEffect(
    useCallback(() => {
      audioPlayerContext.setOnMusicPlayer(true)

      const newState = audioPlayerContext.audioPlayer

      newState.audioType = AudioType.MUSIC

      audioPlayerContext.setAudioPlayer(
        (audioPlayer: AudioPlayerDataProps) => ({
          ...audioPlayer,
          ...newState,
        }),
      )

      return () => {
        const { cleanAudioPlayer, audioPlayer, setOnMusicPlayer } =
          audioPlayerContext
        cleanAudioPlayer(audioPlayer)
        setOnMusicPlayer(false)
      }
    }, []),
  )

  return (
    <Box flex={1} bg="background" px={2}>
      <Header showHomeButton={navigation.canGoBack()} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Center mx="-2">
            <Box w={width}>
              <Center>
                <Box w={80} h={80}>
                  <Image
                    source={{
                      uri: audioPlayer.currentAudio.uriImg?.toString(),
                    }}
                    alt="Album image"
                    h="100%"
                    rounded="md"
                  />
                </Box>
              </Center>
            </Box>
          </Center>

          <AudioInfo
            artist={audioPlayer.currentAudio.artist}
            title={audioPlayer.currentAudio.name}
          />
          <AudioSlider
            calculateSliderPositionMillis={calculateSliderPositionMillis}
            durationMillis={audioPlayer.currentAudio.duration}
            onSliderChange={setTrackPosition}
            onSlidingStart={onSlidingStart}
            onSlidingComplete={onSlidingComplete}
          />
          <AudioControl
            playPause={handlePlayPause}
            playing={playing}
            skipToNext={handleNext}
            skipToPrevious={handlePrevious}
          />
        </>
      )}
    </Box>
  )
}
