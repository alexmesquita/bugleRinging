import { useFocusEffect, useNavigation } from '@react-navigation/native'

import {
  Center,
  Heading,
  Box,
  useToast,
  Text,
  VStack,
  Divider,
  HStack,
  Icon,
} from 'native-base'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { AudioType, StatusQuestion } from '../../@types/audioTypes'
import {
  isCurrentAudio,
  selectAudio,
  updateAudioType,
} from '../../services/AudioController'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { useCallback, useState } from 'react'
import { AudioDTO } from '../../dtos/AudioDTO'
import { Loading } from '../../components/Loading'
import { MaterialIcons } from '@expo/vector-icons'
import { IconButton } from '../../components/IconButton'
import { QuestionCard } from '../../components/QuestionCard'

export function WhatsRinging() {
  const QTD_QUESTIONS = 4
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [isLoadingScreen, setIsloading] = useState(false)
  const [isLoadingQuestions, setIsloadingQuestions] = useState(false)
  const audioPlayerContext = useAudioPlayer()
  const toast = useToast()
  const [drawnBugles, setDrawnBugles] = useState([] as Array<AudioDTO>)
  const [answerBugle, setAnswerBugle] = useState({} as AudioDTO)
  const [shotBugle, setShotBugle] = useState({} as AudioDTO)
  const [statusQuestion, setStatusQuestion] = useState(
    StatusQuestion.UNANSWERED,
  )

  function updateAudioTypeInContext() {
    try {
      setIsloading(true)

      updateAudioType(audioPlayerContext, AudioType.BUGLE)
    } catch (error) {
      toast.show({
        title: 'Não foi possível atualizar Toques.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }

  async function handlePlayPause(bugle: AudioDTO) {
    await selectAudio(bugle, audioPlayerContext)
  }

  function isPlaying() {
    if (!answerBugle || !answerBugle.id) return false
    return isCurrentAudio(
      audioPlayerContext,
      answerBugle.id,
      answerBugle.type,
      -1,
      true,
    )
  }

  function randomBuglesIndex(indexQtd: number, buglesLength: number) {
    const buglesIndex = [] as Array<number>

    for (let i = 0; i < indexQtd; i++) {
      let index = -1

      do {
        index = Math.floor(Math.random() * buglesLength)
        console.log('sorteou: ' + index)
      } while (buglesIndex.includes(index))

      buglesIndex.push(index)
    }

    console.log(buglesIndex)
    return buglesIndex
  }

  function getDrawnBugles(drawnIndexes: Array<number>) {
    const drawnBugles = [] as Array<AudioDTO>
    const buglesLength = audioPlayerContext.audioPlayer.audioFiles.length

    drawnIndexes.forEach((index) => {
      if (index >= buglesLength) {
        console.error(
          `Erro ao sortear os index do array. Tamanho do array de toques: ${buglesLength} - valor sorteado: ${index}`,
        )
        toast.show({
          title: 'Erro ao sortear os toques.',
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        drawnBugles.push(audioPlayerContext.audioPlayer.audioFiles[index])
      }
    })
    return drawnBugles
  }

  function updateDrawnBugles() {
    try {
      setIsloadingQuestions(true)
      const drawnIndexes = randomBuglesIndex(
        QTD_QUESTIONS,
        audioPlayerContext.audioPlayer.audioFiles.length,
      )
      console.log('Updating drawn')
      console.log(drawnIndexes)
      setDrawnBugles(getDrawnBugles(drawnIndexes))
      console.log(JSON.stringify(drawnBugles))

      const answerIndex = Math.floor(Math.random() * drawnBugles.length)
      console.log(answerIndex)

      setAnswerBugle(drawnBugles[answerIndex])
      console.log(answerBugle)
    } catch (error) {
      toast.show({
        title: 'Não foi possível sortear os toques.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
    } finally {
      setIsloadingQuestions(false)
    }
  }

  function answerQuestion(bugleId: string) {
    if (bugleId === answerBugle.id) {
      setStatusQuestion(StatusQuestion.HIT)
    } else setStatusQuestion(StatusQuestion.ERROR)
  }

  // TODO verificar se precisa atualizar o audioFiles do contexto quando trocar de tela
  useFocusEffect(
    useCallback(() => {
      updateAudioTypeInContext()
      updateDrawnBugles()
      return () => {
        // TODO unsubscribe, tentar pausar o audio se mudar de tela
      }
    }, []),
  )

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showBackButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          Qual é o Toque?
        </Heading>

        {isLoadingScreen || isLoadingQuestions ? (
          <Loading />
        ) : (
          <Box flex={1} justifyContent="center">
            <Center>
              <IconButton
                as={MaterialIcons}
                name={isPlaying() ? 'pause' : 'play-arrow'}
                size={10}
                alignItems="center"
                mx={1}
                onPress={() => handlePlayPause(answerBugle)}
                color="white"
              />
              <QuestionCard
                bugles={drawnBugles}
                answerId={answerBugle.id}
                shotId={shotBugle.id}
                status={statusQuestion}
                answerQuestion={answerQuestion}
              />
            </Center>
          </Box>
        )}
      </Center>
    </Box>
  )
}
