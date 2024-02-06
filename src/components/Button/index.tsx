import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base'
import { Text } from 'react-native'

type ButtonStyleProps = 'PRIMARY' | 'SUCESS' | 'ERROR'

type Props = IButtonProps & {
  title: string
  type?: ButtonStyleProps
  fontSize?: number
}

export function Button({
  title,
  type = 'PRIMARY',
  fontSize = 15,
  ...rest
}: Props) {
  return (
    <NativeBaseButton
      w="full"
      h={16}
      rounded="md"
      p={2}
      bg={
        type === 'PRIMARY'
          ? 'gray.300'
          : type === 'SUCESS'
          ? 'green.700'
          : 'red.700'
      }
      _pressed={{
        bg:
          type === 'PRIMARY'
            ? 'gray.500'
            : type === 'SUCESS'
            ? 'green.900'
            : 'red.900',
      }}
      {...rest}
    >
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize,
          textAlign: 'center',
        }}
        numberOfLines={2}
        ellipsizeMode="head"
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}
