import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Center, Heading, Box, Text, useTheme, useToast } from 'native-base'
import Slider from '@react-native-community/slider'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { useCallback, useState } from 'react'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { selectAudio } from '../../services/AudioController'
import { IconButton } from '../../components/IconButton'
import { MaterialIcons } from '@expo/vector-icons'

export function Metronome() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(80)
  const [bpmToShow, setBpmToShow] = useState(80)
  const { colors } = useTheme()
  const audioPlayerContext = useAudioPlayer()
  const { audiosData } = audioPlayerContext
  const toast = useToast()

  const { beatFiles } = audiosData

  async function handlePlayPause(bpmToFind: string) {
    const audioDTO = beatFiles.find((audio) => audio.name === bpmToFind)

    if (audioDTO) await selectAudio(audioDTO, audioPlayerContext)
    else {
      toast.show({
        title: 'Não foi possível reproduzir o metrônomo',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log('Erro ao carregar beat')
    }
  }

  function playPauseBeat() {
    setIsPlaying(!isPlaying)

    handlePlayPause(bpm.toString())
  }
  function handleInputChange(value: number) {
    setBpm(value)

    if (isPlaying) handlePlayPause(value.toString())
  }

  useFocusEffect(
    useCallback(() => {
      setIsPlaying(false)
      return () => {
        const { cleanAudioPlayer, audioPlayer } = audioPlayerContext
        cleanAudioPlayer(audioPlayer)
      }
    }, []),
  )

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showHomeButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          Metrônomo
        </Heading>
      </Center>
      <Box m={3} justifyContent="center" flex={1}>
        <Center mb={12}>
          <Text color="white" fontSize="5xl">
            {bpmToShow} BPM
          </Text>
        </Center>

        <Slider
          value={bpmToShow}
          minimumValue={80}
          maximumValue={140}
          step={10}
          onValueChange={(value) => {
            setBpmToShow(value)
          }}
          onSlidingComplete={(value) => {
            handleInputChange(value)
          }}
          thumbTintColor={colors.orange[700]}
          maximumTrackTintColor={colors.orange[300]}
          minimumTrackTintColor={colors.orange[700]}
        />
        <Box mt={8}>
          <Center>
            <IconButton
              as={MaterialIcons}
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={24}
              mx={1}
              onPressIn={() => {
                playPauseBeat()
              }}
              color="white"
            />
          </Center>
        </Box>
      </Box>
    </Box>
  )
}
