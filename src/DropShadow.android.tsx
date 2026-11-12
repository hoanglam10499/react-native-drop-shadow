import React from 'react';
import { View, type ViewProps, requireNativeComponent } from 'react-native';
import { getBoxShadowStyle } from './boxShadow';
import type { DropShadowProps } from './types';
import { useShadowRef } from './useShadowRef';

const NativeShadow = requireNativeComponent<ViewProps>('DropShadow');

export const DropShadow: React.ForwardRefExoticComponent<
  DropShadowProps & React.RefAttributes<React.ElementRef<typeof View>>
> = React.forwardRef<React.ElementRef<typeof View>, DropShadowProps>(
  ({ useLegacyShadow, ...props }, forwardedRef) => {
    const { ref, isFabric } = useShadowRef(forwardedRef);
    const style = useLegacyShadow
      ? null
      : getBoxShadowStyle(props.style, isFabric);
    if (style != null) {
      return <View {...props} ref={ref} style={style} />;
    }
    return <NativeShadow {...props} ref={ref} />;
  }
);
