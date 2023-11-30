import { Box, Divider, FlatList, HStack, VStack } from 'native-base'
import { AudioDTO } from '../../dtos/AudioDTO'
import { Button } from '../Button'
import { ListEmpty } from '../ListEmpty'

type Props = {
  bugles: Array<AudioDTO>
  answerId: string
  shotId: string
  status: string
  answerQuestion: Function
}

function checkType(
  id: string,
  status: string,
  answerId: string,
  shotId: string,
) {
  if (status === 'UNANSWERED') {
    return 'PRIMARY'
  } else if (status === 'HIT') {
    if (id === answerId) return 'SUCESS'
    else return 'PRIMARY'
  } else {
    if (id === answerId) return 'SUCESS'
    else if (id === shotId) return 'ERROR'
    else return 'PRIMARY'
  }
}

export function QuestionCard({
  bugles,
  answerId,
  shotId,
  status,
  answerQuestion,
}: Props) {
  return (
    <Box w="full" h={14} rounded="md" mt={2}>
      <HStack alignItems="center" space={3} divider={<Divider />} w="90%">
        <FlatList
          data={bugles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VStack justifyContent="space-between">
              <Button
                type={checkType(item.id, status, answerId, shotId)}
                title={item.name}
                onPress={() => {
                  answerQuestion(item)
                }}
              />
            </VStack>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            bugles.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={() => (
            <ListEmpty message="Não foi possível carregar as alternativas" />
          )}
        />
      </HStack>
    </Box>
  )
}
