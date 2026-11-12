const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const tar = require('tar');

async function main() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'drop-shadow-web-'));
  try {
    const root = path.resolve('../..');
    const yarn = path.join(root, '.yarn', 'releases', 'yarn-3.6.1.cjs');
    execFileSync(
      process.execPath,
      [yarn, 'pack', '--out', path.join(temp, 'package.tgz')],
      { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] }
    );
    await tar.x({ file: path.join(temp, 'package.tgz'), cwd: temp });
    fs.symlinkSync(
      path.join(root, 'node_modules'),
      path.join(temp, 'node_modules'),
      process.platform === 'win32' ? 'junction' : 'dir'
    );
    const packed = path.join(temp, 'package');
    const manifest = JSON.parse(
      fs.readFileSync(path.join(packed, 'package.json'), 'utf8')
    );
    for (const entry of ['main', 'module', 'types', 'react-native']) {
      const target = path.join(packed, manifest[entry]);
      assert(
        [target, `${target}.js`, `${target}.tsx`].some((file) =>
          fs.existsSync(file)
        ),
        `Missing ${entry}`
      );
    }
    assert(fs.existsSync(path.join(packed, 'android', 'consumer-rules.pro')));
    const typeConfig = path.join(temp, 'tsconfig.json');
    fs.writeFileSync(
      typeConfig,
      JSON.stringify({
        extends: path.resolve('tsconfig.json'),
        compilerOptions: {
          paths: {
            'react-native-drop-shadow': [path.join(packed, manifest.types)],
            'packed-module': [
              path.join(packed, 'lib/typescript/module/index.d.ts'),
            ],
            'packed-commonjs': [
              path.join(packed, 'lib/typescript/commonjs/index.d.ts'),
            ],
          },
        },
        include: [path.resolve('App.tsx'), path.resolve('commonjs-entry.cjs')],
      })
    );
    execFileSync(
      process.execPath,
      [require.resolve('typescript/bin/tsc'), '--project', typeConfig],
      { stdio: 'inherit' }
    );
    process.env.DROP_SHADOW_PACKED_ROOT = packed;
    const { build } = await import('vite');
    await build({ configFile: 'vite.config.tsx' });
    await build({
      configFile: 'vite.config.tsx',
      build: { ssr: 'server.tsx', outDir: 'dist-server' },
    });
    const { render } = await import(
      pathToFileURL(path.resolve('dist-server/server.js')).href
    );
    assert.equal(typeof global.window, 'undefined');
    assert.equal(typeof global.document, 'undefined');
    const { html, sheet } = render();
    assert(html.includes('Automatic shadow'));
    const index = fs.readFileSync('dist/index.html', 'utf8');
    fs.writeFileSync(
      'dist/index.html',
      index
        .replace(
          '</head>',
          `<style id="${sheet.id}">${sheet.textContent}</style></head>`
        )
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
    const cli = require.resolve('@playwright/test/cli');
    execFileSync(
      process.execPath,
      [cli, 'test', '--config', 'playwright.config.tsx'],
      { stdio: 'inherit' }
    );
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
