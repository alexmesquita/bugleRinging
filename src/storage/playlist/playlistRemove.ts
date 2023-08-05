import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLAYLIST_COLLECTION, AUDIO_COLLECTION } from '../storageConfig'
import { playlistGetAll } from './playlistGetAll'
import { AppError } from '../../utils/AppError'

export async function playlistRemove(playlistToDelete: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedPlaylists = await playlistGetAll()
    const newPlaylist = storedPlaylists.filter(
      (playlist: string) => playlist !== playlistToDelete,
    )

    if (newPlaylist.length === storedPlaylists.length) {
      throw new AppError('Playlist não encontrada')
    }
    const storage = JSON.stringify(newPlaylist)
    await AsyncStorage.removeItem(AUDIO_COLLECTION + '-' + playlistToDelete)
    await AsyncStorage.setItem(PLAYLIST_COLLECTION, storage)
  } catch (error) {
    throw error
  }
}
