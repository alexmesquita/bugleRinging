import { Box, Icon, Link } from 'native-base'
import { FontAwesome6, SimpleLineIcons } from '@expo/vector-icons'

type Props = {
  name: string
  url: string
  iconName: string
}

export function InformamtionCard({ name, url, iconName }: Props) {
  return (
    <Box w="full" h={14} bg="gray.500" rounded="md" mt={2}>
      <Link
        isUnderlined={false}
        _text={{
          color: 'gray.100',
          fontWeight: 'medium',
          fontSize: 'lg',
        }}
        flex={1}
        alignItems="center"
        href={url}
      >
        <Icon
          as={iconName === 'social-youtube' ? SimpleLineIcons : FontAwesome6}
          mx="3"
          color="white"
          name={iconName}
          size="lg"
        />
        {name}
      </Link>
    </Box>
  )
}
