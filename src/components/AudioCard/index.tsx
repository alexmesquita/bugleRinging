import { Box, HStack, Text } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'

type Props = {
  name: string
  onPlayPause: () => void
  playing?: boolean
}

export function AudioCard({ name, onPlayPause, playing = false }: Props) {
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
        <Text color="gray.200" flex={1} fontSize="lg">
          {name}
        </Text>
      </HStack>
    </Box>
  )
}
