import React, { PropsWithChildren } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import { Box, Center, HStack } from 'native-base'
import { IconButton } from '../IconButton'

type AudioControlProps = PropsWithChildren<{
  playing: boolean
  playSound: () => void
  skipToNext: () => void
  skipToPrevious: () => void
}>

export function AudioControl({
  playing,
  playSound,
  skipToNext,
  skipToPrevious,
}: AudioControlProps) {
  return (
    <Box mb="16" flex={1}>
      <Center>
        <HStack>
          <IconButton
            as={MaterialIcons}
            name="skip-previous"
            size={10}
            alignItems="center"
            mx={1}
            onPress={skipToPrevious}
            color="orange.100"
          />
          <IconButton
            as={MaterialIcons}
            name={playing ? 'pause' : 'play-arrow'}
            size={20}
            alignItems="center"
            mx={1}
            onPress={playSound}
            color="orange.100"
          />
          <IconButton
            as={MaterialIcons}
            name="skip-next"
            size={10}
            alignItems="center"
            mx={1}
            onPress={skipToNext}
            color="orange.100"
          />
        </HStack>
      </Center>
    </Box>
  )
}
