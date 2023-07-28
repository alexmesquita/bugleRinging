import { Container, Title, Form, HeaderList, NumberOfPlaylists } from './styles'
import { FlatList } from 'react-native'

import { Header } from '../../components/Header'
import { ButtonIcon } from '../../components/ButtonIcon'
import { Input } from '../../components/Input'
import { Filter } from '../../components/Filter'
import { useState } from 'react'
import { AudioCard } from '../../components/AudioCard'

export function PlayListDetail() {
  const [playList, setPlayList] = useState('PlayList 1')
  const [playLists, setPlayLists] = useState([
    'PlayList 1',
    'PlayList 2',
    'PlayList 3',
    'PlayList 4',
  ])
  const [audios, setAudios] = useState(['toque 1', 'toque 2', 'toque 3'])

  return (
    <Container>
      <Header showBackButton />

      <Title>Playlists Teste 01</Title>

      <Form>
        <Input placeholder="Nome da Playlists" />
        <ButtonIcon icon="add" />
      </Form>

      <HeaderList>
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
        <NumberOfPlaylists>{playLists.length}</NumberOfPlaylists>
      </HeaderList>

      <FlatList
        data={audios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <AudioCard name={item} />}
      />
    </Container>
  )
}
