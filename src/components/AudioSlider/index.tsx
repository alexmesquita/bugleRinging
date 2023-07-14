import Slider from '@react-native-community/slider'
import React from 'react'
import { View, Text } from 'react-native'

import { styles } from './styles'

interface SliderProps {
  sliderPositionMillis: number
  durationMillis: number
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
          {new Date(sliderPositionMillis * 1000)
            .toISOString()
            .substring(15, 19)}
        </Text>
        <Text style={styles.time}>
          {new Date((durationMillis - sliderPositionMillis) * 1000)
            .toISOString()
            .substring(15, 19)}
        </Text>

        <Text>
          Tempo: {sliderPositionMillis} - {durationMillis}{' '}
        </Text>
      </View>
    </View>
  )
}
