import React from "react";
import * as RN from "react-native";

declare class DropShadowComponent extends React.Component {}
declare const DropShadowBase: RN.Constructor<RN.NativeMethodsMixin> &
  typeof DropShadowComponent;

export default class DropShadow extends DropShadowBase {}
