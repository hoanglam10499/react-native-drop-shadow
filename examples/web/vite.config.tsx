import path from 'node:path';
import { defineConfig } from 'vite';

const packedRoot = process.env.DROP_SHADOW_PACKED_ROOT;

export default defineConfig({
  plugins: [
    {
      name: 'verify-no-android-renderer',
      generateBundle() {
        for (const id of this.getModuleIds()) {
          if (/DropShadow\.android/.test(id)) {
            throw new Error(`Android renderer imported by Web: ${id}`);
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      'react-native': path.resolve(
        'node_modules/react-native-web/dist/index.js'
      ),
      'react-native-drop-shadow': path.resolve('../../src/index.tsx'),
      'packed-module': path.resolve(
        packedRoot ?? '../..',
        'lib/module/index.js'
      ),
      'packed-commonjs': path.resolve(
        packedRoot ?? '../..',
        'lib/commonjs/index.js'
      ),
    },
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
  ssr: { noExternal: true },
  build: { commonjsOptions: { include: [/node_modules/, /lib[\\/]commonjs/] } },
});
