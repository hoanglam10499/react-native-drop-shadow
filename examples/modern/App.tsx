import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>React Native 0.88.1 - Fabric</Text>
      <Text>Automatic boxShadow</Text>
      <DropShadow testID="automatic-shadow" style={styles.shadow}>
        <View style={styles.box} />
      </DropShadow>
      <Text>Forced legacy shadow</Text>
      <DropShadow useLegacyShadow style={styles.shadow}>
        <View style={styles.box} />
      </DropShadow>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 24, padding: 48 },
  shadow: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  box: { width: 120, height: 120, borderRadius: 20, backgroundColor: '#4c86ee' },
});
