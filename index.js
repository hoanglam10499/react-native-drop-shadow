import React from "react";
import { Platform, requireNativeComponent, View } from "react-native";
export default (props) => {
  if (Platform.OS === "android") {
    const ShadowView = requireNativeComponent("DropShadow");
    return React.createElement(ShadowView, props);
  }
  return React.createElement(View, props);
};
