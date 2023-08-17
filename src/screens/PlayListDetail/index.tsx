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

type RouteParamsProps = {
  playList: string
}

export function PlayListDetail() {
  const route = useRoute()
  const { playList } = route.params as RouteParamsProps

  const [currentPlayList, setCurrentPlayList] = useState(playList)
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

  async function getAudiosByPlaylist() {
    try {
      setIsloadingPlaylistAudios(true)

      const data: AudioDTO[] = await getAudioByPlaylist(currentPlayList)
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

      const data = [
        { id: '0', name: 'toque 1' },
        { id: '1', name: 'toque 2' },
        { id: '2', name: 'abc 3' },
        { id: '3', name: 'bcd 2' },
        { id: '4', name: '123' },
        { id: '5', name: '94' },
        { id: '6', name: '9iol,' },
        { id: '7', name: 'avsd' },
        { id: '8', name: 'as' },
        { id: '9', name: 'atnhsr' },
        { id: '10', name: '92334' },
        { id: '11', name: '9tyyt' },
        { id: '12', name: '1254765' },
        { id: '13', name: '9876798' },
        { id: '14', name: 'sagd' },
        { id: '15', name: 'baiukf' },
      ]
      setAudios(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsloadingExceptAudios(false)
    }
  }

  async function addAudio(item: AudioDTO) {
    const newAudio = {
      name: item.name,
      id: item.id,
    }

    try {
      await audioCreateByPlaylist(newAudio, currentPlayList)
      await getAudiosByPlaylist()
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

  async function removeAudio(item: AudioDTO) {
    try {
      await audioRemoveByPlaylist(item.id, currentPlayList)
      await getAudiosByPlaylist()
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

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('useFocusEffect executou para buscar as playlists')
  //     getPlaylists()
  //   }, []),
  // )

  useEffect(() => {
    getAudios()
    getAudiosByPlaylist()
  }, [])

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
                      removeAudio(item)
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
              pl={1}
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
                      addAudio(item)
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
