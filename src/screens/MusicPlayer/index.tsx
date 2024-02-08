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

type RouteParamsProps = {
  musicId: string
}

export function MusicPlayer() {
  const route = useRoute()
  const { musicId } = route.params as RouteParamsProps
  const [currentPosition, setCurrentPosition] = useState(0)

  const audioPlayerContext = useAudioPlayer()
  const { audioPlayer, setAudioPlayer } = audioPlayerContext

  const [playing, setPlay] = useState<boolean>(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  async function playAudio() {
    const index = audioPlayer.musicFiles.findIndex(({ id }) => id === musicId)
    const audio = audioPlayer.musicFiles[index]

    const newState = audioPlayer

    newState.currentAudio = audio
    newState.currentAudioIndex = index

    setAudioPlayer((audioPlayer: AudioPlayerDataProps) => ({
      ...audioPlayer,
      ...newState,
    }))
  }

  useEffect(() => {
    playAudio()
  }, [])

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
    return audioPlayer.playbackPosition ? audioPlayer.playbackPosition : 0
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        const { cleanAudioPlayer, audioPlayer } = audioPlayerContext
        cleanAudioPlayer(audioPlayer)
      }
    }, []),
  )
  const renderArtWork = () => {
    const artwork = audioPlayer.currentAudio.uriImg
    const { width } = Dimensions.get('window')
    return (
      <Center mx="-2">
        <Box w={width}>
          <Center>
            <Box w={80} h={80}>
              {artwork && (
                // aula 03-04-32
                <Image
                  source={{ uri: artwork?.toString() }}
                  alt="Album image"
                  h="100%"
                  rounded="md"
                />
              )}
            </Box>
          </Center>
        </Box>
      </Center>
    )
  }

  return (
    <Box flex={1} bg="background" px={2}>
      <Header showHomeButton={navigation.canGoBack()} />
      <FlatList
        horizontal
        data={audioPlayer.musicFiles}
        renderItem={renderArtWork}
        keyExtractor={(song) => song.id.toString()}
      />

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
    </Box>
  )
}
