import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLAYLIST_COLLECTION } from '../storageConfig'
import { playlistGetAll } from './playlistGetAll'
import { AppError } from '../../utils/AppError'

export async function playlistCreate(newPlaylist: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedPlaylists = await playlistGetAll()

    const playListExists = storedPlaylists.includes(newPlaylist)

    if (playListExists) {
      throw new AppError('Já existe uma playlist cadastrada com esse nome')
    }
    const storage = JSON.stringify([...storedPlaylists, newPlaylist])
    await AsyncStorage.setItem(PLAYLIST_COLLECTION, storage)
  } catch (error) {
    throw error
  }
}
