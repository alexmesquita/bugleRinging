import { Box, HStack, Text, VStack } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'
import { millisToMinutesAndSeconds } from '../../utils/dateTime'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { isCurrentAudio } from '../../services/AudioController'
import { AudioType } from '../../@types/audioTypes'

type Props = {
  audioId: string
  name: string
  duration: number
  audioType: AudioType
  onPlayPause: () => void
  indexOnPlaylist?: number
}

export function AudioCard({
  audioId,
  name,
  duration,
  audioType,
  onPlayPause,
  indexOnPlaylist = -1,
}: Props) {
  const audioPlayerContext = useAudioPlayer()

  function checkCurrentAudio(checkIsPlaying = false) {
    return isCurrentAudio(
      audioPlayerContext,
      audioId,
      audioType,
      indexOnPlaylist,
      checkIsPlaying,
    )
  }

  return (
    <Box
      w="full"
      h={14}
      bg={checkCurrentAudio() ? 'gray.300' : 'gray.500'}
      rounded="md"
      mt={2}
    >
      <HStack alignItems="center">
        <IconButton
          as={MaterialIcons}
          name={checkCurrentAudio(true) ? 'pause' : 'play-arrow'}
          size={8}
          alignItems="center"
          mx={1}
          onPressIn={onPlayPause}
          color={checkCurrentAudio() ? 'gray.700' : 'white'}
        />
        <VStack flex={1} pl={1} pt={2}>
          <Text
            color={checkCurrentAudio() ? 'gray.700' : 'gray.200'}
            justifyContent="center"
            flex={1}
            fontSize="lg"
          >
            {name}
          </Text>
          <Text
            color={checkCurrentAudio() ? 'gray.500' : 'gray.300'}
            fontSize="xs"
          >
            {millisToMinutesAndSeconds(duration)}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
