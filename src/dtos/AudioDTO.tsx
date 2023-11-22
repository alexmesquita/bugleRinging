import { AudioType } from '../@types/audioTypes'

export type AudioDTO = {
  id: string
  name: string
  uriAudio: string
  duration: number
  artist: string
  uriImg: string
  type: AudioType
}
