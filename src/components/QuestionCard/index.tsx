import { Box, FlatList } from 'native-base'
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
    <Box rounded="md" mt={2} >
      <FlatList
        data={bugles}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Button
            w="47.5%"
            fontSize="sm"
            m={1}
            type={checkType(item.id, status, answerId, shotId)}
            title={item.name}
            onPress={() => {
              answerQuestion(item.id)
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 20 },
          bugles.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={() => (
          <ListEmpty message="Não foi possível carregar as alternativas" />
        )}
      />
    </Box>
  )
}
