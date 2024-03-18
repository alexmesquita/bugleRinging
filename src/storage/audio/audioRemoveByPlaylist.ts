import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUDIO_COLLECTION } from '../storageConfig'
import { getAudioIdByPlaylist } from './getAudioByPlaylist'

export async function audioRemoveByPlaylist(index: number, playlist: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const storedAudios = await getAudioIdByPlaylist(playlist)

    console.log(JSON.stringify(storedAudios))

    storedAudios.splice(index, 1)

    const storage = JSON.stringify(storedAudios)

    // @bugleRinging:audios-desfile 1:[0]
    // @bugleRinging:audios-desfile 2:[2, 0]
    await AsyncStorage.setItem(AUDIO_COLLECTION + '-' + playlist, storage)
  } catch (error) {
    throw error
  }
}
