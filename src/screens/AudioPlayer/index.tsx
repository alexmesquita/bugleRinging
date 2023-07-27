import React, { useState, useEffect } from 'react'
import { FlatList, Text } from 'react-native'
import { useAssets } from 'expo-asset'

import { Audio } from 'expo-av'
import type { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV'
import type { Sound } from 'expo-av/build/Audio/Sound'

import { AudioInfo } from '../../components/AudioInfo'
import { AudioControl } from '../../components/AudioControl'
import { AudioSlider } from '../../components/AudioSlider'

import {
  Container,
  ListArtWrapper,
  AlbumContainer,
  AlbumArtImg,
} from './styles'

import { playListData } from '../../audiosInfos'
import { playListUrl } from '../../audiosUrl'
import { Header } from '../../components/Header'
import { Button } from '../../components/Button'

export function AudioPlayer() {
  const [sound, setSound] = useState<Sound>()
  const [playing, setPlay] = useState(false)
  const [loading, setLoading] = useState(false)
  const [durationMillis, setDurationMillis] = useState(1)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [sliderPositionMillis, setSliderPositionMillis] = useState(0)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [assets, error] = useAssets(playListUrl)

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.isPlaying && !isDraggingSlider) {
        setSliderPositionMillis(status.positionMillis)
      }
    }
  }

  const setOnPlaybackStatusUpdate = () => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  async function loadAudio(source: AVPlaybackSource) {
    setLoading(true)

    const { sound: soundCreated, status } = await Audio.Sound.createAsync(
      source,
    )
    setSound(soundCreated)
    setLoading(false)
    setOnPlaybackStatusUpdate()

    if (status.isLoaded && status.durationMillis) {
      setDurationMillis(status.durationMillis)
    }

    soundCreated.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

    await soundCreated.playAsync()
    setPlay(true)
  }

  async function playSound() {
    if (sound && playing) {
      await sound.pauseAsync()
      setPlay(false)
      return
    }

    if (sound && !playing) {
      await sound.playAsync()
      setPlay(true)
      return
    }

    const uri = assets ? assets[currentAudioIndex].uri : ''

    await loadAudio({ uri })
  }

  async function skipToNext() {
    console.log('indo pra próxima')
    // if (currentAudioIndex + 1 >= playListUrl.length) {
    //   console.log('Não tem mais')
    //   return
    // }
    // await playSound()
    // await sound.unloadAsync()
    // setCurrentAudioIndex(currentAudioIndex + 1)
    // playSound()
  }
  async function skipToPrevious() {}

  const setTrackPosition = async (positionMillis: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMillis)
    }
  }

  const onSlidingComplete = () => {
    if (currentAudioIndex + 1 >= playListUrl.length) {
      setTrackPosition(0)
      playSound()
    } else {
      skipToNext()
    }
  }

  const onSliderChange = (value: number) => {
    if (!isDraggingSlider) {
      setIsDraggingSlider(true)
    }
    setTrackPosition(value)
  }

  const renderArtWork = () => {
    const artwork = playListData[currentAudioIndex].artwork
    return (
      <ListArtWrapper>
        <AlbumContainer>
          {artwork && (
            <AlbumArtImg
              source={{ uri: artwork?.toString() }}
              alt="Album image"
            />
          )}
        </AlbumContainer>
      </ListArtWrapper>
    )
  }

  return (
    <Container>
      <Header showBackButton />
      <FlatList
        horizontal
        data={playListData}
        renderItem={renderArtWork}
        keyExtractor={(song) => song.id.toString()}
      />

      {loading && <Text>Carregando...</Text>}

      <AudioInfo
        album={playListData[currentAudioIndex].album}
        artist={playListData[currentAudioIndex].artist}
        title={playListData[currentAudioIndex].title}
      />
      <AudioSlider
        sliderPositionMillis={sliderPositionMillis}
        durationMillis={durationMillis}
        onSliderChange={onSliderChange}
        onSlidingComplete={onSlidingComplete}
      />
      <AudioControl
        playSound={playSound}
        playing={playing}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
      />
      {/* <Button title="Salvar Playlist" type="SECONDARY" /> */}
    </Container>
  )
}
