import { fileURLToPath, URL } from 'url';

import { sveltekit } from '@sveltejs/kit/vite';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltePreprocess } from 'svelte-preprocess';
import { checker } from 'vite-plugin-checker';
import { defineConfig, type ViteUserConfig } from 'vitest/config';

import type { PluginOption } from 'vite';

const plugins: PluginOption[] = [];
const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
const isWeb = process.env.VITE_MODE === 'WEB';
const isWC = process.env.VITE_MODE === 'WC';

if (isDev) {
  plugins.push(
    svelte({
      preprocess: sveltePreprocess(),
    }),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.json',
      },
    }),
  );
} else if (isWeb || isWC) {
  plugins.push(
    svelte({
      preprocess: sveltePreprocess(),
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
    include: ['test/**/*.{test,spec}.{js,ts}'],
    exclude: ['test/setup.test.ts'],
    environment: 'jsdom',
    setupFiles: ['/test/setup.test.ts'],
    alias: {
      '~/': fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
};

if (isWeb) config.base = '/neo-svelte/';
if (isWC)
  config.build = {
    outDir: 'dist/wc',
    rollupOptions: {
      input: {
        providers: 'src/lib/providers/index.wc.ts',
        buttons: 'src/lib/buttons/index.wc.ts',
      },
    },
  };

export default defineConfig(config);
