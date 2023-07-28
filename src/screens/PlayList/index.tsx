import { Container, Title, Icon, Content } from './styles'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'

export function PlayList() {
  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <Title>Playlists</Title>

        <Input placeholder="Nova Playlist" style={{ marginTop: 20 }} />
        <Button title="Criar" style={{ marginTop: 20 }} />
      </Content>
    </Container>
  )
}
