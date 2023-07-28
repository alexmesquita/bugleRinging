import styled, { css } from 'styled-components/native'
import { Playlist } from 'phosphor-react-native'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};

  padding: 24px;
`

export const Content = styled.View`
  flex: 1;
  justify-content: center;
`

export const Title = styled.Text`
  margin-bottom: 8px;
  text-align: center;

  ${({ theme }) => css`
    color: ${theme.COLORS.WHITE};

    font-size: ${theme.FONT_SIZE.XL}px;
    font-family: ${theme.FONT_FAMILY.BOLD};
  `}
  font-weight: 800;
`
export const Icon = styled(Playlist).attrs(({ theme }) => ({
  size: 56,
  color: theme.COLORS.ORANGE_700,
}))`
  align-self: center;
  background-color: theme.COLORS.ORANGE_100;
`
