module.exports = (api) => ({
  presets: [
    api.env('test')
      ? 'module:@react-native/babel-preset'
      : 'module:react-native-builder-bob/babel-preset',
  ],
});
