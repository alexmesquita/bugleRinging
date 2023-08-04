import { Box, HStack, Text, VStack } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'
import { millisToMinutesAndSeconds } from '../../utils/dateTime'

type Props = {
  name: string
  duration: number
  onPlayPause: () => void
  playing?: boolean
}

export function AudioCard({
  name,
  duration,
  onPlayPause,
  playing = false,
}: Props) {
  return (
    <Box w="full" h={14} bg="gray.500" rounded="md" mt={2}>
      <HStack alignItems="center">
        <IconButton
          as={MaterialIcons}
          name={playing ? 'pause' : 'play-arrow'}
          size={8}
          alignItems="center"
          mx={1}
          onPress={onPlayPause}
          color="white"
        />
        <VStack flex={1} pl={1} pt={2}>
          <Text color="gray.200" justifyContent="center" flex={1} fontSize="lg">
            {name}
          </Text>
          <Text color="gray.300" fontSize="xs">
            {millisToMinutesAndSeconds(duration)}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
