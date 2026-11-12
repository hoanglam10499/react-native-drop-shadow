# Legacy architecture example

This app uses React Native 0.81.6 with Paper: Android sets `newArchEnabled=false`
and the iOS Podfile sets `RCT_NEW_ARCH_ENABLED=0`. Install dependencies from the
repository root with `yarn install --immutable`, then run:

```sh
yarn workspace DropShadowLegacy start
yarn workspace DropShadowLegacy android
```

For iOS, run `pod install` in this app's `ios` directory on macOS and then
`yarn workspace DropShadowLegacy ios`. The app shows automatic and explicitly
forced legacy shadows. See the repository README for build requirements.
