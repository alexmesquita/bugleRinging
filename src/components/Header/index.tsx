import logoImg from '../../../assets/images/logo.png'
import { HStack, Image } from 'native-base'
import { IconButton } from '../IconButton'

type Props = {
  showBackButton?: boolean
}

export function Header({ showBackButton = false }: Props) {
  return (
    <HStack
      mt={6}
      w="100%"
      alignItems="center"
      justifyContent={showBackButton ? 'space-between' : 'center'}
    >
      {showBackButton && (
        <IconButton
          onPress={() => console.log("I'm Pressed back button")}
          name="arrow-back-ios"
          color="white"
          size={9}
        />
      )}
      <Image source={logoImg} w={12} h={16} alt="Bugle logo" />
    </HStack>
  )
}
