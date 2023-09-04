import { useNavigation } from '@react-navigation/native'

import { Center, Heading, Box } from 'native-base'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'

export function Metronome() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showBackButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          Metronome screen
        </Heading>
      </Center>
    </Box>
  )
}
