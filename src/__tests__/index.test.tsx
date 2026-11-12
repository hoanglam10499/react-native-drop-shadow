import React from 'react';
import { Platform, View, processColor } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import { getBoxShadowStyle } from '../boxShadow';
import { DropShadow as AndroidDropShadow } from '../DropShadow.android';
import { DropShadow as IOSDropShadow } from '../DropShadow';
import type { DropShadowProps } from '../types';
import { convertShadowStyle } from '../shadowStyle';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: 28,
    constants: { reactNativeVersion: { major: 0, minor: 76, patch: 0 } },
  },
  StyleSheet: {
    flatten: jest.requireActual<{
      default: typeof import('react-native').StyleSheet.flatten;
    }>('react-native/Libraries/StyleSheet/flattenStyle').default,
  },
  processColor: jest.fn(
    jest.requireActual('react-native/Libraries/StyleSheet/processColor').default
  ),
  View: 'View',
  requireNativeComponent: () => 'NativeShadow',
  findNodeHandle: (view: { tag: number }) => {
    if (jest.requireMock('react-native').Platform.OS === 'web') {
      throw new Error('Native tags must not be read on Web');
    }
    return view.tag;
  },
}));

const platform = Platform as typeof Platform & {
  OS: string;
  Version: number;
  constants: {
    reactNativeVersion: { major: number; minor: number; patch: number };
  };
};
const shadow = {
  shadowColor: '#12345680',
  shadowOffset: { width: -2, height: 3 },
  shadowOpacity: 0.5,
  shadowRadius: 4,
};

let mockTag = 2;

const webDefaults = { color: '#000', opacity: 1, radius: 0, offsetY: 0 };

it('mounts on Web without native tags and preserves the forwarded ref', () => {
  platform.OS = 'web';
  const ref = React.createRef<React.ElementRef<typeof View>>();
  const node = render(IOSDropShadow, {
    ...{ ref },
    testID: 'web-shadow',
    style: shadow,
    children: React.createElement('Child'),
  });
  expect(ref.current).toEqual({ tag: 2 });
  expect(node.props.testID).toBe('web-shadow');
  expect(node.props.style.boxShadow[0].color).toBe(
    'rgba(18, 52, 86, 0.25098039215686274)'
  );
});

it('preserves Web defaults and explicit shadow precedence', () => {
  expect(convertShadowStyle({ shadowRadius: 4 }, webDefaults, false)).toEqual({
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 4, color: 'rgba(0, 0, 0, 1)' },
    ],
  });
  for (const boxShadow of [
    '1px 2px 3px red inset',
    [{ offsetX: 2, offsetY: 3, inset: true }],
  ]) {
    expect(convertShadowStyle({ ...shadow, boxShadow }, webDefaults)).toEqual({
      boxShadow,
    });
  }
  expect(convertShadowStyle({ margin: 2 }, webDefaults)).toEqual({ margin: 2 });
  expect(convertShadowStyle({ shadowRadius: -1 }, webDefaults)).toBeNull();
  expect(
    convertShadowStyle({ shadowColor: 'invalid-color' }, webDefaults)
  ).toBeNull();
  expect(convertShadowStyle({ shadowOpacity: NaN }, webDefaults)).toBeNull();
  expect(
    convertShadowStyle(
      [{ ...shadow }, { shadowRadius: 8, borderRadius: 20 }],
      webDefaults,
      false
    )
  ).toEqual({
    borderRadius: 20,
    boxShadow: [
      {
        offsetX: -2,
        offsetY: 3,
        blurRadius: 8,
        color: 'rgba(18, 52, 86, 0.25098039215686274)',
      },
    ],
  });
});

it('preserves original Web styles when the legacy override is enabled', () => {
  platform.OS = 'web';
  const node = render(IOSDropShadow, { useLegacyShadow: true, style: shadow });
  expect(node.props.style).toBe(shadow);
  expect(node.props.useLegacyShadow).toBeUndefined();
});

it('retains unsafe Web styles for host handling', () => {
  platform.OS = 'web';
  const style = { shadowColor: 'var(--shadow-color)', shadowRadius: 4 };
  expect(render(IOSDropShadow, { style }).props.style).toBe(style);
});

function render(
  component: typeof AndroidDropShadow,
  props: DropShadowProps
): TestRenderer.ReactTestInstance {
  let renderer: TestRenderer.ReactTestRenderer | undefined;
  act(() => {
    renderer = TestRenderer.create(React.createElement(component, props), {
      createNodeMock: () => ({ tag: mockTag }),
    });
  });
  if (!renderer) {
    throw new Error('Failed to create test renderer');
  }
  return renderer.root.find((node) => typeof node.type === 'string');
}

beforeEach(() => {
  mockTag = 2;
  platform.OS = 'android';
  platform.Version = 28;
  platform.constants.reactNativeVersion = {
    major: 0,
    minor: 76,
    patch: 0,
    prerelease: undefined,
  };
  Object.defineProperty(globalThis, 'nativeFabricUIManager', {
    value: {},
    configurable: true,
  });
});

it('converts and flattens shadow styles, including color alpha and opacity', () => {
  expect(
    getBoxShadowStyle([{ margin: 4, ...shadow }, { shadowRadius: 7 }])
  ).toEqual({
    margin: 4,
    boxShadow: [
      {
        offsetX: -2,
        offsetY: 3,
        blurRadius: 7,
        color: 'rgba(18, 52, 86, 0.25098039215686274)',
      },
    ],
  });
});

it('converts Android signed color integers', () => {
  jest.mocked(processColor).mockReturnValueOnce(0x80123456 - 0x100000000);
  expect(getBoxShadowStyle(shadow)).toEqual({
    boxShadow: [
      {
        offsetX: -2,
        offsetY: 3,
        blurRadius: 4,
        color: 'rgba(18, 52, 86, 0.25098039215686274)',
      },
    ],
  });
});

it('preserves the wrapper border radius for converted box shadows', () => {
  const style = [{ ...shadow, borderRadius: 12 }, { borderRadius: 20 }];
  const android = render(AndroidDropShadow, { style });
  expect(android.props.style.borderRadius).toBe(20);
  expect(android.props.style.boxShadow).toBeDefined();
  platform.OS = 'ios';
  const ios = render(IOSDropShadow, { style });
  expect(ios.props.style.borderRadius).toBe(20);
  expect(ios.props.style.boxShadow).toBeDefined();
});

it.each([
  ['old architecture', 76, 28, false],
  ['React Native before 0.76', 75, 28, true],
  ['Android before API 28', 76, 27, true],
])('uses the Android native fallback on %s', (_name, minor, api, fabric) => {
  platform.constants.reactNativeVersion.minor = minor;
  platform.Version = api;
  if (!fabric) {
    Object.defineProperty(globalThis, 'nativeFabricUIManager', {
      value: undefined,
      configurable: true,
    });
  }
  const element = render(AndroidDropShadow, { style: shadow });
  expect(element.type).toBe('NativeShadow');
  expect(element.props.style).toBe(shadow);
});

it('uses View with boxShadow on supported Android and iOS', () => {
  expect(render(AndroidDropShadow, { style: shadow }).type).toBe(View);
  platform.OS = 'ios';
  platform.Version = 17;
  const element = render(IOSDropShadow, { style: shadow });
  expect(element.type).toBe(View);
  expect(element.props.style).toEqual(getBoxShadowStyle(shadow));
});

it('uses boxShadow with newer React Native versions', () => {
  platform.constants.reactNativeVersion.minor = 88;
  expect(render(AndroidDropShadow, { style: shadow }).type).toBe(View);
});

it('selects independently for Paper and Fabric roots in the same process', () => {
  mockTag = 3;
  expect(render(AndroidDropShadow, { style: shadow }).type).toBe(
    'NativeShadow'
  );
  mockTag = 4;
  expect(render(AndroidDropShadow, { style: shadow }).type).toBe(View);
  platform.OS = 'ios';
  mockTag = 3;
  expect(render(IOSDropShadow, { style: shadow }).props.style).toBe(shadow);
  mockTag = 4;
  expect(render(IOSDropShadow, { style: shadow }).props.style).toEqual(
    getBoxShadowStyle(shadow)
  );
});

it('uses the fallback when the native view tag is unavailable', () => {
  mockTag = 0;
  expect(render(AndroidDropShadow, { style: shadow }).type).toBe(
    'NativeShadow'
  );
});

it('mounts the fallback first and forwards refs through a Fabric switch', () => {
  const refs = jest.fn();
  let renderer: TestRenderer.ReactTestRenderer | undefined;
  act(() => {
    renderer = TestRenderer.create(
      <AndroidDropShadow ref={refs} style={shadow} testID="shadow">
        <View testID="child" />
      </AndroidDropShadow>,
      {
        createNodeMock: (element) => ({ tag: 2, kind: element.type }),
      }
    );
  });
  expect(refs.mock.calls.map(([view]) => view?.kind ?? null)).toEqual([
    'NativeShadow',
    null,
    'View',
  ]);
  expect(
    renderer?.root.findByProps({ testID: 'shadow' }).props.children
  ).toBeDefined();
  act(() => renderer?.unmount());
  expect(refs).toHaveBeenLastCalledWith(null);
});

it.each([NaN, -1, 0.5])(
  'uses the native fallback for invalid React Native minor version %s',
  (minor) => {
    platform.constants.reactNativeVersion.minor = minor;
    expect(render(AndroidDropShadow, { style: shadow }).type).toBe(
      'NativeShadow'
    );
  }
);

it.each([NaN, -1, 0.5])(
  'uses the native fallback for invalid React Native major version %s',
  (major) => {
    platform.constants.reactNativeVersion.major = major;
    expect(render(AndroidDropShadow, { style: shadow }).type).toBe(
      'NativeShadow'
    );
  }
);

it('uses the native fallback when the React Native version is unavailable', () => {
  Object.defineProperty(platform, 'constants', {
    value: {},
    configurable: true,
    writable: true,
  });
  expect(render(AndroidDropShadow, { style: shadow }).type).toBe(
    'NativeShadow'
  );
  Object.defineProperty(platform, 'constants', {
    value: { reactNativeVersion: { major: 0, minor: 76, patch: 0 } },
    configurable: true,
    writable: true,
  });
});

it('preserves iOS styles without Fabric on a supported React Native version', () => {
  platform.OS = 'ios';
  Object.defineProperty(globalThis, 'nativeFabricUIManager', {
    value: undefined,
    configurable: true,
  });
  expect(render(IOSDropShadow, { style: shadow }).props.style).toBe(shadow);
});

it('preserves the iOS style on the old architecture and older React Native', () => {
  platform.OS = 'ios';
  platform.constants.reactNativeVersion.minor = 75;
  expect(render(IOSDropShadow, { style: shadow }).props.style).toBe(shadow);
});

it('allows callers to retain legacy shadows, without forwarding the option', () => {
  const android = render(AndroidDropShadow, {
    style: shadow,
    useLegacyShadow: true,
  });
  expect(android.type).toBe('NativeShadow');
  expect(android.props.useLegacyShadow).toBeUndefined();
  platform.OS = 'ios';
  const ios = render(IOSDropShadow, { style: shadow, useLegacyShadow: true });
  expect(ios.props.style).toBe(shadow);
  expect(ios.props.useLegacyShadow).toBeUndefined();
});

it('preserves explicit boxShadow without applying legacy shadow twice', () => {
  const explicit = [{ offsetX: 1, offsetY: 2, color: 'red' }];
  expect(getBoxShadowStyle({ ...shadow, boxShadow: explicit })).toEqual({
    boxShadow: explicit,
  });
  expect(
    render(AndroidDropShadow, { style: { ...shadow, boxShadow: explicit } })
      .props.style
  ).toEqual({ boxShadow: explicit });
  platform.OS = 'ios';
  expect(
    render(IOSDropShadow, { style: { ...shadow, boxShadow: explicit } }).props
      .style
  ).toEqual({ boxShadow: explicit });
});

it('retains the original style for unsupported direct shadows', () => {
  const style = { ...shadow, boxShadow: 'inset 0px 0px 2px red' };
  expect(render(AndroidDropShadow, { style }).props.style).toBe(style);
  platform.Version = 27;
  expect(render(AndroidDropShadow, { style }).type).toBe('NativeShadow');
  platform.OS = 'ios';
  expect(render(IOSDropShadow, { style }).props.style).toEqual({
    boxShadow: style.boxShadow,
  });
});

it.each([
  ['1px 2px 3px red inset', true],
  ['1px 2px 3px red, INSET 0px 0px 2px blue', true],
  ['1px 2px 3px red', false],
  [[{ offsetX: 1, offsetY: 2, inset: true }], true],
  [[{ offsetX: 1, offsetY: 2, inset: false }], false],
] as const)(
  'checks Android API boundaries for direct boxShadow %p',
  (boxShadow, inset) => {
    const style = { ...shadow, boxShadow };
    expect(render(AndroidDropShadow, { style }).type).toBe(
      inset ? 'NativeShadow' : View
    );
    platform.Version = 29;
    expect(render(AndroidDropShadow, { style }).type).toBe(View);
    expect(getBoxShadowStyle(style)).toEqual({ boxShadow });
  }
);

it('leaves styles without legacy shadow untouched', () => {
  expect(getBoxShadowStyle({ width: 20 })).toEqual({ width: 20 });
  expect(getBoxShadowStyle(undefined)).toEqual({});
});

it('preserves Android and iOS defaults for omitted shadow properties', () => {
  expect(getBoxShadowStyle({ shadowOpacity: 0.5 })).toEqual({
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, color: 'rgba(0, 0, 0, 0)' },
    ],
  });
  platform.OS = 'ios';
  expect(getBoxShadowStyle({ shadowOpacity: 0.5 })).toEqual({
    boxShadow: [
      {
        offsetX: 0,
        offsetY: -3,
        blurRadius: 3,
        color: 'rgba(0, 0, 0, 0.5019607843137255)',
      },
    ],
  });
});

it('retains the platform fallback for native dynamic colors', () => {
  const { PlatformColor } = jest.requireActual<{
    PlatformColor: typeof import('react-native').PlatformColor;
  }>('react-native/Libraries/StyleSheet/PlatformColorValueTypes.android');
  const style = { ...shadow, shadowColor: PlatformColor('?attr/colorAccent') };
  expect(getBoxShadowStyle(style)).toBeNull();
  expect(render(AndroidDropShadow, { style }).type).toBe('NativeShadow');
});

it.each([
  { ...shadow, shadowOpacity: NaN },
  { ...shadow, shadowOpacity: 2 },
  { ...shadow, shadowRadius: -1 },
  { ...shadow, shadowColor: 'not-a-color' },
])('falls back when the shadow cannot be safely converted: %p', (style) => {
  expect(getBoxShadowStyle(style)).toBeNull();
  expect(render(AndroidDropShadow, { style }).type).toBe('NativeShadow');
});
