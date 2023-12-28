import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base'

type ButtonStyleProps = 'PRIMARY' | 'SUCESS' | 'ERROR'

type Props = IButtonProps & {
  title: string
  type?: ButtonStyleProps
  fontSize?: string
}

export function Button({
  title,
  type = 'PRIMARY',
  fontSize = 'md',
  ...rest
}: Props) {
  return (
    <NativeBaseButton
      w="full"
      h={14}
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
      <Heading color="white" size={fontSize} w="full">
        {title}
      </Heading>
    </NativeBaseButton>
  )
}
