import { Box, HStack, Text, VStack } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'
import { millisToMinutesAndSeconds } from '../../utils/dateTime'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'

type Props = {
  audioId: string
  name: string
  duration: number
  audioType: string
  onPlayPause: () => void
}

export function AudioCard({
  audioId,
  name,
  duration,
  audioType,
  onPlayPause,
}: Props) {
  const audioPlayerContext = useAudioPlayer()

  return (
    <Box w="full" h={14} bg="gray.500" rounded="md" mt={2}>
      <HStack alignItems="center">
        <IconButton
          as={MaterialIcons}
          name={
            audioPlayerContext.audioPlayer.isPlaying &&
            audioId === audioPlayerContext.audioPlayer.currentAudio.id &&
            audioPlayerContext.audioPlayer.audioType === audioType
              ? 'pause'
              : 'play-arrow'
          }
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
