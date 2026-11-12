# New architecture example

This app uses React Native 0.88.1 with the New Architecture. Install dependencies
from the repository root with `yarn install --immutable`, then run:

```sh
yarn workspace DropShadowModern start
yarn workspace DropShadowModern android
```

For iOS, run `pod install` in this app's `ios` directory on macOS and then
`yarn workspace DropShadowModern ios`. The app compares automatic box shadows
with explicitly forced legacy shadows. See the repository README for build
requirements.
