import { Box, HStack, Icon, Text } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'

type Props = {
  name: string
  onRemove: () => void
}

export function AudioCard({ name, onRemove }: Props) {
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
        <Text color="gray.200" flex={1} fontSize="lg">
          {name}
        </Text>
        <IconButton name="delete" color="red.700" onPress={onRemove} />
      </HStack>
    </Box>
  )
}
