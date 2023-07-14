import React from 'react'

import { StyleSheet, View } from 'react-native'

// import { RingingList } from './src/screens/RingingList'
import { AudioPlayer } from './src/screens/AudioPlayer'

export default function App() {
  return (
    <View style={styles.container}>
      <AudioPlayer />
    </View>
  )

  // return <RingingList />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
