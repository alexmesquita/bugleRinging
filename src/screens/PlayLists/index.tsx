import React, { useCallback, useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import { playlistCreate } from '../../storage/playlist/playlistCreate'
import { playlistGetAll } from '../../storage/playlist/playlistGetAll'

import { Center, Heading, Box, HStack } from 'native-base'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'
import { ListEmpty } from '../../components/ListEmpty'
import { Alert, FlatList, Keyboard } from 'react-native'
import { AppError } from '../../utils/AppError'
import { PlaylistCard } from '../../components/PlaylistCard'
import { playlistRemove } from '../../storage/playlist/playlistRemove'

export function PlayLists() {
  const [newPlaylist, setNewPlaylist] = useState('')
  const [playLists, setPlayLists] = useState<string[]>([])
  const flatListRef = React.useRef<FlatList>(null)

  async function createPlaylist() {
    try {
      if (newPlaylist.trim().length === 0) {
        throw new AppError('Informe o nome da playlist.')
      }
      await playlistCreate(newPlaylist)
      await getPlaylists()

      setNewPlaylist('')
      Keyboard.dismiss()
      scrollToEnd()
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
      await setPlayLists(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function removePlaylist(name: string) {
    try {
      await playlistRemove(name)
      await getPlaylists()
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Excluir Playlist', error.message)
      } else {
        Alert.alert(
          'Excluir Playlist',
          'Não foi possível cadastrar a playlist.',
        )
        console.log(error)
      }
    }
  }

  async function editPlaylist(name: string) {
    console.log(`editar playlist: ${name}`)
  }

  const scrollToEnd = () => {
    console.log('scroing to end')
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
    console.log('useEffect executou para buscar as playlists')
    getPlaylists()
  }, [])

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
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
            onSubmitEditing={createPlaylist}
            returnKeyType="done"
          />
          <IconButton onPress={createPlaylist} name="playlist-add" />
        </HStack>
      </Box>

      <FlatList
        data={playLists}
        keyExtractor={(item) => item}
        ref={flatListRef}
        renderItem={({ item }) => (
          <PlaylistCard
            name={item}
            onEdit={() => {
              editPlaylist(item)
            }}
            onRemove={() => {
              removePlaylist(item)
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          playLists.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há toques cadastrados" />
        )}
      />
    </Box>
  )
}
