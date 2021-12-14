import React from "react";
import { Platform, View } from "react-native";
import { requireNativeComponent } from "react-native";

const ShadowDrop =
  Platform.OS === "android" ? requireNativeComponent("DropShadow") : View;
export default React.memo((props) => {
  return React.createElement(ShadowDrop, props);
});
