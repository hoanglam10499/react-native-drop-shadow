import * as React from 'react';

import { View, StyleSheet } from 'react-native';
import DropShadow from 'react-native-drop-shadow';

export default function App() {
  return (
    <View style={styles.container}>
      <DropShadow style={styles.shadow}>
        <View style={styles.box} />
      </DropShadow>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { height: 50, width: 50, backgroundColor: 'red' },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
