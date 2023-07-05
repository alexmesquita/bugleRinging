import React, { useState } from 'react'
import { FlatList, Image, View } from 'react-native'

import TrackPlayer, {
  Event,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player'

import { playListData } from '../../constants'
import { SongInfo } from '../../components/SongInfo'
import { SongSlider } from '../../components/SongSlider'
import { ControlCenter } from '../../components/ControlCenter'

import { styles } from './styles'

const MusicPlayer = () => {
  const [track, setTrack] = useState<Track | null>()

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    switch (event.type) {
      case Event.PlaybackTrackChanged:
        setTrack(await TrackPlayer.getTrack(event.nextTrack))
        break
    }
  })

  const renderArtWork = () => {
    return (
      <View style={styles.listArtWrapper}>
        <View style={styles.albumContainer}>
          {track?.artwork && (
            <Image
              style={styles.albumArtImg}
              source={{ uri: track?.artwork?.toString() }}
            />
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={playListData}
        renderItem={renderArtWork}
        keyExtractor={(song) => song.id.toString()}
      />

      <SongInfo track={track} />
      <SongSlider />
      <ControlCenter />
    </View>
  )
}

export default MusicPlayer
