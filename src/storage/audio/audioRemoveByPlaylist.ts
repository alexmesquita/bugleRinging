import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { getAudioIdByPlaylist } from './getAudioByPlaylist'

export async function audioRemoveByPlaylist(audioId: string, playlist: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await getAudioIdByPlaylist(playlist)

    const filtered = storedAudios.filter((id) => id !== audioId)

    const storage = JSON.stringify(filtered)

    // @bugleRinging:audios-desfile 1:[0]
    // @bugleRinging:audios-desfile 2:[2, 0]
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
