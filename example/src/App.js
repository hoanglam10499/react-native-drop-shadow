import * as React from 'react';

import { View } from 'react-native';
import DropShadow from '../..';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <DropShadow
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 5,
        }}
      >
        <View style={{ height: 50, width: 50, backgroundColor: 'red' }} />
      </DropShadow>
    </View>
  );
}
