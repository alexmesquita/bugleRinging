import { Spinner, Center } from 'native-base'

export function Loading() {
  return (
    <Center flex={1} bg="background">
      <Spinner color="orange.600" size="lg" />
    </Center>
  )
}
