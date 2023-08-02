import { IconButton } from '../IconButton'
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
      <IconButton name="delete" color="red.700" onPress={onRemove} />
    </Container>
  )
}
