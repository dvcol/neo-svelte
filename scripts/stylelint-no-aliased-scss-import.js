import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import stylelint from 'stylelint';

const { createPlugin, utils } = stylelint;

// Repo root, derived from this file's location (<repoRoot>/scripts/). Anchoring to
// process.cwd()/context.cwd is wrong: when stylelint runs from a subdir (editors,
// lint-staged, IDE integrations) those point at the subdir, mis-resolving aliases.
const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const ruleName = 'neo/no-aliased-scss-import';

const messages = utils.ruleMessages(ruleName, {
  rejected: (from, to) =>
    `Aliased import "${from}" in a standalone .scss file will not resolve in consumers; use the relative path "${to}".`,
});

/*
  Vite aliases (vite.config.ts) mapped to their repo-root-relative dir. Standalone
  .scss files are copied verbatim by svelte-package into dist/, so an alias-prefixed
  @use/@import/@forward survives uncompiled and breaks resolution in consumers (they
  have no matching alias, and only dist/ ships). `<style>` blocks in .svelte are
  compiled, so their aliases are safe and skipped via the .scss-only file guard.
*/
const ALIASES = {
  '~': 'src/lib',
  'src': 'src',
  'test': 'test',
  'demo': 'demo',
};

const SPECIFIER_RE = /(['"])((?:\\.|(?!\1).)*)\1/;
const AT_RULES_RE = /^(?:use|forward|import)$/i;

/**
 * If `path` matches an alias (equals the key or starts with `key/`), return the
 * alias' repo-root-relative target dir + the remainder. Otherwise return null.
 */
function resolveAlias(path) {
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (path === alias) return target;
    if (path.startsWith(`${alias}/`)) return `${target}${path.slice(alias.length)}`;
  }
  return null;
}

/**
 * Convert a repo-root-relative target to a path relative to the importing file,
 * normalized to forward slashes and prefixed with `./` when needed.
 */
function toRelative(repoRoot, fromFile, repoRelativeTarget) {
  let rel = relative(dirname(fromFile), join(repoRoot, repoRelativeTarget));
  if (sep !== '/') rel = rel.split(sep).join('/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

function rule(primary) {
  return (root, result) => {
    if (!utils.validateOptions(result, ruleName, { actual: primary, possible: [true, false] }) || !primary) return;

    const file = root.source?.input?.file;
    // File guard: only standalone .scss files ship raw. When stylelint lints a
    // .svelte component via postcss-html, input.file ends in .svelte → skip.
    if (!file || !file.endsWith('.scss')) return;

    root.walkAtRules(AT_RULES_RE, (atRule) => {
      const match = SPECIFIER_RE.exec(atRule.params);
      if (!match) return;

      const [, quote, specifier] = match;
      const target = resolveAlias(specifier);
      if (target === null) return;

      const suggestion = toRelative(REPO_ROOT, file, target);

      utils.report({
        result,
        ruleName,
        node: atRule,
        message: messages.rejected(specifier, suggestion),
        word: specifier,
        fix: () => {
          atRule.params = atRule.params.replace(`${quote}${specifier}${quote}`, `${quote}${suggestion}${quote}`);
        },
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
