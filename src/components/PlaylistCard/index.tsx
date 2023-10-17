import { Box, HStack, Icon, Pressable, Text } from 'native-base'
import { IconButton } from '../IconButton'
import { MaterialIcons } from '@expo/vector-icons'

type Props = {
  name: string
  onDetail: () => void
  onEdit: () => void
  onRemove: () => void
}

export function PlaylistCard({ name, onDetail, onEdit, onRemove }: Props) {
  return (
    <Box w="full" h={14} bg="gray.500" rounded="md" mt={2}>
      <HStack alignItems="center">
        <Pressable rounded="md" flex={1} onPress={onDetail}>
          <HStack alignItems="center">
            <Icon
              as={MaterialIcons}
              name="playlist-play"
              size={7}
              alignItems="center"
              mx={1}
            />
            <Text
              color="gray.200"
              justifyContent="center"
              flex={1}
              fontSize="lg"
            >
              {name}
            </Text>
          </HStack>
        </Pressable>

        <IconButton name="edit" color="white" onPress={onEdit} />
        <IconButton name="delete" color="red.700" onPress={onRemove} />
      </HStack>
    </Box>
  )
}
