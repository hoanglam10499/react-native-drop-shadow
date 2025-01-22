import React from 'react';
import type { ViewProps } from 'react-native';
import { requireNativeComponent, Platform, View } from 'react-native';

const NativeShadow = requireNativeComponent<ViewProps>('DropShadow');

const LINKING_ERROR =
  `The package 'react-native-drop-shadow' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export class DropShadow extends React.Component<ViewProps> {
  render(): React.ReactNode {
    if (NativeShadow == null) {
      throw new Error(LINKING_ERROR);
    }
    if (Platform.OS === 'ios') {
      return <View {...this.props} />;
    }
    return <NativeShadow {...this.props} />;
  }
}
