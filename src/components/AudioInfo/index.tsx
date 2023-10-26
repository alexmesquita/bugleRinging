import React, { PropsWithChildren } from 'react'
import { Box, Center, HStack, Heading, Text } from 'native-base'

type SongInfoProps = PropsWithChildren<{
  title: string
  artist: string
}>

export function AudioInfo({ title, artist }: SongInfoProps) {
  return (
    <Center mt={4}>
      <HStack w="90%" justifyContent="center">
        <Box rounded="md">
          <Center>
            <Heading color="orange.600" fontSize="xl" justifyContent="center">
              {title}
            </Heading>
            <Text color="orange.300" fontSize="md" justifyContent="center">
              {artist}
            </Text>
          </Center>
        </Box>
      </HStack>
    </Center>
  )
}
