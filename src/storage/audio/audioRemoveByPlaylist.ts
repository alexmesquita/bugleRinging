import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { getAudioByPlaylist } from './getAudioByPlaylist'

export async function audioRemoveByPlaylist(audioId: string, playlist: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await getAudioByPlaylist(playlist)

    const filtered = storedAudios.filter((item) => item.id !== audioId)

    const storage = JSON.stringify(filtered)

    // @bugleRinging:audios-desfile 1:[{name: audio1, id: 0}]
    // @bugleRinging:audios-desfile 2:[name: audio3, id:2]
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
