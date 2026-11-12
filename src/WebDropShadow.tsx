import React from 'react';
import { View } from 'react-native';
import type { DropShadowProps } from './types';
import { convertShadowStyle } from './shadowStyle';

export const WebDropShadow: React.ForwardRefExoticComponent<
  DropShadowProps & React.RefAttributes<React.ElementRef<typeof View>>
> = React.forwardRef<React.ElementRef<typeof View>, DropShadowProps>(
  ({ useLegacyShadow, ...props }, ref) => (
    <View
      {...props}
      ref={ref}
      style={
        useLegacyShadow
          ? props.style
          : (convertShadowStyle(
              props.style,
              { color: '#000', opacity: 1, radius: 0, offsetY: 0 },
              false
            ) ?? props.style)
      }
    />
  )
);
