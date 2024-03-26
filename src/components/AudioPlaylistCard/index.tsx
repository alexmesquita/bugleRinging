import { Box, HStack, Icon, Text } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'

type CardTypeProps = 'ADD' | 'REMOVE'

type Props = {
  name: string
  action: () => void
  type?: CardTypeProps
}

export function AudioPlaylistCard({ name, type, action }: Props) {
  return (
    <Box w="full" h={14} bg="gray.500" rounded="md" mt={2}>
      <HStack alignItems="center">
        <Icon
          as={MaterialIcons}
          name="audiotrack"
          size={7}
          alignItems="center"
          mx={1}
        />
        <Text color="gray.100" justifyContent="center" flex={1} fontSize="lg">
          {name}
        </Text>
        <IconButton
          name={type === 'ADD' ? 'add' : 'delete'}
          color={type === 'ADD' ? 'green.700' : 'red.700'}
          onPressIn={action}
        />
      </HStack>
    </Box>
  )
}
