import React from "react";
import * as RN from "react-native";

export interface PropsView extends RN.ViewProps {}
declare class DropShadowComponent extends React.Component<PropsView> {}
declare const DropShadowBase: RN.Constructor<RN.NativeMethodsMixin> &
  typeof DropShadowComponent;

export default class DropShadow extends DropShadowBase {}
