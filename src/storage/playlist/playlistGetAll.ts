import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLAYLIST_COLLECTION } from '../storageConfig'

export async function playlistGetAll() {
  // eslint-disable-next-line no-useless-catch
  try {
    const storage = await AsyncStorage.getItem(PLAYLIST_COLLECTION)

    const playlists = storage ? JSON.parse(storage) : []

    return playlists
  } catch (error) {
    throw error
  }
}
