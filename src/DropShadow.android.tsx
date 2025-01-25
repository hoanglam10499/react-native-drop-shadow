import React from 'react';
import { type ViewProps, requireNativeComponent, Platform } from 'react-native';

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
    return <NativeShadow {...this.props} />;
  }
}
