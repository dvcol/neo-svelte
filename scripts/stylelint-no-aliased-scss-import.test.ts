import { join } from 'node:path';

import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

import plugin from './stylelint-no-aliased-scss-import.js';

const ruleName = 'neo/no-aliased-scss-import';
const REPO_ROOT = process.cwd();
const SCSS_FILE = join(REPO_ROOT, 'src/lib/providers/neo-theme-provider.scss');
const SVELTE_FILE = join(REPO_ROOT, 'src/lib/buttons/NeoButton.svelte');

interface LintArgs {
  code: string;
  codeFilename: string;
  customSyntax: string;
  fix?: boolean;
}

async function lint({ code, codeFilename, customSyntax, fix = false }: LintArgs) {
  return stylelint.lint({
    code,
    codeFilename,
    customSyntax,
    fix,
    config: {
      plugins: [plugin],
      rules: { [ruleName]: true },
    },
  });
}

function warnings(result: Awaited<ReturnType<typeof lint>>) {
  return result.results[0].warnings.filter(w => w.rule === ruleName);
}

describe('neo/no-aliased-scss-import', () => {
  describe('standalone .scss files', () => {
    it('flags an aliased src/ @use import', async () => {
      const result = await lint({
        code: `@use 'src/lib/styles/layers' as layers;`,
        codeFilename: SCSS_FILE,
        customSyntax: 'postcss-scss',
      });
      const found = warnings(result);
      expect(found).toHaveLength(1);
      expect(found[0].text).toContain('../styles/layers');
    });

    it('autofixes src/ to a relative path, preserving the `as` clause and quotes', async () => {
      const result = await lint({
        code: `@use 'src/lib/styles/layers' as layers;`,
        codeFilename: SCSS_FILE,
        customSyntax: 'postcss-scss',
        fix: true,
      });
      expect(result.code).toBe(`@use '../styles/layers' as layers;`);
      expect(warnings(result)).toHaveLength(0);
    });

    it('autofixes every aliased import in the real provider stylesheet', async () => {
      const result = await lint({
        code: [
          `@use 'src/lib/styles/layers' as layers;`,
          `@use 'src/lib/styles/reset' as reset;`,
          `@use 'src/lib/styles/theme' as theme;`,
        ].join('\n'),
        codeFilename: SCSS_FILE,
        customSyntax: 'postcss-scss',
        fix: true,
      });
      expect(result.code).toBe(
        [
          `@use '../styles/layers' as layers;`,
          `@use '../styles/reset' as reset;`,
          `@use '../styles/theme' as theme;`,
        ].join('\n'),
      );
    });

    it.each([
      [`@use '~/styles/layers' as layers;`, '~ alias'],
      [`@forward 'test/helpers';`, 'test alias'],
      [`@import 'demo/foo';`, 'demo alias'],
    ])('flags %s (%s)', async (code) => {
      const result = await lint({ code, codeFilename: SCSS_FILE, customSyntax: 'postcss-scss' });
      expect(warnings(result)).toHaveLength(1);
    });

    it.each([
      [`@use './animation' as animation;`, 'sibling relative'],
      [`@use '../styles/theme' as theme;`, 'parent relative'],
      [`@use 'sass:math';`, 'sass built-in'],
      [`@forward '@dvcol/some-pkg/styles';`, 'bare npm specifier'],
    ])('does not flag %s (%s)', async (code) => {
      const result = await lint({ code, codeFilename: SCSS_FILE, customSyntax: 'postcss-scss' });
      expect(warnings(result)).toHaveLength(0);
    });
  });

  describe('.svelte <style> blocks (compiled by svelte-package — must be ignored)', () => {
    it('does not flag an aliased import inside a .svelte style block', async () => {
      const result = await lint({
        code: `<style lang="scss">\n  @use 'src/lib/styles/layers' as layers;\n</style>`,
        codeFilename: SVELTE_FILE,
        customSyntax: 'postcss-html',
      });
      expect(warnings(result)).toHaveLength(0);
    });
  });
});
