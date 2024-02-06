import logoImg from '../../../assets/images/logo.png'
import { HStack, Image } from 'native-base'
import { IconButton } from '../IconButton'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../../routes/app.routes'

type Props = {
  showHomeButton?: boolean
}

export function Header({ showHomeButton = false }: Props) {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function goBack() {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  return (
    <HStack
      mt={6}
      w="100%"
      alignItems="center"
      justifyContent={showHomeButton ? 'space-between' : 'center'}
    >
      {showHomeButton && (
        <IconButton onPress={goBack} name="home" color="white" size={9} />
      )}
      <Image source={logoImg} w={12} h={16} alt="Bugle logo" />
    </HStack>
  )
}
