import styled, { css } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

export type FilterStyleProps = { isActive?: boolean }

// type Props = {
//   type: ButtonStyleProps
// }

export const Container = styled(TouchableOpacity)<FilterStyleProps>`
  ${({ theme, isActive }) =>
    isActive &&
    css`
      border: 1px solid ${theme.colors.green_700};
    `};
  border-radius: 4px;
  margin-right: 12px;

  height: 38px;
  width: 100px;

  align-items: center;
  justify-content: center;
`

export const Title = styled.Text`
  text-transform: uppercase;

  ${({ theme }) => css`
    color: ${theme.colors.white};
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.sm}px;
  `}
`
