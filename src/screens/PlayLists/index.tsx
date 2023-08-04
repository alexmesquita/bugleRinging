import React, { useCallback, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import { playlistCreate } from '../../storage/playlist/playlistCreate'
import { playlistGetAll } from '../../storage/playlist/playlistGetAll'

import { Center, Heading, Box, HStack, Text } from 'native-base'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'
import { Filter } from '../../components/Filter'
import { AudioRemoveCard } from '../../components/AudioRemoveCard'
import { ListEmpty } from '../../components/ListEmpty'
import { Button } from '../../components/Button'
import { Alert, FlatList } from 'react-native'
import { AppError } from '../../utils/AppError'

export function PlayLists() {
  const [newPlaylist, setNewPlaylist] = useState('')
  const [currentPlayList, setCurrentPlayList] = useState('')
  const [playLists, setPlayLists] = useState([
    'PlayList 1',
    'PlayList 2',
    'PlayList 3',
    'PlayList 4',
  ])
  const [audios, setAudios] = useState([
    'toque 1',
    'toque 2',
    'toque 3',
    'toque 4',
    'toque 5',
    'toque 6',
    'toque 7',
    'toque 8',
  ])
  const flatListRef = React.useRef<FlatList>(null)

  async function createPlaylist() {
    try {
      if (newPlaylist.trim().length === 0) {
        throw new AppError('Informe o nome da playlist.')
      }
      await playlistCreate(newPlaylist)
      await getPlaylists()

      scrollToIndex(playLists.length - 1)
      setCurrentPlayList(newPlaylist)
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova Playlist', error.message)
      } else {
        Alert.alert('Nova Playlist', 'Não foi possível cadastrar a playlist.')
        console.log(error)
      }
    }
  }

  async function getPlaylists() {
    console.log('Geting playlists')
    try {
      const data = await playlistGetAll()
      setPlayLists(data)
    } catch (error) {
      console.log(error)
    }
  }

  const removeAudio = (item: any) => {
    console.log(`Apagar toque: ${item}`)
  }

  const scrollToIndex = (index: number) => {
    console.log('scroing to the ' + index)
    flatListRef.current?.scrollToIndex({ animated: true, index })
  }

  // TODO usar depois de colocar a navegação

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('useFocusEffect executou para buscar as playlists')
  //     getPlaylists()
  //   }, []),
  // )

  useEffect(() => {
    console.log('useEffect executou para buscar as playlists')
    getPlaylists()
  }, [])

  return (
    <Box flex={1} bg="background">
      <Header showBackButton />

      <Center>
        <Heading mb={2} color="white">
          Playlists
        </Heading>
      </Center>

      <Box bg="gray.500" rounded="md">
        <HStack>
          <Input
            value={newPlaylist}
            onChangeText={setNewPlaylist}
            placeholder="Nome da Playlists"
          />
          <IconButton onPress={createPlaylist} name="add" />
        </HStack>
      </Box>

      <Box my={4}>
        <HStack>
          <FlatList
            data={playLists}
            keyExtractor={(item) => item}
            horizontal
            ref={flatListRef}
            renderItem={({ item }) => (
              <Filter
                title={item}
                isActive={item === currentPlayList}
                onPress={() => setCurrentPlayList(item)}
              />
            )}
          />
          <Text fontSize="sm" bold color="gray.200" mx={0.5}>
            {playLists.length}
          </Text>
        </HStack>
      </Box>

      <FlatList
        data={audios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <AudioRemoveCard
            name={item}
            onRemove={() => {
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

      <Button title="Remover Playlist" type="SECONDARY" mt={2} />
    </Box>
  )
}
