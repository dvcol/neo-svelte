# Plan Index: Test coverage hardening (post-floating-migration)

## Why this work exists

The recent `554af81 feat(floating): drop skeleton and move to custom floating-ui wrapper` migration shipped end-to-end behind a TNR test suite. Two follow-ups remain:

1. **Eight tests are still skipped** across the jsdom and browser suites — most are pinned bugs surfaced during coverage work, one is a jsdom limitation. They need re-triage against the post-migration code, then either an unskip or a fix.
2. **Browser coverage is uneven.** Tooltip and the pop\* family have themed visual contracts; Menu has positioning + keyboard tests. Other components in the library still rely on jsdom-only coverage and cannot pin behaviors that depend on real layout, real `:focus-visible`, real pointer events, real `requestAnimationFrame`, or themed visual contracts.

## Plan files

- [`plan-a-skipped-test-triage.md`](./plan-a-skipped-test-triage.md) — Per-test triage and fix plan for the 8 skipped tests. **On hold** — documentation only; not executed in the current branch.
- [`plan-b-browser-tnr-expansion.md`](./plan-b-browser-tnr-expansion.md) — Second wave of browser TNR + visual coverage across four buckets (floating, drag-inputs, collapse/tabs, visual primitives). **Plan of record for this branch.**

## Conventions (apply to both plans)

Per [`AGENTS.md`](../../../AGENTS.md):

- jsdom tests live under `src/lib/**` with `*.test.{ts,svelte}` suffix and `tags: ['jsdom']`.
- Browser tests live under `demo/components/**` with `*.browser.test.ts` suffix and `tags: ['browser']`.
- Visual screenshot contracts use `tags: ['browser', 'visual']`. Filter via `pnpm vitest --project browser --tag visual`.
- Path aliases: `~/` → `src/lib/`, `src/` → `src/`, `test/` → `test/`, `demo/` → `demo/`.
- One-way import boundary: `demo/**` MAY import `src/lib/**`; `src/lib/**` MUST NOT import `demo/**`.
- Visual baselines live in `<scope>/__screenshots__/Test<Name>.browser.test.ts/`. Auto-failure attachments go to `.vitest-attachments/` (gitignored).

Three quality rules apply to every test:

- **TNR coverage** — pin observable behavior (state transitions, ARIA wiring, callback args/order, derived values). No tautologies.
- **Exhaustive option matrix** — for every boolean/enum prop that gates behavior, cover **on**, **off**, and at least one composition with another related flag.
- **Known bugs as `it.skip` + TODO** — write expected behavior as `it.skip(...)` with a grep-able `TODO:` marker, file:line reference, and inline bug summary. Surface in the PR description.

## Out of scope

- Adding new components from [`ROADMAP.md`](../../../ROADMAP.md).
- Refactoring `src/lib/**` for testability (Plan B is purely additive).
- Bug fixes for items surfaced during Plan B execution — those become fresh `it.skip` with TODOs and feed into Plan A's backlog.
