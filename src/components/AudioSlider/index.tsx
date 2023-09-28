import React, { PropsWithChildren } from 'react'
import Slider from '@react-native-community/slider'

import { millisToMinutesAndSeconds } from '../../utils/dateTime'
import { Box, HStack, Text, useTheme } from 'native-base'

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
  const { colors } = useTheme()

  return (
    <Box mt="6" mx="1">
      <Slider
        value={sliderPositionMillis}
        minimumValue={0}
        maximumValue={durationMillis}
        onValueChange={(value) => {
          onSliderChange(value)
        }}
        onSlidingComplete={() => onSlidingComplete()}
        thumbTintColor={colors.orange[700]}
        maximumTrackTintColor={colors.orange[300]}
        minimumTrackTintColor={colors.orange[700]}
        //   width: 350px;
      />
      <HStack justifyContent="space-between">
        {/* //   width: 340px; */}
        <Text color="orange.200">
          {millisToMinutesAndSeconds(sliderPositionMillis)}
        </Text>
        <Text color="orange.200">
          {millisToMinutesAndSeconds(durationMillis)}
        </Text>
      </HStack>
    </Box>
  )
}
