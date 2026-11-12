import {
  processColor,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export function convertShadowStyle(
  style: StyleProp<ViewStyle>,
  defaults: { color: string; opacity: number; radius: number; offsetY: number },
  roundAlpha = true
): StyleProp<ViewStyle> | null {
  const flattened = StyleSheet.flatten(style);
  if (!flattened) {
    return {};
  }
  const {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    ...remaining
  } = flattened;
  if (
    remaining.boxShadow != null ||
    (shadowColor == null &&
      shadowOffset == null &&
      shadowOpacity == null &&
      shadowRadius == null)
  ) {
    return remaining;
  }

  const colorValue = shadowColor ?? defaults.color;
  const opacity = shadowOpacity ?? defaults.opacity;
  const radius = shadowRadius ?? defaults.radius;
  const offset = shadowOffset ?? { width: 0, height: defaults.offsetY };
  // Animated and platform-specific values cannot be converted statically.
  if (
    (typeof colorValue !== 'string' && typeof colorValue !== 'number') ||
    typeof opacity !== 'number' ||
    !Number.isFinite(opacity) ||
    opacity < 0 ||
    opacity > 1 ||
    typeof radius !== 'number' ||
    !Number.isFinite(radius) ||
    radius < 0 ||
    typeof offset.width !== 'number' ||
    !Number.isFinite(offset.width) ||
    typeof offset.height !== 'number' ||
    !Number.isFinite(offset.height)
  ) {
    return null;
  }
  const color = processColor(colorValue);
  if (typeof color !== 'number') {
    return null;
  }
  const argb = color < 0 ? color + 0x100000000 : color;
  const colorAlpha = Math.floor(argb / 0x1000000) * opacity;
  const alpha = (roundAlpha ? Math.round(colorAlpha) : colorAlpha) / 255;
  const red = Math.floor(argb / 0x10000) % 256;
  const green = Math.floor(argb / 0x100) % 256;
  const blue = argb % 256;
  return {
    ...remaining,
    boxShadow: [
      {
        offsetX: offset.width,
        offsetY: offset.height,
        blurRadius: radius,
        color: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
      },
    ],
  };
}
