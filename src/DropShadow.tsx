import React from 'react';
import { Platform, View } from 'react-native';
import { getBoxShadowStyle } from './boxShadow';
import type { DropShadowProps } from './types';
import { useShadowRef } from './useShadowRef';
import { WebDropShadow } from './WebDropShadow';

const NativeDropShadow: React.ForwardRefExoticComponent<
  DropShadowProps & React.RefAttributes<React.ElementRef<typeof View>>
> = React.forwardRef<React.ElementRef<typeof View>, DropShadowProps>(
  ({ useLegacyShadow, ...props }, forwardedRef) => {
    const { ref, isFabric } = useShadowRef(forwardedRef);
    return (
      <View
        {...props}
        ref={ref}
        style={
          useLegacyShadow
            ? props.style
            : (getBoxShadowStyle(props.style, isFabric) ?? props.style)
        }
      />
    );
  }
);

export const DropShadow: typeof NativeDropShadow = React.forwardRef<
  React.ElementRef<typeof View>,
  DropShadowProps
>((props, ref) =>
  Platform.OS === 'web' ? (
    <WebDropShadow {...props} ref={ref} />
  ) : (
    <NativeDropShadow {...props} ref={ref} />
  )
);
