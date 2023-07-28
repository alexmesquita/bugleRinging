import { Container, Title, Form } from './styles'

import { Header } from '../../components/Header'
import { ButtonIcon } from '../../components/ButtonIcon'
import { Input } from '../../components/Input'

export function PlayListDetail() {
  return (
    <Container>
      <Header showBackButton />

      <Title>Playlists Teste 01</Title>

      <Form>
        <Input placeholder="Nome da Playlists" />
        <ButtonIcon icon="add" />
      </Form>
    </Container>
  )
}
