/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StyleSheet } from 'react-native';
import App from '../App';

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const shadow = renderer!.root.findByProps({ testID: 'automatic-shadow' });
  expect(StyleSheet.flatten(shadow.props.style).borderRadius).toBe(20);
});
