import { FlatList } from 'react-native'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'
import { Filter } from '../../components/Filter'
import { useState } from 'react'
import { AudioCard } from '../../components/AudioCard'
import { ListEmpty } from '../../components/ListEmpty'
import { Button } from '../../components/Button'
import { Center, Heading, Box, HStack, Text } from 'native-base'

export function PlayLists() {
  const [newPlaylist, setNewPlaylist] = useState('')
  const [playList, setPlayList] = useState('PlayList 1')
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

  const removeBugle = (item: any) => {
    console.log(`Apagar toque: ${item}`)
  }
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
          <IconButton
            onPress={() => console.log("I'm Pressed add playlist button")}
            name="add"
          />
        </HStack>
      </Box>

      <Box my={4}>
        <HStack>
          <FlatList
            data={playLists}
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
              <Filter
                title={item}
                isActive={item === playList}
                onPress={() => setPlayList(item)}
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
          <AudioCard
            name={item}
            onRemove={() => {
              removeBugle(item)
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

      <Button
        title="Remover Playlist"
        type="SECONDARY"
        style={{ marginTop: 10 }}
      />
    </Box>
  )
}
