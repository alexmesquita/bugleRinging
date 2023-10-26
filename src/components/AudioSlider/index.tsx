import React, { PropsWithChildren } from 'react'
import Slider from '@react-native-community/slider'

import { millisToMinutesAndSeconds } from '../../utils/dateTime'
import { Box, HStack, Text, useTheme } from 'native-base'

type SliderProps = PropsWithChildren<{
  durationMillis: number
  calculateSliderPositionMillis: () => number
  onSliderChange: Function
  onSlidingStart: Function
  onSlidingComplete: Function
}>

export function AudioSlider({
  durationMillis,
  calculateSliderPositionMillis,
  onSliderChange,
  onSlidingStart,
  onSlidingComplete,
}: SliderProps) {
  const { colors } = useTheme()

  return (
    <Box mt="6" mx="1">
      <Slider
        value={calculateSliderPositionMillis()}
        minimumValue={0}
        maximumValue={durationMillis}
        onValueChange={(value) => {
          onSliderChange(value * durationMillis)
          console.log("changed: " + value)
        }}
        onSlidingComplete={(value) => onSlidingComplete(value)}
        onSlidingStart={async () => {
          onSlidingStart()
        }}
        thumbTintColor={colors.orange[700]}
        maximumTrackTintColor={colors.orange[300]}
        minimumTrackTintColor={colors.orange[700]}
        //   width: 350px;
      />
      <HStack justifyContent="space-between">
        {/* //   width: 340px; */}
        <Text color="orange.200">
          {millisToMinutesAndSeconds(calculateSliderPositionMillis())}
        </Text>
        <Text color="orange.200">
          {millisToMinutesAndSeconds(durationMillis)}
        </Text>
      </HStack>
    </Box>
  )
}
