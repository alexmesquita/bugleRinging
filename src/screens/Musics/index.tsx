import { useCallback, useEffect, useState } from 'react'
import { Heading, Box, Center, FlatList, HStack, useToast } from 'native-base'

import { useAudioPlayer } from '../../hooks/useAudioPlayer'

import { Header } from '../../components/Header'
import { ListEmpty } from '../../components/ListEmpty'
import { AudioCard } from '../../components/AudioCard'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'
import { Loading } from '../../components/Loading'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'

import { AudioDTO } from '../../dtos/AudioDTO'
import { AudioPlayerDataProps } from '../../contexts/AudioContext'
import { AudioType } from '../../@types/audioTypes'

export function Musics() {
  const toast = useToast()
  const audioPlayerContext = useAudioPlayer()
  const [searchText, setSearchText] = useState('')
  const [orderToSort, setOrderToSort] = useState(1)
  const [isLoading, setIsloading] = useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const { musicFiles } = audioPlayerContext.audiosData

  const [filteredAudios, setFilteredAudios] = useState(musicFiles)

  function updateAudiosContext() {
    try {
      setIsloading(true)

      const newState = audioPlayerContext.audioPlayer

      newState.audioType = AudioType.MUSIC

      audioPlayerContext.setAudioPlayer(
        (audioPlayer: AudioPlayerDataProps) => ({
          ...audioPlayer,
          ...newState,
        }),
      )
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

  async function goToMusicPlayer(music: AudioDTO) {
    navigation.navigate('MusicPlayer', { musicId: music.id })
  }

  function orderList() {
    setIsloading(true)
    setFilteredAudios(
      filteredAudios.sort((a, b) =>
        a.name > b.name ? orderToSort : b.name > a.name ? orderToSort * -1 : 0,
      ),
    )
    setIsloading(false)

    setOrderToSort(orderToSort * -1)
  }

  useEffect(() => {
    try {
      setIsloading(true)

      if (searchText === '') {
        setFilteredAudios(musicFiles)
      } else {
        setFilteredAudios(
          musicFiles.filter(
            (item) =>
              item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1,
          ),
        )
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }, [searchText])

  useFocusEffect(
    useCallback(() => {
      updateAudiosContext()
    }, []),
  )

  return (
    <Box flex={1} bg="background" px={2}>
      <Header showHomeButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          Hinos e Canções
        </Heading>
      </Center>

      <Box rounded="md" mb={1}>
        <HStack>
          <Input
            leftIcon="search"
            bg="gray.500"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Pesquise um hino ou canção"
            pl={2}
          />
          <IconButton
            bg="gray.500"
            onPressIn={orderList}
            name="sort-by-alpha"
            ml={2}
            color="white"
          />
        </HStack>
      </Box>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={filteredAudios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AudioCard
              audioId={item.id}
              name={item.name}
              duration={item.duration}
              audioType={AudioType.MUSIC}
              onPlayPause={() => {
                goToMusicPlayer(item)
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            filteredAudios.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há hinos ou canções cadastradas" />
          )}
        />
      )}
    </Box>
  )
}
