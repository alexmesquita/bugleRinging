import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { getAudioIdByPlaylist } from './getAudioByPlaylist'
import { AppError } from '../../utils/AppError'

export async function audioCreateByPlaylist(
  newAudioId: string,
  playlist: string,
) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await getAudioIdByPlaylist(playlist)

    const audioExists = storedAudios.includes(newAudioId)

    if (audioExists) {
      throw new AppError('Este toque já existe nessa playlist')
    }
    const storage = JSON.stringify([...storedAudios, newAudioId])

    // @bugleRinging:audios-desfile 1:[0]
    // @bugleRinging:audios-desfile 2:[2, 0]
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
