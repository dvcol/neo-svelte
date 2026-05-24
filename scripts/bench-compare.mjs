#!/usr/bin/env node
/*
 * Compare a vitest --outputJson report against a committed baseline and fail
 * with non-zero exit if any bench regresses by more than `THRESHOLD` (10% by
 * default) in ops/sec.
 *
 * Usage:
 *   node scripts/bench-compare.mjs --report <path> --baseline <path> [--threshold 0.10]
 *   node scripts/bench-compare.mjs --report <path> --baseline <path> --update
 *
 * --update copies the report into the baseline path verbatim (for the manual
 * reset flow when an intentional perf change lands).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
function getArg(name) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  return argv[i + 1];
}
function hasFlag(name) {
  return argv.includes(`--${name}`);
}

const reportPath = getArg('report');
const baselinePath = getArg('baseline');
const threshold = Number(getArg('threshold') ?? '0.10');
const update = hasFlag('update');

if (!reportPath || !baselinePath) {
  console.error('usage: bench-compare --report <path> --baseline <path> [--threshold 0.10] [--update]');
  process.exit(2);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = resolve(__dirname, '..');
const reportAbs = resolve(cwd, reportPath);
const baselineAbs = resolve(cwd, baselinePath);

if (!existsSync(reportAbs)) {
  console.error(`bench-compare: report not found at ${reportAbs}`);
  process.exit(2);
}

if (update) {
  mkdirSync(dirname(baselineAbs), { recursive: true });
  writeFileSync(baselineAbs, readFileSync(reportAbs));
  console.info(`bench-compare: baseline updated → ${baselineAbs}`);
  process.exit(0);
}

if (!existsSync(baselineAbs)) {
  console.warn(`bench-compare: no baseline at ${baselineAbs} — seeding from report.`);
  mkdirSync(dirname(baselineAbs), { recursive: true });
  writeFileSync(baselineAbs, readFileSync(reportAbs));
  console.info('bench-compare: baseline seeded. Re-run after committing it.');
  process.exit(0);
}

const report = JSON.parse(readFileSync(reportAbs, 'utf8'));
const baseline = JSON.parse(readFileSync(baselineAbs, 'utf8'));

function indexBenchmarks(payload) {
  const out = new Map();
  for (const file of payload.files ?? []) {
    for (const group of file.groups ?? []) {
      for (const bench of group.benchmarks ?? []) {
        const key = `${group.fullName} :: ${bench.name}`;
        out.set(key, bench);
      }
    }
  }
  return out;
}

const reportIdx = indexBenchmarks(report);
const baselineIdx = indexBenchmarks(baseline);

const regressions = [];
const missing = [];
for (const [key, base] of baselineIdx) {
  const cur = reportIdx.get(key);
  if (!cur) {
    missing.push(key);
    continue;
  }
  // Lower hz = slower. Regression when (base - cur) / base > threshold.
  const drop = (base.hz - cur.hz) / base.hz;
  if (drop > threshold) {
    regressions.push({ key, baseline: base.hz, current: cur.hz, drop });
  }
}

if (regressions.length === 0 && missing.length === 0) {
  console.info(`bench-compare: ${reportIdx.size} benches within ${(threshold * 100).toFixed(1)}% of baseline.`);
  process.exit(0);
}

if (missing.length) {
  console.warn(`bench-compare: ${missing.length} bench(es) present in baseline but missing from report:`);
  for (const key of missing) console.warn(`  - ${key}`);
}

if (regressions.length) {
  console.error(`bench-compare: ${regressions.length} regression(s) > ${(threshold * 100).toFixed(1)}%:`);
  for (const r of regressions) {
    const pct = (r.drop * 100).toFixed(1);
    console.error(`  - ${r.key}`);
    console.error(`      baseline ${r.baseline.toFixed(2)} hz → current ${r.current.toFixed(2)} hz  (-${pct}%)`);
  }
  console.error('\nIf this regression is intentional, run with --update to refresh the baseline:');
  console.error(`  node scripts/bench-compare.mjs --report ${reportPath} --baseline ${baselinePath} --update`);
  process.exit(1);
}

process.exit(0);
