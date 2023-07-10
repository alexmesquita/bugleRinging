import React, { useState, useEffect } from 'react'

import { View, Pressable, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

import type { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV'
import type { Sound } from 'expo-av/build/Audio/Sound'

import { styles } from './styles'
import { useAssets } from 'expo-asset'

export function AudioPlayer() {
  const [audioFileUri, setAudioFileUri] = useState<string | null>(
    './assets/audio/two.mp3',
  )
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

  async function handleAudioPlay() {
    const source: AVPlaybackSource = { uri: assets[0].uri }

    const { sound } = await Audio.Sound.createAsync(source)
    console.log('carregou')
    await sound.setPositionAsync(0)
    await sound.playAsync()
  }

  return (
    <View>
      <Pressable style={styles.button}>
        <MaterialIcons
          name="play-arrow"
          size={44}
          color="#F2F"
          onPress={handleAudioPlay}
        />
      </Pressable>
      <Text>Tempo: </Text>
    </View>
  )
}
