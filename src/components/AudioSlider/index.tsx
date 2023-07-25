import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

import { SliderContainer, Time, TimeContainer } from './styles'

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
      <SliderContainer
        value={sliderPositionMillis}
        minimumValue={0}
        maximumValue={durationMillis}
        thumbTintColor="#30F"
        maximumTrackTintColor="#FF0"
      />
      <TimeContainer>
        <Time>{millisToMinutesAndSeconds(sliderPositionMillis)}</Time>
        <Time>
          {millisToMinutesAndSeconds(durationMillis - sliderPositionMillis)}
        </Time>
      </TimeContainer>
    </View>
  )
}
