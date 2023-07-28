import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacityProps } from 'react-native'
import { Container, Icon, ButtonIconStyleProps } from './styles'

type Props = TouchableOpacityProps & {
  icon: keyof typeof MaterialIcons.glyphMap
  type?: ButtonIconStyleProps
}

export function ButtonIcon({ type = 'PRIMARY', icon, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Icon name={icon} type={type} />
    </Container>
  )
}
