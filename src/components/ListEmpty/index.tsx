import { Box, Center, Text } from 'native-base'

type Props = {
  message: string
}

export function ListEmpty({ message }: Props) {
  return (
    <Box flex={1} justifyContent="center">
      <Center>
        <Text color="gray.300">{message}</Text>
      </Center>
    </Box>
  )
}
