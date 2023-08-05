import { useEffect, useState } from 'react'
import { Heading, Box, Center, FlatList, HStack } from 'native-base'

import { Header } from '../../components/Header'
import { ListEmpty } from '../../components/ListEmpty'
import { AudioCard } from '../../components/AudioCard'
import { Input } from '../../components/Input'
import { IconButton } from '../../components/IconButton'

export function Audios() {
  const [audios, setAudios] = useState([
    { id: 0, name: 'toque 1', duration: 10000 },
    { id: 1, name: 'toque 2', duration: 20000 },
    { id: 2, name: 'abc 3', duration: 3000 },
    { id: 3, name: 'bcd 2', duration: 10000 },
    { id: 4, name: '123', duration: 12000 },
    { id: 5, name: '94', duration: 9000 },
    { id: 6, name: '9iol,', duration: 15000 },
    { id: 7, name: 'avsd', duration: 10000 },
    { id: 8, name: 'as', duration: 18000 },
    { id: 9, name: 'atnhsr', duration: 10000 },
    { id: 10, name: '92334', duration: 13000 },
    { id: 11, name: '9tyyt', duration: 10000 },
    { id: 12, name: '1254765', duration: 2000 },
    { id: 13, name: '9876798', duration: 1000 },
    { id: 14, name: 'sagd', duration: 7000 },
    { id: 15, name: 'baiukf', duration: 20000 },
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
        a.name > b.name ? orderToSort : b.name > a.name ? orderToSort * -1 : 0,
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
          (item) =>
            item.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1,
        ),
      )
    }
  }, [searchText])

  return (
    <Box flex={1} bg="background" px={2}>
      <Header showBackButton />

      <Center>
        <Heading mb={2} color="white">
          Toques de Corneta
        </Heading>
      </Center>

      <Box rounded="md" mb={1}>
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
      </Box>

      <FlatList
        data={filteredAudios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AudioCard
            name={item.name}
            duration={item.duration}
            onPlayPause={() => {
              console.log('play/pause: ' + item.name)
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
    </Box>
  )
}
