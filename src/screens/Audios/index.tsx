import { Heading, Box, Text, Center, FlatList, HStack } from 'native-base'
import { Header } from '../../components/Header'
import { useEffect, useState } from 'react'
import { ListEmpty } from '../../components/ListEmpty'
import { AudioCard } from '../../components/AudioCard'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'

export function Audios() {
  const [audios, setAudios] = useState([
    'toque 1',
    'toque 2',
    'abc 3',
    'bcd 2',
    '123',
    '94',
    '9iol,',
    'avsd',
    'as',
    'atnhsr',
    '92334',
    '9tyyt',
    '1254765',
    '9876798',
    'sagd',
    'baiukf'
  ])
  const [filteredAudios, setFilteredAudios] = useState(audios)
  const [searchText, setSearchText] = useState('')
  const [orderToSort, setOrderToSort] = useState(1)

  async function getAudios() {
    try {
      console.log('Getting bubles')
    } catch (error) {
      console.log(error)
    }
  }

  function orderList() {
    setFilteredAudios(
      filteredAudios.sort((a, b) =>
        a > b ? orderToSort : b > a ? orderToSort * -1 : 0,
      ),
    )

    setOrderToSort(orderToSort * -1)
  }

  useEffect(() => {
    if (searchText === '') {
      setFilteredAudios(audios)
    } else {
      setFilteredAudios(
        audios.filter(
          (item) => item.toUpperCase().indexOf(searchText.toUpperCase()) > -1,
        ),
      )
    }
  }, [searchText])

  return (
    <Box flex={1} bg="background">
      <Header showBackButton />

      <Center>
        <Heading mb={2} color="white">
          Toques de Corneta
        </Heading>
      </Center>

      <Box bg="gray.500" rounded="md">
        <HStack>
          <Input
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Pesquise um toque de corneta"
          />
          <IconButton onPress={orderList} name="sort-by-alpha" />
        </HStack>
      </Box>

      <FlatList
        data={filteredAudios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <AudioCard
            name={item}
            onPlayPause={() => {
              console.log('play/pause: ' + item)
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          filteredAudios.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há toques cadastrados" />
        )}
      />

      {/* <Box bg="gray.500" rounded="md">
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
          <AudioCard
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

      <Button title="Remover Playlist" type="SECONDARY" mt={2} /> */}
    </Box>
  )
}
