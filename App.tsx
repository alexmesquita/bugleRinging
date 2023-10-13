/* eslint-disable camelcase */
import React from 'react'
import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { THEME } from './src/theme'
import { Loading } from './src/components/Loading'
import { Routes } from './src/routes'
import { AudioContextProvider } from './src/contexts/AudioContext'

export default function App() {
  const [fontsLoader] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <ThemeProvider theme={THEME}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <AudioContextProvider>
          {fontsLoader ? <Routes /> : <Loading />}
        </AudioContextProvider>
      </ThemeProvider>
    </NativeBaseProvider>
  )
}
