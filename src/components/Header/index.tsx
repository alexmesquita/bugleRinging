import { Container, Logo, BackIcon, BackButton } from './styles'

import logoImg from '../../../assets/images/logo.png'

type Props = {
  showBackButton?: boolean
}

export function Header({ showBackButton = false }: Props) {
  return (
    <Container>
      {showBackButton && (
        <BackButton>
          <BackIcon size={32} />
        </BackButton>
      )}

      <Logo source={logoImg} />
    </Container>
  )
}
