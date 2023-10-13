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

import { buglesData } from '../../storage/audiosInfos/bugles/infos'
import { buglesUrls } from '../../storage/audiosInfos/bugles/urls'
import { useAssets } from 'expo-asset'
import { selectAudio } from '../../services/AudioController'
import { AudioDTO } from '../../dtos/AudioDTO'

export function Bugles() {
  const [filteredAudios, setFilteredAudios] = useState(buglesData)
  const [searchText, setSearchText] = useState('')
  const [orderToSort, setOrderToSort] = useState(1)
  const [isLoading, setIsloading] = useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [assets, assetError] = useAssets(buglesUrls)
  const toast = useToast()
  const audioPlayerContext = useAudioPlayer()

  async function getAudiosUris() {
    try {
      setIsloading(true)
      if (assets && assets.length === buglesData.length) {
        buglesData.forEach((value, index) => {
          value.uri = assets[index].uri
        })
        updateAudiosContext()
      }
    } catch (error) {
      toast.show({
        title: 'Não foi possível buscar os Toques.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
      console.log('assetError: ' + assetError)
    } finally {
      setIsloading(false)
    }
  }

  function updateAudiosContext() {
    try {
      setIsloading(true)
      audioPlayerContext.audioPlayer.audioFiles = buglesData
      audioPlayerContext.setAudioPlayer(audioPlayerContext.audioPlayer)
    } catch (error) {
      toast.show({
        title: 'Não foi possível atualizar Toques.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
      console.log('assetError: ' + assetError)
    } finally {
      setIsloading(false)
    }
  }

  async function handlePlayPause(bugle: AudioDTO) {
    console.log(bugle)
    await selectAudio(bugle, audioPlayerContext)
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
        setFilteredAudios(buglesData)
      } else {
        setFilteredAudios(
          buglesData.filter(
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

  useEffect(() => {
    getAudiosUris()
  }, [assets])

  // TODO verificar se precisa atualizar o audioFiles do contexto quando trocar de tela
  useFocusEffect(
    useCallback(() => {
      console.log(
        'useFocusEffect executou para buscar Atualizar os audios no contexto',
      )
      updateAudiosContext()
    }, []),
  )

  return (
    <Box flex={1} bg="background" px={2}>
      <Header showBackButton={navigation.canGoBack()} />

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
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={filteredAudios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AudioCard
              name={item.name}
              duration={item.duration}
              onPlayPause={() => {
                handlePlayPause(item)
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
      )}
    </Box>
  )
}
