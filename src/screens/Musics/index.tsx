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

import { musicsData } from '../../storage/audiosInfos/musics/infos'
import { urlsMusics } from '../../storage/audiosInfos/musics/urlsMusics'
import { urlsImgs } from '../../storage/audiosInfos/musics/urlsImgs'
import { useAssets } from 'expo-asset'
import { selectAudio } from '../../services/AudioController'
import { AudioDTO } from '../../dtos/AudioDTO'
import { AudioPlayerDataProps } from '../../contexts/AudioContext'

export function Musics() {
  const [filteredAudios, setFilteredAudios] = useState(musicsData)
  const [searchText, setSearchText] = useState('')
  const [orderToSort, setOrderToSort] = useState(1)
  const [isLoading, setIsloading] = useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [musicsAssets, musicsAssetError] = useAssets(urlsMusics)
  const [imgsAssets, imgsAssetError] = useAssets(urlsImgs)
  const toast = useToast()
  const audioPlayerContext = useAudioPlayer()

  async function getAudiosUris() {
    try {
      setIsloading(true)
      if (musicsAssets && musicsAssets.length === musicsData.length) {
        musicsData.forEach((value, index) => {
          value.uriAudio = musicsAssets[index].uri
        })
      }
      if (imgsAssets && imgsAssets.length === musicsData.length) {
        musicsData.forEach((value, index) => {
          value.uriImg = imgsAssets[index].uri
        })
      }
      updateAudiosContext()
    } catch (error) {
      toast.show({
        title: 'Não foi possível buscar os Hinos e Canções.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
      console.log('assetError: ' + musicsAssetError)
      console.log('assetError: ' + imgsAssetError)
    } finally {
      setIsloading(false)
    }
  }

  function updateAudiosContext() {
    try {
      setIsloading(true)

      const newState = audioPlayerContext.audioPlayer

      newState.musicFiles = musicsData
      newState.isPlayNext = true
      newState.audioType = 'MUSIC'
      console.log(newState.musicFiles)

      audioPlayerContext.setAudioPlayer(
        (audioPlayer: AudioPlayerDataProps) => ({
          ...audioPlayer,
          ...newState,
        }),
      )
    } catch (error) {
      toast.show({
        title: 'Não foi possível atualizar Toques.',
        placement: 'top',
        bgColor: 'red.500',
      })
      console.log(error)
      console.log('assetError: ' + musicsAssetError)
      console.log('assetError: ' + imgsAssetError)
    } finally {
      setIsloading(false)
    }
  }

  async function goToMusicPlayer(music: AudioDTO) {
    console.log(`MusicPlayer: ${music.id}-${music.name}`)
    navigation.navigate('MusicPlayer', { musicId: music.id })
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
        setFilteredAudios(musicsData)
      } else {
        setFilteredAudios(
          musicsData.filter(
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
  }, [musicsAssets, imgsAssets])

  // TODO verificar se precisa atualizar o audioFiles do contexto quando trocar de tela
  useFocusEffect(
    useCallback(() => {
      console.log(
        'useFocusEffect executou para buscar Atualizar os audios no contexto',
      )
      updateAudiosContext()
      return () => {
        // TODO unsubscribe, tentar pausar o audio se mudar de tela
      }
    }, []),
  )

  return (
    <Box flex={1} bg="background" px={2}>
      <Header showBackButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          Hinos e Canções
        </Heading>
      </Center>

      <Box rounded="md" mb={1}>
        <HStack>
          <Input
            leftIcon="search"
            bg="gray.500"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Pesquise um hino ou canção"
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
      </Box>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={filteredAudios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AudioCard
              audioId={item.id}
              name={item.name}
              duration={item.duration}
              audioType="MUSIC"
              onPlayPause={() => {
                goToMusicPlayer(item)
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            filteredAudios.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há hinos ou canções cadastradas" />
          )}
        />
      )}
    </Box>
  )
}
