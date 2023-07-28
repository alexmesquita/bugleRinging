import styled, { css } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

export type ButtonStyleProps = 'PRIMARY' | 'SECONDARY'

type Props = {
  type: ButtonStyleProps
}

export const Container = styled(TouchableOpacity)<Props>`
  flex: 1;

  min-height: 56px;
  max-height: 56px;
  width: 100%;

  background-color: ${({ theme, type }) =>
    type === 'PRIMARY' ? theme.COLORS.GREEN_700 : theme.COLORS.RED_500};

  border-radius: 6px;
  justify-content: center;
  align-items: center;
`

export const Title = styled.Text`
  ${({ theme }) => css`
    font-size: ${theme.FONT_SIZE.MD}px;
    color: ${theme.COLORS.WHITE};
    font-family: ${theme.FONT_FAMILY.BOLD};
  `}
`
