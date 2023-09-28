import { Platform } from 'react-native'
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { PlayLists } from '../screens/PlayLists'
import { PlayListDetail } from '../screens/PlayListDetail'
import { Audios } from '../screens/Audios'
import { AudioPlayer } from '../screens/AudioPlayer'
import { PlayListEdit } from '../screens/PlayListEdit'
import { WhatsRinging } from '../screens/WhatsRinging'
import { Metronome } from '../screens/Metronome'

import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons'
import { Icon, useTheme } from 'native-base'

type AppRoutesTypes = {
  Audios: undefined
  PlayLists: undefined
  PlayListDetail: { playList: string }
  PlayListEdit: { playList: string }
  AudioPlayer: undefined
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
        name="Audios"
        component={Audios}
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
        name="AudioPlayer"
        component={AudioPlayer}
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
    </Navigator>
  )
}
