import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLAYLIST_COLLECTION } from '../storageConfig'
import { playlistGetAll } from './playlistGetAll'
import { AppError } from '../../utils/AppError'

export async function playlistRemove(playlist: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedPlaylists = await playlistGetAll()
    const newPlaylist = storedPlaylists.filter(
      (item: string) => item !== playlist,
    )

    if (newPlaylist.length === storedPlaylists.length) {
      throw new AppError('Playlist não encontrada')
    }
    const storage = JSON.stringify(newPlaylist)
    await AsyncStorage.setItem(PLAYLIST_COLLECTION, storage)
    //TODO pagar audios dessa playlist
  } catch (error) {
    throw error
  }
}
