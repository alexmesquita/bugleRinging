import React, { useCallback, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import { playlistCreate } from '../../storage/playlist/playlistCreate'
import { playlistGetAll } from '../../storage/playlist/playlistGetAll'

import { Center, Heading, Box, HStack, Text, VStack } from 'native-base'

import { Header } from '../../components/Header'
import { IconButton } from '../../components/IconButton'
import { AudioPlaylistCard } from '../../components/AudioPlaylistCard'
import { ListEmpty } from '../../components/ListEmpty'
import { Alert, FlatList } from 'react-native'
import { AppError } from '../../utils/AppError'
import { Input } from '../../components/Input'
import { audioCreateByPlaylist } from '../../storage/audio/audioCreateByPlaylist'
import { getAudioByPlaylist } from '../../storage/audio/getAudioByPlaylist'
import { AudioDTO } from '../../storage/audio/AudioDTO'
import { audioRemoveByPlaylist } from '../../storage/audio/audioRemoveByPlaylist'

export function PlayListDetail() {
  const [currentPlayList, setCurrentPlayList] = useState('Desfile 1')
  const [audios, setAudios] = useState<AudioDTO[]>([])
  const [audiosPlaylist, setAudiosPlaylist] = useState<AudioDTO[]>([])
  const flatListRef = React.useRef<FlatList>(null)

  const [exceptAudios, setExceptAudios] = useState(audios)
  const [filteredAudios, setFilteredAudios] = useState(audios)
  const [searchText, setSearchText] = useState('')
  const [orderToSort, setOrderToSort] = useState(1)

  function orderList() {
    setFilteredAudios(
      filteredAudios.sort((a, b) =>
        a.name > b.name ? orderToSort : b.name > a.name ? orderToSort * -1 : 0,
      ),
    )

    setOrderToSort(orderToSort * -1)
  }

  async function getAudiosByPlaylist() {
    try {
      const data: AudioDTO[] = await getAudioByPlaylist(currentPlayList)
      setAudiosPlaylist(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getAudios() {
    try {
      // const data = await playlistGetAll()
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
        Alert.alert('Novo Audio para a Playlist', error.message)
      } else {
        Alert.alert(
          'Novo Audio para a Playlist',
          'Não foi possível cadastrar o Audio.',
        )
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
        Alert.alert('Remover Audio', error.message)
      } else {
        Alert.alert('Remover Audio', 'Não foi possível remover o Audio.')
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
    setExceptAudios(
      audios.filter((a) => !audiosPlaylist.map((b) => b.id).includes(a.id)),
    )
  }, [audios, audiosPlaylist])

  useEffect(() => {
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
  }, [searchText, exceptAudios])

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showBackButton />

      <Center>
        <Heading mb={2} color="white">
          {currentPlayList}
        </Heading>
      </Center>

      <Box flex={1}>
        <VStack flex={1}>
          <Box flex={0.4} p={2} mb={1} bg="gray.500">
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
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}
