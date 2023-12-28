import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { Center, Heading, Box, useToast, Icon } from 'native-base'

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
import { Button } from '../../components/Button'

export function WhatsRinging() {
  const QTD_QUESTIONS = 4
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [isLoadingScreen, setIsloading] = useState(false)
  const [isLoadingQuestions, setIsloadingQuestions] = useState(false)
  const audioPlayerContext = useAudioPlayer()
  const toast = useToast()
  const [drawnBugles, setDrawnBugles] = useState([] as Array<AudioDTO>)
  const [answerBugle, setAnswerBugle] = useState({ id: '-1' } as AudioDTO)
  const [shotBugleId, setShotBugleId] = useState('-1')
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
      } while (buglesIndex.includes(index))

      buglesIndex.push(index)
    }

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
      setStatusQuestion(StatusQuestion.UNANSWERED)
      setAnswerBugle({ id: '-1' } as AudioDTO)
      setShotBugleId('-1')

      const drawnIndexes = randomBuglesIndex(
        QTD_QUESTIONS,
        audioPlayerContext.audioPlayer.audioFiles.length,
      )
      const drawnBuglesObjects = getDrawnBugles(drawnIndexes)
      setDrawnBugles(drawnBuglesObjects)

      const answerIndex = Math.floor(Math.random() * drawnBuglesObjects.length)

      setAnswerBugle(drawnBuglesObjects[answerIndex])
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
    setShotBugleId(bugleId)
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
          <Box h="full">
            <Box rounded="md" flex={0.55} justifyContent="center" mb={1}>
              <Center>
                <IconButton
                  as={MaterialIcons}
                  name={isPlaying() ? 'pause' : 'play-arrow'}
                  size={20}
                  alignItems="center"
                  mx={1}
                  onPress={() => handlePlayPause(answerBugle)}
                  color="white"
                />
              </Center>
            </Box>

            <Box mt={2} mb={8} flex={0.45}>
              <QuestionCard
                bugles={drawnBugles}
                answerId={answerBugle.id}
                shotId={shotBugleId}
                status={statusQuestion}
                answerQuestion={answerQuestion}
              />
              <Button
                fontSize="sm"
                m={1}
                bg="orange.700"
                title="Próximo"
                variant="subtle"
                endIcon={
                  <Icon
                    as={MaterialIcons}
                    color="white"
                    name="navigate-next"
                    size="md"
                  />
                }
                onPress={updateDrawnBugles}
              />
            </Box>
          </Box>
        )}
      </Center>
    </Box>
  )
}
