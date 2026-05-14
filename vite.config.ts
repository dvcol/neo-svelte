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
    },
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: [
            'src/**/*.{test,spec}.{js,ts}',
            'test/**/*.{test,spec}.{js,ts}',
          ],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.svelte-kit/**',
            'test/setup.unit.ts',
            'test/setup.browser.ts',
            'src/**/*.browser.{test,spec}.{js,ts}',
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
          include: ['src/**/*.browser.{test,spec}.{js,ts}'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**'],
          setupFiles: ['./test/setup.browser.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
};

if (isWeb) config.base = '/neo-svelte/';

export default defineConfig(config);
