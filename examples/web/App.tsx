import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SourceShadow from 'react-native-drop-shadow';
import ModuleShadow from 'packed-module';
import CommonJSShadow from './commonjs-entry.cjs';

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <Pressable onPress={() => setCount(count + 1)} accessibilityRole="button">
      <Text>Count {count}</Text>
    </Pressable>
  );
}

function Cases({
  Shadow,
  name,
}: {
  Shadow: typeof SourceShadow;
  name: string;
}) {
  const [override, setOverride] = React.useState(false);
  const [hasRef, setHasRef] = React.useState(false);
  const ref = React.useCallback(
    (view: React.ElementRef<typeof View> | null) => {
      setHasRef(view != null);
    },
    []
  );
  return (
    <View>
      <Text>{name}</Text>
      <Text testID={`${name}-ref`}>{hasRef ? 'mounted' : 'pending'}</Text>
      <Shadow
        ref={ref}
        testID={`${name}-converted`}
        style={[styles.shadow, styles.radiusOverride]}
      >
        <View style={styles.card}>
          <Text>Automatic shadow</Text>
        </View>
      </Shadow>
      <Shadow
        testID={`${name}-string`}
        style={[styles.shadow, styles.explicitString]}
      >
        <Text>Explicit CSS</Text>
      </Shadow>
      <Shadow
        testID={`${name}-array`}
        style={[styles.shadow, styles.explicitArray]}
      >
        <Text>Explicit array</Text>
      </Shadow>
      <Shadow testID={`${name}-default`} style={styles.defaults}>
        <Text>Defaults</Text>
      </Shadow>
      <Shadow testID={`${name}-numeric`} style={styles.numeric}>
        <Text>Numeric color</Text>
      </Shadow>
      <Shadow testID={`${name}-legacy`} useLegacyShadow style={styles.shadow}>
        <Text>Legacy override</Text>
      </Shadow>
      <Shadow
        testID={`${name}-state`}
        useLegacyShadow={override}
        style={styles.shadow}
      >
        <Counter />
      </Shadow>
      <Pressable
        testID={`${name}-toggle`}
        onPress={() => setOverride(!override)}
        accessibilityRole="button"
      >
        <Text>Toggle renderer</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.page}>
      <Cases Shadow={SourceShadow} name="source" />
      <Cases Shadow={ModuleShadow} name="module" />
      <Cases Shadow={CommonJSShadow} name="commonjs" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, backgroundColor: '#fff', gap: 32 },
  shadow: {
    borderRadius: 20,
    margin: 12,
    shadowColor: '#12345680',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  card: { padding: 24, borderRadius: 20, backgroundColor: '#4c86ee' },
  radiusOverride: { shadowRadius: 8 },
  explicitString: { boxShadow: 'inset 1px 2px 3px 4px red, 2px 3px 4px blue' },
  explicitArray: {
    boxShadow: [
      {
        offsetX: 1,
        offsetY: 2,
        blurRadius: 3,
        spreadDistance: 4,
        inset: true,
        color: 'red',
      },
    ],
  },
  defaults: { shadowRadius: 4 },
  numeric: { shadowColor: 0x12345680, shadowOpacity: 0.5, shadowRadius: 2 },
});
