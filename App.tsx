/* eslint-disable camelcase */
import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import theme from './src/theme'

import { PlayListDetail } from './src/screens/PlayListDetail'
import { Loading } from './src/components/Loading'

export default function App() {
  const [fontsLoader] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        {fontsLoader ? <PlayListDetail /> : <Loading />}
      </View>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
