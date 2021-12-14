import { Constructor, ViewProps, NativeMethodsMixin } from 'react-native';
import React from 'react';

export interface PropsView extends ViewProps {}
declare class DropShadowComponent extends React.Component<PropsView> {}
declare const DropShadowBase: Constructor<NativeMethodsMixin> &
  typeof DropShadowComponent;

export default class DropShadow extends DropShadowBase {}
