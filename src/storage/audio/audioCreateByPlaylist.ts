import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { getAudioIdByPlaylist } from './getAudioByPlaylist'
import { AudioType } from '../../@types/audioTypes'

export type storageAudioInPlaylistProps = {
  id: string
  audioType: AudioType
}

export async function audioCreateByPlaylist(
  audioId: string,
  audioType: AudioType,
  playlist: string,
) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await getAudioIdByPlaylist(playlist)

    const data = { id: audioId, audioType } as storageAudioInPlaylistProps

    const storage = JSON.stringify([...storedAudios, data])

    // @bugleRinging:audios-desfile 1:[{id: '0', audioType: 'BUGLE'}]
    // @bugleRinging:audios-desfile 2:[{id: '2', audioType: 'MUSIC'}, {id: '0', audioType: 'BUGLE'}]
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
