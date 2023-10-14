import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'

import { Center, Heading, Box, Text } from 'native-base'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { AudioDTO } from '../../dtos/AudioDTO'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { selectAudio } from '../../services/AudioController'
import { AudioPlayerDataProps } from '../../contexts/AudioContext'
import { useCallback, useState } from 'react'
import { Loading } from '../../components/Loading'
import { getAudioByPlaylist } from '../../storage/audio/getAudioByPlaylist'

type RouteParamsProps = {
  playList: string
}

export function PlayListDetail() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const { playList } = route.params as RouteParamsProps
  const audioPlayerContext = useAudioPlayer()
  const [currentPlaylist, setCurrentPlaylist] = useState(playList)
  const [isLoadingPlaylistAudios, setIsloadingPlaylistAudios] = useState(false)

  async function handlePlayPause(bugle: AudioDTO) {
    console.log(bugle)
    await selectAudio(bugle, audioPlayerContext)
  }

  async function getAudiosByPlaylist(playListToSearch: string) {
    try {
      setIsloadingPlaylistAudios(true)

      console.log('Buscando audios da playlist: ' + playListToSearch)
      const data: AudioDTO[] = await getAudioByPlaylist(playListToSearch)
      console.log('audios: ' + JSON.stringify(playListToSearch))
      setAudiosPlaylist(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsloadingPlaylistAudios(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log(
        'useFocusEffect executou para buscar Atualizar os audios no contexto',
      )

      const newState = audioPlayerContext.audioPlayer
      newState.isPlayNext = true
      audioPlayerContext.setAudioPlayer(
        (audioPlayer: AudioPlayerDataProps) => ({
          ...audioPlayer,
          ...newState,
        }),
      )
      setCurrentPlaylist(playList)
      getAudiosByPlaylist(playList)
    }, [route]),
  )

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showBackButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          {currentPlaylist}
        </Heading>
        {isLoadingPlaylistAudios ? <Loading /> : <Text> Audios ...</Text>}
      </Center>
    </Box>
  )
}
