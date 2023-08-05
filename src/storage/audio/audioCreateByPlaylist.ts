import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { getAudioByPlaylist } from './getAudioByPlaylist'
import { AppError } from '../../utils/AppError'
import { AudioDTO } from './AudioDTO'

export async function audioCreateByPlaylist(
  newAudio: AudioDTO,
  playlist: string,
) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await getAudioByPlaylist(playlist)

    const audioExists = storedAudios.includes(newAudio)

    if (audioExists) {
      throw new AppError('Este toque já existe nessa playlist')
    }
    const storage = JSON.stringify([...storedAudios, newAudio])

    //@bugleRinging:audios-desfile 1:[{name: audio1, id: 0}]
    //@bugleRinging:audios-desfile 2:[name: audio3, id:2]
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
