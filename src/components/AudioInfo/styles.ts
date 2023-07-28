import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  width: 90%;
  margin-top: 18px;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
`

export const Name = styled.Text`
  margin-bottom: 8px;
  text-align: center;

  ${({ theme }) => css`
    color: ${theme.COLORS.ORANGE_600};

    font-size: ${theme.FONT_SIZE.XL}px;
    font-family: ${theme.FONT_FAMILY.BOLD};
  `}
  font-weight: 800;
`

export const Artist = styled.Text`
  ${({ theme }) => css`
    color: ${theme.COLORS.ORANGE_300};
    font-size: ${theme.FONT_SIZE.MD}px;
    font-family: ${theme.FONT_FAMILY.REGULAR};
  `}

  text-align: center;
`
