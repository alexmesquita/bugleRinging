import React, { useState, useEffect } from 'react'
import { Dimensions, FlatList } from 'react-native'

import type { Sound } from 'expo-av/build/Audio/Sound'

import { AudioInfo } from '../../components/AudioInfo'
import { AudioControl } from '../../components/AudioControl'
import { AudioSlider } from '../../components/AudioSlider'

import { Header } from '../../components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'
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

  const [playing, setPlay] = useState<Boolean>(false)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  // const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  //   if (status.isLoaded) {
  //     if (status.isPlaying && !isDraggingSlider) {
  //       setSliderPositionMillis(status.positionMillis)
  //     }
  //   }
  // }

  // const setOnPlaybackStatusUpdate = () => {
  //   if (sound) {
  //     sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
  //   }
  // }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         sound.unloadAsync()
  //       }
  //     : undefined
  // }, [sound])

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
    // audioPlayerContext.loadPreviousAudio()
    playAudio()
  }, [])

  // async function loadAudio(source: AVPlaybackSource) {
  //   setLoading(true)

  //   const { sound: soundCreated, status } = await Audio.Sound.createAsync(
  //     source,
  //   )
  //   setSound(soundCreated)
  //   setLoading(false)
  //   setOnPlaybackStatusUpdate()

  //   if (status.isLoaded && status.durationMillis) {
  //     setDurationMillis(status.durationMillis)
  //   }

  //   soundCreated.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

  //   await soundCreated.playAsync()
  //   setPlay(true)
  // }

  // async function playSound() {
  //   if (sound && playing) {
  //     await sound.pauseAsync()
  //     setPlay(false)
  //     return
  //   }

  //   if (sound && !playing) {
  //     await sound.playAsync()
  //     setPlay(true)
  //     return
  //   }

  //   const uri = assets ? assets[currentAudioIndex].uri : ''

  //   await loadAudio({ uri })
  // }

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

  // const setTrackPosition = async (positionMillis: number) => {
  //   if (sound) {
  //     await sound.setPositionAsync(positionMillis)
  //   }
  // }

  // const onSlidingComplete = () => {
  //   if (currentAudioIndex + 1 >= playListUrl.length) {
  //     setTrackPosition(0)
  //     playSound()
  //   } else {
  //     skipToNext()
  //   }
  // }

  // const onSliderChange = (value: number) => {
  //   if (!isDraggingSlider) {
  //     setIsDraggingSlider(true)
  //   }
  //   setTrackPosition(value)
  // }

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
      <Header showBackButton={navigation.canGoBack()} />
      <FlatList
        horizontal
        data={audioPlayer.musicFiles}
        renderItem={renderArtWork}
        keyExtractor={(song) => song.id.toString()}
      />

      {loading && <Text>Carregando...</Text>}

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
