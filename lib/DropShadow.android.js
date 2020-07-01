// @flow
import React from "react";
import { requireNativeComponent } from "react-native";

const ShadowView = requireNativeComponent("DropShadow");

export default React.memo((props) => {
  return <ShadowView {...props} />;
});
