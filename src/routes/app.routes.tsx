import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { PlayLists } from '../screens/PlayLists'
import { PlayListDetail } from '../screens/PlayListDetail'

type AppRoutesTypes = {
  PlayLists: undefined
  PlayListDetail: { playList: string }
}

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutesTypes>

const { Navigator, Screen } = createNativeStackNavigator<AppRoutesTypes>()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="PlayLists" component={PlayLists} />
      <Screen name="PlayListDetail" component={PlayListDetail} />
    </Navigator>
  )
}
