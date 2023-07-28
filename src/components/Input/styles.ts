import styled, { css } from 'styled-components/native'
import { TextInput } from 'react-native'

export const Container = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.COLORS.GRAY_300,
}))`
  flex: 1;
  min-height: 56px;
  max-height: 56px;

  ${({ theme }) => css`
    background-color: ${theme.COLORS.GRAY_500};
    color: ${theme.COLORS.WHITE};

    font-size: ${theme.FONT_SIZE.MD}px;
    font-family: ${theme.FONT_FAMILY.REGULAR};
  `}

  border-radius: 6px;
  padding: 16px;
`
