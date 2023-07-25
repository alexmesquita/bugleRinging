import styled from 'styled-components/native'
import { Dimensions, Image } from 'react-native'

const { width } = Dimensions.get('window')

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #001d23;
`

export const ListArtWrapper = styled.View`
  width: ${width}px;
  justify-content: center;
  align-items: center;
`

export const AlbumContainer = styled.View`
  width: 300px;
  height: 300px;
`
export const AlbumArtImg = styled(Image)`
  height: 100%;
  border-radius: 4px;
`
