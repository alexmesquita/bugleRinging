import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'

import { Center, Heading, Box, FlatList } from 'native-base'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { AudioDTO } from '../../dtos/AudioDTO'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import {
  getAudiosByPlaylist,
  selectAudio,
} from '../../services/AudioController'
import { AudioPlayerDataProps } from '../../contexts/AudioContext'
import { useCallback, useState } from 'react'
import { Loading } from '../../components/Loading'
import { AudioCard } from '../../components/AudioCard'
import { ListEmpty } from '../../components/ListEmpty'

type RouteParamsProps = {
  playList: string
}

export function PlayListDetail() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const { playList } = route.params as RouteParamsProps
  const audioPlayerContext = useAudioPlayer()
  const [isLoading, setIsloading] = useState(false)
  const [playListAudios, setplayListAudios] = useState<AudioDTO[]>([])

  async function handlePlayPause(bugle: AudioDTO) {
    console.log(bugle)
    const activePlayList = { name: playList, audios: playListAudios }

    await selectAudio(bugle, audioPlayerContext, {
      activePlayList,
      isPlayListRunning: true,
    })
  }

  async function getAudios() {
    const audiosFinded = await getAudiosByPlaylist(
      audioPlayerContext,
      playList,
      setIsloading,
    )

    setplayListAudios(audiosFinded)
  }

  useFocusEffect(
    useCallback(() => {
      const newState = audioPlayerContext.audioPlayer
      newState.isPlayNext = true
      audioPlayerContext.setAudioPlayer(
        (audioPlayer: AudioPlayerDataProps) => ({
          ...audioPlayer,
          ...newState,
        }),
      )

      getAudios()
    }, [route]),
  )

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showBackButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          {playList}
        </Heading>
      </Center>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={playListAudios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AudioCard
              audioId={item.id}
              name={item.name}
              duration={item.duration}
              onPlayPause={() => {
                handlePlayPause(item)
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            playListAudios.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há toques cadastrados" />
          )}
        />
      )}
    </Box>
  )
}
