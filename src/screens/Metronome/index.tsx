import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Center, Heading, Box, Text, useTheme, useToast } from 'native-base'
import Slider from '@react-native-community/slider'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { useCallback, useState } from 'react'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { play, replay } from '../../services/AudioController'
import { AppError } from '../../utils/AppError'
import { IconButton } from '../../components/IconButton'
import { MaterialIcons } from '@expo/vector-icons'

let clickTimer: any = null

export function Metronome() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(60)
  const { colors } = useTheme()
  const audioPlayerContext = useAudioPlayer()
  const { audioPlayer, audiosData } = audioPlayerContext
  const toast = useToast()
  let isFirstTime = true

  const { playbackObj } = audioPlayer
  const { beatFile } = audiosData

  async function playBeat() {
    if (isFirstTime) {
      isFirstTime = false
      play(playbackObj, beatFile.uriAudio, 0)
    } else {
      replay(playbackObj)
    }
  }
  function handleInputChange(value: number) {
    if (isPlaying) {
      // stop old timer and start a new one
      if (clickTimer) clearInterval(clickTimer)
      clickTimer = setInterval(playBeat, (60 / value) * 1000)
    }
    setBpm(value)
  }

  function handlePlayPause() {
    try {
      if (!isPlaying) {
        clickTimer = setInterval(playBeat, (60 / bpm) * 1000)
      } else {
        clearInterval(clickTimer)
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      if (error instanceof AppError) {
        toast.show({
          title: error.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Não foi possível reproduzir o metrônomo',
          placement: 'top',
          bgColor: 'red.500',
        })
        console.log(error)
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      isFirstTime = true
      clickTimer = null
      return () => {
        const { cleanAudioPlayer, audioPlayer } = audioPlayerContext
        cleanAudioPlayer(audioPlayer)
        if (clickTimer) {
          clearInterval(clickTimer)
        }
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
        <Center mb={2}>
          <Text color="white" fontSize={'lg'}>
            {bpm} BPM
          </Text>
        </Center>

        <Slider
          value={bpm}
          minimumValue={50}
          maximumValue={200}
          step={1}
          onValueChange={(value) => {
            handleInputChange(value)
          }}
          thumbTintColor={colors.orange[700]}
          maximumTrackTintColor={colors.orange[300]}
          minimumTrackTintColor={colors.orange[700]}
        />
        <IconButton
          as={MaterialIcons}
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={20}
          alignItems="center"
          mx={1}
          onPressIn={handlePlayPause}
          color="white"
        />
      </Box>
    </Box>
  )
}
