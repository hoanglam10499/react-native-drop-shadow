import React from 'react';
import { findNodeHandle, View } from 'react-native';

type ViewInstance = React.ElementRef<typeof View>;

export function useShadowRef(forwardedRef: React.ForwardedRef<ViewInstance>) {
  const [isFabric, setIsFabric] = React.useState(false);

  const ref = React.useCallback(
    (view: ViewInstance | null) => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(view);
      } else if (forwardedRef) {
        forwardedRef.current = view;
      }

      if (view) {
        const tag = findNodeHandle(view);
        if (typeof tag === 'number' && Number.isInteger(tag) && tag > 0) {
          setIsFabric(tag % 2 === 0);
        }
      }
    },
    [forwardedRef]
  );

  return { ref, isFabric };
}
