import styled from 'styled-components/native'
import Slider from '@react-native-community/slider'

export const SliderContainer = styled(Slider).attrs(({ theme }) => ({
  thumbTintColor: theme.COLORS.ORANGE_700,
  maximumTrackTintColor: theme.COLORS.ORANGE_500,
  minimumTrackTintColor: theme.COLORS.ORANGE_700,
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
  color: ${({ theme }) => theme.COLORS.GRAY_100};
`

export const LoadingIndicator = styled.ActivityIndicator``
