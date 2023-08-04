import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { audioGetByPlaylist } from './audioGetByPlaylist'
import { AppError } from '../../utils/AppError'

export async function audioCreateByPlaylist(
  newAudio: string,
  playlist: string,
) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await audioGetByPlaylist(playlist)

    const audioExists = storedAudios.includes(newAudio)

    if (audioExists) {
      throw new AppError('Este toque já existe nessa playlist')
    }
    const storage = JSON.stringify([...storedAudios, newAudio])
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
