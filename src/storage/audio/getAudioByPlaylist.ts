import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'

export async function getAudioIdByPlaylist(playlist: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storage = await AsyncStorage.getItem(
      AUDIO_COLLECTION + '-' + playlist,
    )

    const audios: string[] = storage ? JSON.parse(storage) : []

    return audios
  } catch (error) {
    throw error
  }
}
