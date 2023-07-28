import styled from 'styled-components/native'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

export type ButtonIconStyleProps = 'PRIMARY' | 'SECONDARY'

type Props = {
  type: ButtonIconStyleProps
}

export const Container = styled(TouchableOpacity)`
  height: 56px;
  width: 56px;
  margin-left: 12px;

  justify-content: center;
  align-items: center;
`
export const Icon = styled(MaterialIcons).attrs<Props>(({ theme, type }) => ({
  size: 24,
  color: type === 'PRIMARY' ? theme.COLORS.GREEN_700 : theme.COLORS.RED_700,
}))``
