import * as React from 'react';
import { View, StyleSheet, Text, Platform, Image } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function App() {
  const uiManager = global?.nativeFabricUIManager ? 'Fabric' : 'Paper';

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Text
        style={{ textAlign: 'right', marginRight: 15 }}
      >{`Using ${uiManager}`}</Text>
      <View style={styles.container}>
        <DropShadow style={styles.shadow}>
          <View style={styles.box} />
        </DropShadow>

        <DropShadow style={styles.shadow2}>
          <Image
            source={{
              uri: 'https://fastly.picsum.photos/id/295/200/200.jpg?hmac=nsWHMt5f11TALPFeS_0t6tIlO2CkViBNAbAbSlhu8P4',
            }}
            style={{ height: 200, width: 200 }}
          />
        </DropShadow>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { height: 200, width: 200, backgroundColor: 'red' },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  shadow2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    marginTop: 25,
  },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
