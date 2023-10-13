import React, { useCallback, useState, useEffect } from 'react'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'

import { FlatList } from 'react-native'

import { Center, Heading, Box, HStack, VStack, useToast } from 'native-base'

import { Header } from '../../components/Header'
import { IconButton } from '../../components/IconButton'
import { AudioPlaylistCard } from '../../components/AudioPlaylistCard'
import { ListEmpty } from '../../components/ListEmpty'
import { Input } from '../../components/Input'

import { audioCreateByPlaylist } from '../../storage/audio/audioCreateByPlaylist'
import { getAudioByPlaylist } from '../../storage/audio/getAudioByPlaylist'
import { AudioDTO } from '../../storage/audio/AudioDTO'
import { audioRemoveByPlaylist } from '../../storage/audio/audioRemoveByPlaylist'

import { AppError } from '../../utils/AppError'
import { Loading } from '../../components/Loading'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'

type RouteParamsProps = {
  playList: string
}

export function PlayListEdit() {
  const route = useRoute()
  const { playList } = route.params as RouteParamsProps

  const [currentPlayList, setCurrentPlayList] = useState('')
  const [audios, setAudios] = useState<AudioDTO[]>([])
  const [audiosPlaylist, setAudiosPlaylist] = useState<AudioDTO[]>([])
  const flatListRef = React.useRef<FlatList>(null)
  const toast = useToast()

  const [exceptAudios, setExceptAudios] = useState(audios)
  const [filteredAudios, setFilteredAudios] = useState(audios)
  const [searchText, setSearchText] = useState('')
  const [orderToSort, setOrderToSort] = useState(1)
  const [isLoadingPlaylistAudios, setIsloadingPlaylistAudios] = useState(false)
  const [isLoadingExceptAudios, setIsloadingExceptAudios] = useState(false)
  const audioPlayerContext = useAudioPlayer()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function orderList() {
    setIsloadingExceptAudios(true)

    setFilteredAudios(
      filteredAudios.sort((a, b) =>
        a.name > b.name ? orderToSort : b.name > a.name ? orderToSort * -1 : 0,
      ),
    )

    setOrderToSort(orderToSort * -1)
    setIsloadingExceptAudios(false)
  }

  function filterList() {
    setIsloadingExceptAudios(true)

    if (searchText === '') {
      setFilteredAudios(exceptAudios)
    } else {
      setFilteredAudios(
        exceptAudios.filter(
          (item) =>
            item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1,
        ),
      )
    }
    setIsloadingExceptAudios(false)
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

  async function getAudios() {
    try {
      setIsloadingExceptAudios(true)
      setAudios(audioPlayerContext.audioPlayer.audioFiles)
    } catch (error) {
      console.log(error)
    } finally {
      setIsloadingExceptAudios(false)
    }
  }

  async function addAudio(item: AudioDTO, playListToAdd: string) {
    const newAudio = {
      name: item.name,
      id: item.id,
    }

    try {
      console.log('add: ' + newAudio.name)
      console.log('para: ' + playListToAdd)
      await audioCreateByPlaylist(newAudio, playListToAdd)
      await getAudiosByPlaylist(playListToAdd)
      scrollToEnd()
    } catch (error) {
      if (error instanceof AppError) {
        toast.show({
          title: error.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Não foi possível cadastrar o Audio.',
          placement: 'top',
          bgColor: 'red.500',
        })
        console.log(error)
      }
    }
  }

  async function removeAudio(item: AudioDTO, playListToRemove: string) {
    try {
      await audioRemoveByPlaylist(item.id, playListToRemove)
      await getAudiosByPlaylist(playListToRemove)
    } catch (error) {
      if (error instanceof AppError) {
        toast.show({
          title: error.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Não foi possível remover o Audio.',
          placement: 'top',
          bgColor: 'red.500',
        })
        console.log(error)
      }
    }
  }

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }

  // TODO usar depois de colocar a navegação

  useFocusEffect(
    useCallback(() => {
      setCurrentPlayList(playList)
      getAudios()
      getAudiosByPlaylist(playList)
      console.log('chegou a playlist: ' + playList)
    }, [route]),
  )

  useEffect(() => {
    setIsloadingExceptAudios(true)
    setExceptAudios(
      audios.filter((a) => !audiosPlaylist.map((b) => b.id).includes(a.id)),
    )
    setIsloadingExceptAudios(false)
  }, [audios, audiosPlaylist])

  useEffect(() => {
    filterList()
  }, [searchText, exceptAudios])

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showBackButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          {currentPlayList}
        </Heading>
      </Center>

      <Box flex={1}>
        <VStack flex={1}>
          <Box flex={0.4} p={2} mb={1} bg="gray.500">
            {isLoadingPlaylistAudios ? (
              <Loading />
            ) : (
              <FlatList
                data={audiosPlaylist}
                keyExtractor={(item) => item.id.toString()}
                ref={flatListRef}
                renderItem={({ item }) => (
                  <AudioPlaylistCard
                    name={item.name}
                    type="REMOVE"
                    action={() => {
                      removeAudio(item, currentPlayList)
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  { paddingBottom: 100 },
                  audios.length === 0 && { flex: 1 },
                ]}
                ListEmptyComponent={() => (
                  <ListEmpty message="Não há toques cadastrados" />
                )}
              />
            )}
          </Box>

          <HStack>
            <Input
              leftIcon="search"
              bg="gray.500"
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Pesquise um toque de corneta"
              pl={2}
            />
            <IconButton
              bg="gray.500"
              onPress={orderList}
              name="sort-by-alpha"
              ml={2}
              color="white"
            />
          </HStack>

          <Box flex={0.6} p={2} mt={1} bg="gray.500">
            {isLoadingExceptAudios ? (
              <Loading />
            ) : (
              <FlatList
                data={filteredAudios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <AudioPlaylistCard
                    name={item.name}
                    type="ADD"
                    action={() => {
                      addAudio(item, currentPlayList)
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  { paddingBottom: 100 },
                  audios.length === 0 && { flex: 1 },
                ]}
                ListEmptyComponent={() => (
                  <ListEmpty message="Não há toques cadastrados" />
                )}
              />
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}
