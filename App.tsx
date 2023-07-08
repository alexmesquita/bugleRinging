import React, { useState } from 'react'

import { StyleSheet, View, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import {Audio} from 'expo-av'

import { RingingList } from './src/screens/RingingList'

export default function App() {
  const [audioFileUri, setAudioFileUri] = useState<string | null>(
    './assets/audio/two.mp3',
  )
  return (
    <View style={styles.container}>
      <Pressable>
        <MaterialIcons name="play-arrow" size={44} color="#F2F" />
      </Pressable>
    </View>
  )

  // return <RingingList />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
