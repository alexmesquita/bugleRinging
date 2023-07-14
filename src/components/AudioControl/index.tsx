import React, { PropsWithChildren } from 'react'
import { View, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { styles } from './styles'

type AudioControlProps = PropsWithChildren<{
  playing: boolean
  playSound: Function
  skipToNext: Function
  skipToPrevious: Function
}>

export function AudioControl({
  playing,
  playSound,
  skipToNext,
  skipToPrevious,
}: AudioControlProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          skipToPrevious()
        }}
      >
        <MaterialIcons style={styles.icon} name="skip-previous" size={40} />
      </Pressable>
      <Pressable
        onPress={() => {
          playSound()
        }}
      >
        <MaterialIcons
          name={playing ? 'pause' : 'play-arrow'}
          size={75}
          style={styles.icon}
          color={playing ? '#F2F' : '#1ff'}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          skipToNext()
        }}
      >
        <MaterialIcons style={styles.icon} name="skip-next" size={40} />
      </Pressable>
    </View>
  )
}
