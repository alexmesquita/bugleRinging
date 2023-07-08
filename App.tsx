import React from 'react'

import { StyleSheet, View } from 'react-native'

import { RingingList } from './src/screens/RingingList'

export default function App() {
  return <View style={styles.container}></View>

  // return <RingingList />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
