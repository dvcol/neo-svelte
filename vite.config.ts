import type { PluginOption } from 'vite';
import type { ViteUserConfig } from 'vitest/config';

import { fileURLToPath, URL } from 'node:url';

import { sveltekit } from '@sveltejs/kit/vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { playwright } from '@vitest/browser-playwright';
import { checker } from 'vite-plugin-checker';
import { defineConfig } from 'vitest/config';

const plugins: PluginOption[] = [];
const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
const isWeb = process.env.VITE_MODE === 'WEB';

if (isDev) {
  plugins.push(
    svelte({
      preprocess: vitePreprocess(),
    }),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.build.json',
      },
    }),
  );
} else if (isWeb) {
  plugins.push(
    svelte({
      preprocess: vitePreprocess(),
    }),
  );
} else {
  plugins.push(sveltekit());
}

if (isTest) {
  plugins.push(svelteTesting());
}

const config: ViteUserConfig = {
  plugins,
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src/lib', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url)),
      'test': fileURLToPath(new URL('./test', import.meta.url)),
      'demo': fileURLToPath(new URL('./demo', import.meta.url)),
    },
  },
  server: {
    port: 3303,
    open: '/neo-svelte/',
  },
  preview: {
    port: 3304,
    open: '/neo-svelte/',
  },
  test: {
    alias: {
      '~/': fileURLToPath(new URL('./src/lib', import.meta.url)),
      'src/': fileURLToPath(new URL('./src', import.meta.url)),
      'test/': fileURLToPath(new URL('./test', import.meta.url)),
      'demo/': fileURLToPath(new URL('./demo', import.meta.url)),
    },
    passWithNoTests: true,
    // Declare tags used via `describe(name, { tags: [...] }, fn)`. See README "Testing" section.
    tags: [
      { name: 'jsdom', description: 'Unit / contract tests under src/lib/** (jsdom env).' },
      { name: 'browser', description: 'Real-browser tests under demo/** (Playwright + chromium).' },
      { name: 'visual', description: 'Screenshot / TNR contracts; subset of browser. Filter with --tag visual to regen.' },
      { name: 'performance', description: 'Perf-contract tests; subset of browser. Run via test:perf.' },
    ],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: [
            'src/**/*.{test,spec}.{js,ts}',
            'test/**/*.{test,spec}.{js,ts}',
            'scripts/**/*.{test,spec}.{js,ts}',
          ],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.svelte-kit/**',
            'test/setup.unit.ts',
            'test/setup.browser.ts',
            // Defence-in-depth: browser tests live under demo/**, but if one is
            // mistakenly added under src/** it must not run in the jsdom project.
            'src/**/*.browser.{test,spec}.{js,ts}',
            'demo/**',
          ],
          environment: 'jsdom',
          setupFiles: ['./test/setup.unit.ts'],
        },
      },
      {
        extends: true,
        resolve: {
          conditions: ['browser'],
        },
        test: {
          name: 'browser',
          include: ['demo/**/*.browser.{test,spec}.{js,ts}'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**'],
          setupFiles: ['./test/setup.browser.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
            // Auto-failure screenshots land next to reference baselines under
            // __screenshots__/, polluting the visual contract folder. Disable
            // them — failure attachments still go to .vitest-attachments/.
            screenshotFailures: false,
            expect: {
              toMatchScreenshot: {
                comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
              },
            },
          },
        },
      },
    ],
  },
};

if (isWeb) config.base = '/neo-svelte/';

export default defineConfig(config);
