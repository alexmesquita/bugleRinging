import { Input as NativeBaseInput, IInputProps, Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

type Props = IInputProps & {
  leftIcon?: string
}
export function Input({ leftIcon = '', ...rest }: Props) {
  return (
    <NativeBaseInput
      flex={1}
      minH={14}
      maxH={14}
      rounded="md"
      p={2}
      size="md"
      color="white"
      placeholderTextColor="gray.300"
      borderWidth="0"
      _focus={{
        backgroundColor: 'gray.500',
      }}
      InputLeftElement={
        leftIcon !== '' ? (
          <Icon
            as={<MaterialIcons name={leftIcon} />}
            size={6}
            color="white"
            pl={1}
          />
        ) : undefined
      }
      {...rest}
    />
  )
}
