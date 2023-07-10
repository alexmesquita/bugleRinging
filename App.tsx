import React, { useState, useEffect } from 'react'

import { StyleSheet, View, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

import { RingingList } from './src/screens/RingingList'

export default function App() {
  const [audioFileUri, setAudioFileUri] = useState<string | null>(
    './assets/audio/two.mp3',
  )

  async function handleAudioPlay() {
    console.log('ENTROU')
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
      },
      { shouldPlay: true },
    )
    console.log('carregou')
    await sound.setPositionAsync(0)
    await sound.playAsync()
  }
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
  })
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <MaterialIcons
          name="play-arrow"
          size={44}
          color="#F2F"
          onPress={handleAudioPlay}
        />
      </Pressable>
    </View>
  )

  // return <RingingList />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
