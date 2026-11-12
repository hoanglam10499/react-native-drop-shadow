import React from 'react';
import { renderToString } from 'react-dom/server';
import { StyleSheet } from 'react-native';
import App from './App';

export function render() {
  const html = renderToString(<App />);
  // RN's public types omit React Native Web's server stylesheet API.
  if (
    !('getSheet' in StyleSheet) ||
    typeof StyleSheet.getSheet !== 'function'
  ) {
    throw new Error('React Native Web stylesheet API is unavailable');
  }
  const sheet: unknown = StyleSheet.getSheet();
  if (
    sheet == null ||
    typeof sheet !== 'object' ||
    !('id' in sheet) ||
    typeof sheet.id !== 'string' ||
    !('textContent' in sheet) ||
    typeof sheet.textContent !== 'string'
  ) {
    throw new Error('React Native Web returned an invalid server stylesheet');
  }
  return { html, sheet: { id: sheet.id, textContent: sheet.textContent } };
}
