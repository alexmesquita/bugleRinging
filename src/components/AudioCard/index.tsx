import { ButtonIcon } from '../ButtonIcon'
import { Container, Name, Icon } from './styles'

type Props = {
  name: string
}

export function AudioCard({ name }: Props) {
  return (
    <Container>
      <Icon name="audiotrack" />
      <Name>{name}</Name>
      <ButtonIcon icon="delete" type='SECONDARY'/>
    </Container>
  )
}
