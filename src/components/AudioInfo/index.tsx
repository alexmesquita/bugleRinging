import React, { PropsWithChildren } from 'react'
import { View, Text } from 'react-native'

import { styles } from './styles'

type SongInfoProps = PropsWithChildren<{
  title: string
  artist: string
  album: string
}>

export function AudioInfo({ title, artist, album }: SongInfoProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.artist}>
          {artist} . {album}
        </Text>
      </View>
    </View>
  )
}
