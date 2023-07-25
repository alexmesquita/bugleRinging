import styled from 'styled-components/native'
import { MaterialIcons } from '@expo/vector-icons'

export const Icon = styled(MaterialIcons)`
  color: ${({ theme }) => theme.COLORS.ORANGE_100};
`

export const Container = styled.View`
  margin-bottom: 56px;

  flex: 1;
  flex-direction: row;
  align-items: center;
`
