import {
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { convertShadowStyle } from './shadowStyle';

declare const global: typeof globalThis & { nativeFabricUIManager?: object };

export function getBoxShadowStyle(
  style: StyleProp<ViewStyle>,
  isFabric = Boolean(
    (global as typeof globalThis & { nativeFabricUIManager?: object })
      .nativeFabricUIManager
  )
): StyleProp<ViewStyle> | null {
  const fabric = (
    global as typeof globalThis & {
      nativeFabricUIManager?: object;
    }
  ).nativeFabricUIManager;
  const version = Platform.constants?.reactNativeVersion;
  const androidVersion = Number(Platform.Version);
  if (
    !fabric ||
    !isFabric ||
    !version ||
    !Number.isInteger(version.major) ||
    version.major < 0 ||
    !Number.isInteger(version.minor) ||
    version.minor < 0 ||
    (version.major === 0 && version.minor < 76) ||
    (Platform.OS !== 'ios' && Platform.OS !== 'android') ||
    (Platform.OS === 'android' &&
      (!Number.isFinite(androidVersion) || androidVersion < 28))
  ) {
    return null;
  }

  const flattened = StyleSheet.flatten(style);
  if (!flattened) {
    return {};
  }
  if (flattened.boxShadow != null) {
    const boxShadow = flattened.boxShadow;
    const isAndroidWithoutInset =
      Platform.OS === 'android' && androidVersion < 29;
    if (
      typeof boxShadow === 'string'
        ? isAndroidWithoutInset && /\binset\b/i.test(boxShadow)
        : !Array.isArray(boxShadow) ||
          boxShadow.some(
            (item) =>
              item == null ||
              typeof item !== 'object' ||
              (item.inset != null && typeof item.inset !== 'boolean') ||
              (isAndroidWithoutInset && item.inset === true)
          )
    ) {
      return null;
    }
  }
  return convertShadowStyle(flattened, {
    color: Platform.OS === 'ios' ? '#000' : 'transparent',
    opacity: 0,
    radius: Platform.OS === 'ios' ? 3 : 0,
    offsetY: Platform.OS === 'ios' ? -3 : 0,
  });
}
