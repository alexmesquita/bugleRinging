import {
  IconButton as NativeBaseIconButton,
  IIconButtonProps,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

type Props = IIconButtonProps & {
  name: string
  color?: string
  size?: number
}

export function IconButton({
  name,
  color = 'green.700',
  size = 7,
  ...rest
}: Props) {
  return (
    <NativeBaseIconButton
      _icon={{
        name,
        color,
        size,
        as: MaterialIcons,
      }}
      {...rest}
    />
  )
}
