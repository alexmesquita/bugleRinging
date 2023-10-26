import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { PlayLists } from '../screens/PlayLists'
import { PlayListDetail } from '../screens/PlayListDetail'
import { Bugles } from '../screens/Bugles'
import { MusicPlayer } from '../screens/MusicPlayer'
import { PlayListEdit } from '../screens/PlayListEdit'
import { WhatsRinging } from '../screens/WhatsRinging'
import { Metronome } from '../screens/Metronome'

import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons'
import { Icon, useTheme } from 'native-base'
import { Musics } from '../screens/Musics'

type AppRoutesTypes = {
  Bugles: undefined
  Musics: undefined
  PlayLists: undefined
  PlayListDetail: { playList: string }
  PlayListEdit: { playList: string }
  MusicPlayer: undefined
  WhatsRinging: undefined
  Metronome: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesTypes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesTypes>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()
  const iconSize = sizes[1.5]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange[600],
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          marginBottom: sizes[2],
          marginTop: sizes[1],
        },
      }}
    >
      <Screen
        name="Bugles"
        component={Bugles}
        options={{
          tabBarLabel: 'Toques',
          tabBarIcon: ({ color }) => (
            <Icon
              as={MaterialCommunityIcons}
              name="bugle"
              size={iconSize}
              color={color}
              alignItems="center"
              mx={1}
            />
          ),
        }}
      />
      <Screen
        name="PlayLists"
        component={PlayLists}
        options={{
          tabBarLabel: 'Playlists',
          tabBarIcon: ({ color }) => (
            <Icon
              as={MaterialIcons}
              name="queue-music"
              size={iconSize}
              color={color}
              alignItems="center"
              mx={1}
            />
          ),
        }}
        // MaterialIcons: queue-music, playlist-add, playlist-play, playlist-remove
      />
      <Screen
        name="PlayListDetail"
        component={PlayListDetail}
        options={{ tabBarButton: () => null }}
      />
      <Screen
        name="PlayListEdit"
        component={PlayListEdit}
        options={{ tabBarButton: () => null }}
      />
      <Screen
        name="WhatsRinging"
        component={WhatsRinging}
        options={{
          tabBarLabel: 'Desafio',
          tabBarIcon: ({ color }) => (
            <Icon
              as={Entypo}
              name="trophy"
              size={iconSize}
              color={color}
              alignItems="center"
              mx={1}
            />
          ),
        }}
      />
      <Screen
        name="Metronome"
        component={Metronome}
        options={{
          tabBarLabel: 'Metrônomo',
          tabBarIcon: ({ color }) => (
            <Icon
              as={Entypo}
              name="gauge"
              size={iconSize}
              color={color}
              alignItems="center"
              mx={1}
            />
          ),
        }}
      />
      <Screen
        name="Musics"
        component={Musics}
        options={{
          tabBarLabel: 'Canções',
          tabBarIcon: ({ color }) => (
            <Icon
              as={MaterialIcons}
              name="library-music"
              size={iconSize}
              color={color}
              alignItems="center"
              mx={1}
            />
          ),
        }}
      />
      <Screen
        name="MusicPlayer"
        component={MusicPlayer}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}
