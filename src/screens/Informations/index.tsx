import { useNavigation } from '@react-navigation/native'

import { Center, Heading, Box, FlatList } from 'native-base'

import { Header } from '../../components/Header'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'
import { ListEmpty } from '../../components/ListEmpty'
import { InformamtionCard } from '../../components/InformationCard'
import { informationsInfos } from '../../storage/informationsInfos/infos'

export function Informations() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  return (
    <Box flex={1} bg="background" px={2} pb={2}>
      <Header showHomeButton={navigation.canGoBack()} />

      <Center>
        <Heading mb={2} color="white">
          Anexos
        </Heading>
      </Center>

      <FlatList
        data={informationsInfos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <InformamtionCard
              name={item.name}
              url={item.url}
              iconName={item.iconName}
            />
          </>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          informationsInfos.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há anexos cadastrados" />
        )}
      />
    </Box>
  )
}
