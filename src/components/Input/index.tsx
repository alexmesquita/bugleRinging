import { Input as NativeBaseInput, IInputProps } from 'native-base'

export function Input({ ...rest }: IInputProps) {
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
      {...rest}
    />
  )
}
