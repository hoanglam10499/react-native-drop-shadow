import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command:
      'yarn vite preview --config vite.config.tsx --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
