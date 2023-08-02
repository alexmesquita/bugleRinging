import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base'

type ButtonStyleProps = 'PRIMARY' | 'SECONDARY'

type Props = IButtonProps & {
  title: string
  type?: ButtonStyleProps
}

export function Button({ title, type = 'PRIMARY', ...rest }: Props) {
  return (
    <NativeBaseButton
      w="full"
      h={14}
      rounded="md"
      p={2}
      bg={type === 'PRIMARY' ? 'green.700' : 'red.700'}
      _pressed={{
        bg: type === 'PRIMARY' ? 'green.900' : 'red.900',
      }}
      {...rest}
    >
      <Heading color="white">{title}</Heading>
    </NativeBaseButton>
  )
}
