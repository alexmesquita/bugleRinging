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
    type === 'PRIMARY' ? theme.colors.green_700 : theme.colors.red_500};

  border-radius: 6px;
  justify-content: center;
  align-items: center;
`

export const Title = styled.Text`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes.md}px;
    color: ${theme.colors.white};
    font-family: ${theme.fonts.heading};
  `}
`
