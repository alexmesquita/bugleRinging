import React, { useState, useEffect } from 'react'

import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'

import TrackPlayer from 'react-native-track-player'
import {
  playbackService,
  setupPlayer,
  addTrack,
} from './src/services/musicPlayerServices'

import { RingingList } from './src/screens/RingingList'
import MusicPlayer from './src/screens/MusicPlayer'

export default function App() {
  const [isPlayerReady, setIsPaylerReady] = useState(false)

  async function setup() {
    const isSetup = await setupPlayer()

    if (isSetup) {
      await addTrack()
    }

    setIsPaylerReady(isSetup)
  }

  useEffect(() => {
    setup()
  }, [])

  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <MusicPlayer />
    </View>
  )

  // return <RingingList />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

TrackPlayer.registerPlaybackService(() => playbackService)
