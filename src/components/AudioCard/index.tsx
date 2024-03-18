import { Box, HStack, Text, VStack } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'
import { millisToMinutesAndSeconds } from '../../utils/dateTime'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { checkIsCurrentAudio } from '../../services/AudioController'
import { AudioType } from '../../@types/audioTypes'

type Props = {
  audioId: string
  name: string
  duration: number
  audioType: AudioType
  onPlayPause: () => void
  indexOnPlaylist?: number
}

let isCurrentAudio = false
let isPlaying = false

export function AudioCard({
  audioId,
  name,
  duration,
  audioType,
  onPlayPause,
  indexOnPlaylist = -1,
}: Props) {
  const audioPlayerContext = useAudioPlayer()

  function checkCurrentAudio() {
    isCurrentAudio = checkIsCurrentAudio(
      audioPlayerContext,
      audioId,
      audioType,
      indexOnPlaylist,
    )
    isPlaying = audioPlayerContext.audioPlayer.isPlaying

    return isCurrentAudio
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
        {indexOnPlaylist !== -1 ? (
          <Text color="white" ml={2} mr={-1}>
            {indexOnPlaylist + 1}
          </Text>
        ) : (
          <></>
        )}
        <IconButton
          as={MaterialIcons}
          name={isPlaying && isCurrentAudio ? 'pause' : 'play-arrow'}
          size={8}
          alignItems="center"
          onPressIn={onPlayPause}
          color={isCurrentAudio ? 'gray.700' : 'white'}
        />
        <VStack flex={1} pt={2}>
          <Text
            color={isCurrentAudio ? 'gray.700' : 'gray.200'}
            justifyContent="center"
            flex={1}
            fontSize="lg"
          >
            {name}
          </Text>
          <Text color={isCurrentAudio ? 'gray.500' : 'gray.300'} fontSize="xs">
            {millisToMinutesAndSeconds(duration)}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
