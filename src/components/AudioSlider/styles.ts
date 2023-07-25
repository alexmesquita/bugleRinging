import styled from 'styled-components/native'
import Slider from '@react-native-community/slider'

export const SliderContainer = styled(Slider)`
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
  color: #ccc;
`
