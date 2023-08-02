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
    color: ${theme.colors.orange_600};

    font-size: ${theme.fontSizes.xl}px;
    font-family: ${theme.fonts.heading};
  `}
  font-weight: 800;
`

export const Artist = styled.Text`
  ${({ theme }) => css`
    color: ${theme.colors.orange_300};
    font-size: ${theme.fontSizes.md}px;
    font-family: ${theme.fonts.body};
  `}

  text-align: center;
`
