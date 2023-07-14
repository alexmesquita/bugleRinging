import React, { useState, useEffect } from 'react'

import { View, Pressable, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

import type { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV'
import type { Sound } from 'expo-av/build/Audio/Sound'

import { styles } from './styles'
import { useAssets } from 'expo-asset'
import { AudioSlider } from '../AudioSlider'

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

  return (
    <View>
      <Pressable style={styles.button}>
        <MaterialIcons
          name={playing ? 'pause' : 'play-arrow'}
          size={44}
          color={playing ? '#F2F' : '#1ff'}
          onPress={playSound}
        />
      </Pressable>

      {loading && <Text>Carregando...</Text>}

      <AudioSlider
        sliderPositionMillis={sliderPositionMillis}
        durationMillis={durationMillis}
      />
    </View>
  )
}
