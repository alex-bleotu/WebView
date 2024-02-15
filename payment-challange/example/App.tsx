import { StyleSheet, Text, View } from 'react-native';

import * as ExpoPaymentChallange from 'expo-payment-challange';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoPaymentChallange.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
