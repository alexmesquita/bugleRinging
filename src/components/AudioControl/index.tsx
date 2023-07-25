import React, { PropsWithChildren } from 'react'
import { Pressable } from 'react-native'

import { Icon, Container } from './styles'

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
    <Container>
      <Pressable
        onPress={() => {
          skipToPrevious()
        }}
      >
        <Icon name="skip-previous" size={40} />
      </Pressable>
      <Pressable
        onPress={() => {
          playSound()
        }}
      >
        <Icon name={playing ? 'pause' : 'play-arrow'} size={75} />
      </Pressable>
      <Pressable
        onPress={() => {
          skipToNext()
        }}
      >
        <Icon name="skip-next" size={40} />
      </Pressable>
    </Container>
  )
}
