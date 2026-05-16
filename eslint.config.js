import { defineSvelteConfig } from '@dvcol/eslint-config';

export default defineSvelteConfig(
  {
    ignores: [
      '.github/copilot-instructions.md',
      'README.md',
      'AGENTS.md',
      'ROADMAP.md',
      'CHANGELOG.md',
    ],
  },
  // Library code (src/lib/**) MUST NOT import demo or test-harness files.
  // The published package depends only on its own source tree; demo helpers,
  // visual harnesses and browser tests live one-way under demo/**.
  // See AGENTS.md "Import boundary" section.
  {
    files: ['src/lib/**/*.{ts,js,svelte}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/demo/**', '../../../demo/**', '../../demo/**', '../demo/**'],
            message: 'src/lib/** must not import from demo/** — see AGENTS.md "Import boundary" section (one-way import boundary).',
          },
        ],
      }],
    },
  },
  // Defence-in-depth: no browser tests should be located under src/lib/**.
  // Vitest's browser project glob already excludes them, but failing the lint
  // surfaces the violation at edit time rather than at CI test time.
  {
    files: ['src/lib/**/*.browser.{test,spec}.{ts,js}'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: 'Program',
        message: 'Browser tests must live under demo/**, not src/lib/** — see AGENTS.md "Folder layout & naming" section.',
      }],
    },
  },
);
