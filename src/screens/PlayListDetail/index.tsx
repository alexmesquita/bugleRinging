import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'

import { Center, Heading, Box, FlatList, Text } from 'native-base'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { AudioDTO } from '../../dtos/AudioDTO'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import {
  getAudiosByPlaylist,
  selectAudio,
} from '../../services/AudioController'
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

  async function handlePlayPause(bugle: AudioDTO, indexOnPlayList: number) {
    const activePlayList = { name: playList, audios: playListAudios }

    await selectAudio(bugle, audioPlayerContext, {
      activePlayList,
      isPlayListRunning: true,
      indexOnPlayList,
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
      getAudios()
    }, [route]),
  )

  useFocusEffect(
    useCallback(() => {
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
          {playList}
        </Heading>
      </Center>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={playListAudios}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <>
              <Text>{index}</Text>
              <AudioCard
                audioId={item.id}
                name={item.name}
                duration={item.duration}
                audioType={item.type}
                indexOnPlaylist={index}
                onPlayPause={() => {
                  handlePlayPause(item, index)
                }}
              />
            </>
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
