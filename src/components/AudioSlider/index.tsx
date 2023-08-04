import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

import { SliderContainer, Time, TimeContainer } from './styles'
import { millisToMinutesAndSeconds } from '../../utils/dateTime'

type SliderProps = PropsWithChildren<{
  sliderPositionMillis: number
  durationMillis: number
  onSliderChange: Function
  onSlidingComplete: Function
}>

export function AudioSlider({
  sliderPositionMillis,
  durationMillis,
  onSliderChange,
  onSlidingComplete,
}: SliderProps) {
  return (
    <View>
      <SliderContainer
        value={sliderPositionMillis}
        minimumValue={0}
        maximumValue={durationMillis}
        onValueChange={(value) => {
          onSliderChange(value)
        }}
        onSlidingComplete={() => onSlidingComplete()}
      />
      <TimeContainer>
        <Time>{millisToMinutesAndSeconds(sliderPositionMillis)}</Time>
        <Time>{millisToMinutesAndSeconds(durationMillis)}</Time>
      </TimeContainer>
    </View>
  )
}
