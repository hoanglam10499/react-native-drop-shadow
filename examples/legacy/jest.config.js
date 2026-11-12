module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native-drop-shadow$': '<rootDir>/../../src/index.native.tsx',
    '^react$': require.resolve('react'),
    '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
    '^react/jsx-dev-runtime$': require.resolve('react/jsx-dev-runtime'),
    '^react-native$': require.resolve('react-native'),
  },
};
