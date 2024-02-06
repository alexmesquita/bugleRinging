import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Center, Heading, Box, Text, useTheme, useToast } from 'native-base'
import Slider from '@react-native-community/slider'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { useCallback, useState } from 'react'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { Button } from '../../components/Button'
import { play, replay } from '../../services/AudioController'
import { AppError } from '../../utils/AppError'

let clickTimer: any = null

export function Metronome() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isFirstTime, setIsFirtTime] = useState(true)
  const [bpm, setBpm] = useState(100)
  const { colors } = useTheme()
  const audioPlayerContext = useAudioPlayer()
  const { audioPlayer } = audioPlayerContext
  const toast = useToast()

  const { playbackObj, beatFile, soundObj } = audioPlayer

  async function playBeat() {
    if (isFirstTime) {
      play(playbackObj, beatFile.uriAudio)
      setIsFirtTime(false)
    } else {
      replay(playbackObj, soundObj)
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

  // function playClick() {
  //   // alternate click sounds
  //   if (count % beatsPerMeasure === 0) {
  //     click2.play()
  //   } else {
  //     click1.play()
  //   }

  //   // keep track of which beat we're on
  //   setCount((count + 1) % beatsPerMeasure)
  // }

  // function startStop() {
  //   if (isPlaying) {
  //     // stop the timer
  //     clearInterval(this.timer)
  //     setIsPlaying(false)
  //   } else {
  //     // start a timer with current bpm
  //     this.timer = setInterval(playClick, (60 / bpm) * 1000)
  //     setCount(0)
  //     setIsPlaying(true)
  //     // playClick()
  //   }
  // }

  useFocusEffect(
    useCallback(() => {
      setIsFirtTime(true)
      clickTimer = null
      return () => {
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
          Metronome screen
        </Heading>
      </Center>
      <Box>
        <Center>
          <Text color="white">{bpm} BPM</Text>
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
          //   width: 350px;
        />
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={handlePlayPause}
        ></Button>
      </Box>
    </Box>
  )
}
