import styled from 'styled-components/native'

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
  color: ${({ theme }) => theme.COLORS.ORANGE_700};
  font-size: 24px;
  font-weight: 800;
`

export const Artist = styled.Text`
  color: ${({ theme }) => theme.COLORS.ORANGE_300};
  text-align: center;
`
