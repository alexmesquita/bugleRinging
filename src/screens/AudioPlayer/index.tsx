import React, { useState, useEffect } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { useAssets } from 'expo-asset'

import { Audio } from 'expo-av'
import type { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV'
import type { Sound } from 'expo-av/build/Audio/Sound'

import { AudioInfo } from '../../components/AudioInfo'
import { AudioControl } from '../../components/AudioControl'
import { AudioSlider } from '../../components/AudioSlider'

import { styles } from './styles'

import { playListData } from '../../constants'

export function AudioPlayer() {
  const [sound, setSound] = useState<Sound>()
  const [playing, setPlay] = useState(false)
  const [loading, setLoading] = useState(false)
  const [durationMillis, setDurationMillis] = useState(1)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [sliderPositionMillis, setSliderPositionMillis] = useState(0)
  const [assets, error] = useAssets([require('../../../assets/audio/one.mp3')])

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
          console.log('UNLOAD SOUND....')
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

    const uri = assets ? assets[0].uri : ''

    await loadAudio({ uri })
  }

  async function skipToNext() {}
  async function skipToPrevious() {}

  const setTrackPosition = async (positionMillis: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMillis)
    }
  }

  const onSlidingComplete = (sliderValue: number) => {
    if (isDraggingSlider) {
      setIsDraggingSlider(false)
    }
    setTrackPosition(sliderValue)
  }

  const onSliderChange = () => {
    if (!isDraggingSlider) {
      setIsDraggingSlider(true)
    }
  }

  const renderArtWork = () => {
    const artwork =
      'https://c.saavncdn.com/734/Champagne-Talk-Hindi-2022-20221008011951-500x500.jpg'
    return (
      <View style={styles.listArtWrapper}>
        <View style={styles.albumContainer}>
          {artwork && (
            <Image
              style={styles.albumArtImg}
              source={{ uri: artwork?.toString() }}
              alt="Album image"
            />
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={playListData}
        renderItem={renderArtWork}
        keyExtractor={(song) => song.id.toString()}
      />

      {loading && <Text>Carregando...</Text>}

      <AudioInfo album="album info" artist="Jamile" title="Mil e uma noites" />
      <AudioSlider
        sliderPositionMillis={sliderPositionMillis}
        durationMillis={durationMillis}
      />
      <AudioControl
        playSound={playSound}
        playing={playing}
        skipToNext={skipToNext}
        skipToPrevious={skipToPrevious}
      />
    </View>
  )
}
