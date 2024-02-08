import React, { useCallback, useState, useEffect } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Alert, FlatList, Keyboard } from 'react-native'

import { Center, Heading, Box, HStack, useToast } from 'native-base'

import { AppNavigatorRoutesProps } from '../../routes/app.routes'

import { playlistCreate } from '../../storage/playlist/playlistCreate'
import { playlistRemove } from '../../storage/playlist/playlistRemove'
import { playlistGetAll } from '../../storage/playlist/playlistGetAll'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'
import { ListEmpty } from '../../components/ListEmpty'
import { PlaylistCard } from '../../components/PlaylistCard'

import { AppError } from '../../utils/AppError'
import { Loading } from '../../components/Loading'

export function PlayLists() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [newPlaylist, setNewPlaylist] = useState('')
  const [playLists, setPlayLists] = useState<string[]>([])
  const flatListRef = React.useRef<FlatList>(null)
  const [isLoading, setIsloading] = useState(false)
  const toast = useToast()

  async function createPlaylist() {
    try {
      setIsloading(true)
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
        toast.show({
          title: error.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Não foi possível cadastrar a playlist.',
          placement: 'top',
          bgColor: 'red.500',
        })
        console.log(error)
      }
    } finally {
      setIsloading(false)
    }
  }

  async function getPlaylists() {
    try {
      setIsloading(true)
      const data = await playlistGetAll()
      await setPlayLists(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }

  async function removePlaylist(name: string) {
    try {
      setIsloading(true)
      await playlistRemove(name)
      await getPlaylists()
    } catch (error) {
      if (error instanceof AppError) {
        toast.show({
          title: error.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      } else {
        toast.show({
          title: 'Não foi possível cadastrar a playlist.',
          placement: 'top',
          bgColor: 'red.500',
        })
        console.log(error)
      }
    } finally {
      setIsloading(false)
    }
  }

  async function handleRemovePlaylist(name: string) {
    Alert.alert('Remover', 'Deseja Remover a playlist?', [
      { text: 'Não', style: 'cancel' },
      { text: 'sim', onPress: () => removePlaylist(name) },
    ])
  }

  async function detailPlaylist(name: string) {
    navigation.navigate('PlayListDetail', { playList: name })
  }

  async function editPlaylist(name: string) {
    navigation.navigate('PlayListEdit', { playList: name })
  }

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }

  useEffect(() => {
    getPlaylists()
  }, [])

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showHomeButton={navigation.canGoBack()} />

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

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={playLists}
          keyExtractor={(item) => item}
          ref={flatListRef}
          renderItem={({ item }) => (
            <PlaylistCard
              name={item}
              onDetail={() => {
                detailPlaylist(item)
              }}
              onEdit={() => {
                editPlaylist(item)
              }}
              onRemove={() => {
                handleRemovePlaylist(item)
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            playLists.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há playlists cadastrados" />
          )}
        />
      )}
    </Box>
  )
}
