import React from 'react';
import { type ViewProps } from 'react-native';
import { NativeShadow } from './NativeShadow';

export class DropShadow extends React.Component<ViewProps> {
  render(): React.ReactNode {
    return <NativeShadow {...this.props} />;
  }
}
