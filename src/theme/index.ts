import { extendTheme } from 'native-base'

export const THEME = extendTheme({
  colors: {
    white: '#FFFFFF',
    black: '#000000',

    background: '#202024',

    orange: {
      700: '#E55807',
      600: '#E57C23',
      500: '#E8AA42',
      300: '#F1C27B',
      200: '#FFD89C',
      100: '#FFFEC4',
    },
    green: {
      700: '#00875F',
      500: '#00B37E',
    },
    red: {
      700: '#AA2834',
      500: '#F75A68',
    },
    gray: {
      700: '#121214',
      500: '#29292E',
      300: '#7C7C8A',
      200: '#C4C4CC',
      100: '#E1E1E6',
    },

    orange_700: '#E55807',
    orange_600: '#E57C23',
    orange_500: '#E8AA42',
    orange_300: '#F1C27B',
    orange_200: '#FFD89C',
    orange_100: '#FFFEC4',
    green_700: '#00875F',
    green_500: '#00B37E',
    red_700: '#AA2834',
    red_500: '#F75A68',
    gray_700: '#121214',
    gray_500: '#29292E',
    gray_300: '#7C7C8A',
    gray_200: '#C4C4CC',
    gray_100: '#E1E1E6',
  },
  fonts: {
    body: 'Roboto_400Regular',
    heading: 'Roboto_700Bold',
  },
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
  },
  sizes: {
    14: 56,
    33: 148,
  },
})
