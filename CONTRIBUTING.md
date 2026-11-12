# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The library package in the root directory.
- Paper and Fabric examples in `examples/legacy/` and `examples/modern/`.
- A browser/SSR verification host in `examples/web/`.

Use Yarn 3.6.1 and a Node version supported by Builder Bob 0.44.1
(`^22.22.2 || ^24.15.0 || >=26.0.0`); see `.nvmrc` for the CI version.
Install dependencies from the root directory:

```sh
yarn install --immutable
```

> Since the project relies on Yarn workspaces, you cannot use [`npm`](https://github.com/npm/cli) for development.

The [example apps](./README.md#example-applications) demonstrate usage of the
library. Select the app and device appropriate for the behavior being changed.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild, but native code changes will require a rebuild of the example app.

Open an example's `android` directory in Android Studio or its iOS workspace
in Xcode to work on host integration. The library's native fallback is Android
Kotlin; iOS uses React Native's `View`.

To edit the Java or Kotlin files, open `examples/modern/android` in Android
Studio and find the source files at `react-native-drop-shadow` under `Android`.

You can use various commands from the root directory to work with the project.
The `yarn example` shortcut targets the modern Fabric application.

To start the packager:

```sh
yarn example start
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

For the Paper and Fabric examples, use `yarn workspace DropShadowLegacy` or
`yarn workspace DropShadowModern` followed by `start`, `android`, or `ios`.
See the README for platform setup and the limits of the verified matrix.

Keep handwritten TypeScript source and tests in `.tsx` files, including helpers
that do not contain JSX. Generated `.d.ts` declarations are unchanged.

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typecheck
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

For Android changes, also build the selected example's R8-enabled release and
run the native regression tests. Commands, consumer rules, and the RN 0.81.6
Paper-specific keep rule are documented in
[Android release builds](./README.md#android-release-builds-r8--proguard).
Check the installed release on a device; a successful R8 build alone does not
prove that JNI or reflection-based properties survived optimization.

For Web changes, run the [Web verification commands](./README.md#development).
The tests exercise the packed package as well as source imports, server
rendering, hydration, DOM refs, CSS shadows, and child state in Chromium.
Keep Web host dependencies out of the library's runtime dependencies.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, run the following:

```sh
yarn release
```

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn`: setup project by installing dependencies.
- `yarn typecheck`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
