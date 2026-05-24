# Bench baselines

Committed `baseline.unit.json` / `baseline.browser.json` are the perf-regression
gate inputs. `pnpm test:bench` runs the benches, writes a fresh `report.*.json`
(gitignored), and compares ops/sec against the baseline. A drop greater than
the threshold (10%, set in `scripts/bench-compare.mjs`) fails the gate.

## When to refresh the baseline

If you intentionally regress perf (or improve it past the noise floor and want
the gate to track the new ceiling), refresh both baselines:

```sh
pnpm test:bench:update
git add src/lib/list/__benchmarks__/baseline.{unit,browser}.json
git commit -m "chore(bench): refresh baselines (<reason>)"
```

`test:bench:update` re-runs unit + browser benches and overwrites the baselines
with the latest report. Always commit baseline changes alongside the perf-
affecting code change so reviewers can see the trade-off.

## What's committed vs. ignored

- `baseline.unit.json`, `baseline.browser.json` — committed (gate inputs).
- `report.unit.json`, `report.browser.json` — gitignored (per-run output).
