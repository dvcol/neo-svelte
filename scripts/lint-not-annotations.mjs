#!/usr/bin/env node
// Cascade-layers :not() annotation guard.
//
// Every :not( occurrence inside a Svelte style block in src/lib/**/*.svelte
// must be preceded (same line or line above) by `// keep: a11y`,
// `// keep: structural`, or `// keep: order`. See src/lib/styles/AGENTS.md.
//
// Exit codes: 0 if all annotated, 1 if any are missing.

import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PATTERN = 'src/lib/**/*.svelte';
const STYLE_RE = /<style[^>]*>([\s\S]*?)<\/style>/g;
const NOT_RE = /:not\(/;
const ANNOT_RE = /\/\/\s*keep:\s*(?:a11y|structural|order)\b/;

const violations = [];

const iter = glob(PATTERN, { cwd: ROOT });
for await (const rel of iter) {
  const abs = join(ROOT, rel);
  const text = readFileSync(abs, 'utf8');
  for (const styleMatch of text.matchAll(STYLE_RE)) {
    const body = styleMatch[1];
    const styleStartLine = text.slice(0, styleMatch.index).split('\n').length;
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!NOT_RE.test(lines[i])) continue;
      if (ANNOT_RE.test(lines[i])) continue;
      const prev = i > 0 ? lines[i - 1] : '';
      if (ANNOT_RE.test(prev)) continue;
      const lineNo = styleStartLine + i;
      violations.push({ file: rel, line: lineNo, content: lines[i].trim() });
    }
  }
}

if (violations.length === 0) {
  console.info('✔ All :not() in src/lib/**/*.svelte are annotated.');
  process.exit(0);
}

console.error(`✘ ${violations.length} unannotated :not() occurrence(s) in src/lib/**/*.svelte:\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.content}`);
}
console.error('\nEvery :not() in a <style> block must be preceded (same line or line above) by');
console.error('one of: `// keep: a11y`, `// keep: structural`, `// keep: order`.');
console.error('See src/lib/styles/AGENTS.md.');
process.exit(1);
