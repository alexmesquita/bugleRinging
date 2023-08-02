import styled from 'styled-components/native'
import Slider from '@react-native-community/slider'

export const SliderContainer = styled(Slider).attrs(({ theme }) => ({
  thumbTintColor: theme.colors.orange_700,
  maximumTrackTintColor: theme.colors.orange_300,
  minimumTrackTintColor: theme.colors.orange_700,
}))`
  width: 350px;
  height: 40px;
  margin-top: 25px;

  flex-direction: row;
`

export const TimeContainer = styled.View`
  width: 340px;

  flex-direction: row;
  justify-content: space-between;
`

export const Time = styled.Text`
  color: ${({ theme }) => theme.colors.orange_200};
`

export const LoadingIndicator = styled.ActivityIndicator``
