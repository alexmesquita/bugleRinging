import { Center, Heading, Pressable, IPressableProps } from 'native-base'

type Props = IPressableProps & {
  isActive?: boolean
  title: string
}

export function Filter({ title, isActive = false, ...rest }: Props) {
  return (
    <Pressable
      borderWidth={isActive ? 1 : 0}
      borderColor="green.700"
      rounded="md"
      h={9}
      w={24}
      overflow="hidden"
      justifyContent="center"
      {...rest}
    >
      <Center>
        <Heading textTransform="uppercase" color="white" fontSize="sm">
          {title}
        </Heading>
      </Center>
    </Pressable>
  )
}
