import { Text, View } from 'react-native';
import { Ringing } from '../../componets/Ringing';

import { styles } from './styles';

export function RingingList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Lista de toques
      </Text>

      <Ringing />
      <Ringing />
      <Ringing />
      <Ringing />
    </View>
  )
}