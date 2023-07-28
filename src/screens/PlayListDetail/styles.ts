import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};

  padding: 24px;
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
export const Form = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};

  flex-direction: row;
  justify-content: center;
  border-radius: 6px;
`
