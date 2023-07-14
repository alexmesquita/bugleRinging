import Slider from '@react-native-community/slider'
import React, { PropsWithChildren } from 'react'
import { View, Text } from 'react-native'

import { styles } from './styles'

type SliderProps = PropsWithChildren<{
  sliderPositionMillis: number
  durationMillis: number
}>

function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000)
  const seconds = Math.trunc((millis % 60000) / 1000)
  return (
    (minutes < 10 ? '0' : '') +
    minutes +
    ':' +
    (seconds < 10 ? '0' : '') +
    seconds
  )
}

export function AudioSlider({
  sliderPositionMillis,
  durationMillis,
}: SliderProps) {
  return (
    <View>
      <Slider
        value={sliderPositionMillis}
        minimumValue={0}
        maximumValue={durationMillis}
        thumbTintColor="#3FF"
        maximumTrackTintColor="#F3F"
        style={styles.sliderContainer}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {millisToMinutesAndSeconds(sliderPositionMillis)}
        </Text>
        <Text style={styles.time}>
          {millisToMinutesAndSeconds(durationMillis - sliderPositionMillis)}
        </Text>
      </View>
    </View>
  )
}
