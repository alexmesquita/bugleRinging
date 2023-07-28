import { ButtonIcon } from '../ButtonIcon'
import { Container, Name, Icon } from './styles'

type Props = {
  name: string
  onRemove: () => void
}

export function AudioCard({ name, onRemove }: Props) {
  return (
    <Container>
      <Icon name="audiotrack" />
      <Name>{name}</Name>
      <ButtonIcon icon="delete" type="SECONDARY" onPress={onRemove} />
    </Container>
  )
}
