import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

import { Container, Name, Artist } from './styles'

type SongInfoProps = PropsWithChildren<{
  title: string
  artist: string
  album: string
}>

export function AudioInfo({ title, artist, album }: SongInfoProps) {
  return (
    <Container>
      <View>
        <Name>{title}</Name>
        <Artist>
          {artist} . {album}
        </Artist>
      </View>
    </Container>
  )
}
