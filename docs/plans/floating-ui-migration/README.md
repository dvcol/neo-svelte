# Plan Index: Test-then-Migrate `@skeletonlabs/floating-ui-svelte`

## Why this work exists

`@skeletonlabs/floating-ui-svelte` is dead upstream (skeletonlabs/floating-ui-svelte#169). The repo currently depends on it from **5 source files** and ships **zero unit tests** (only a `describe.todo` stub in `test/index.test.ts`). Migrating directly is risky — positioning, interaction wiring, and ARIA behavior are subtle and currently unverified. We therefore:

1. First establish a real TNR (true-and-real, not just coverage) test suite across `src/lib/`, locking current behavior as a contract.
2. Then swap the implementation to `@floating-ui/dom` driven by Svelte 5 `{@attach}` (per Skeleton's cookbook). The contract suite stays green across the swap; failures = regressions.

## Locked decisions

- **Test runtime:** Hybrid — keep jsdom for behavior/ARIA/state, add `@vitest/browser` (Playwright provider) for positioning, autoUpdate, focus, keyboard, real pointer events, scroll-driven behavior.
- **Migration shape:** Svelte 5 `{@attach}` calling `@floating-ui/dom` directly. No long-lived in-repo "useFloating" framework — only thin attachment factories.
- **Coverage scope (Phase 1):** Whole `src/lib/` library, with priority on the floating-ui consumers that gate Phase 2.
- **TDD style:** Tests-as-contract. Phase 1 lands green against current skeleton-based code. Phase 2 swaps implementation; the same suite must stay green.

## Plan files

This work is split into three plan files. They are designed to be read independently — each starts with a self-contained context recap so later phases can be executed without re-reading earlier ones.

- [`phase-1.md`](./phase-1.md) — Phase 0 (test infrastructure) + Phase 1 (TNR coverage of all of `src/lib/`).
- [`phase-2.md`](./phase-2.md) — Phase 2 (first migration attempt to `@floating-ui/dom` via custom thin wrapper).
- [`phase-3.md`](./phase-3.md) — Splinter the failed phase-2 attempt; re-port skeleton 1-1 in Svelte 5 idiomatic; widen Menu/Range browser coverage. **Current plan of record.**

## Direct migration surface (the only files that import `@skeletonlabs/floating-ui-svelte`)

- `src/lib/floating/tooltips/NeoTooltip.svelte` — primary consumer (`useFloating`, `useHover`, `useFocus`, `useClick`, `useDismiss`, `useRole`, `useInteractions`, `offset`, `flip`, `size`, `autoPlacement`)
- `src/lib/floating/tooltips/neo-tooltip.model.ts` — re-exported types (`UseFloatingOptions`, `UseFloatingReturn`, `Use{Hover,Focus,Click,Dismiss,Role}Options`, `offset`)
- `src/lib/floating/common/neo-placement.model.ts` — `type UseFloatingOptions` only (placement union extraction)
- `src/lib/inputs/NeoRange.svelte` — `useFloating`, `flip`, `offset`
- `src/lib/inputs/neo-range.model.ts` — `type UseFloatingOptions`

Transitively coupled (no skeleton import, but inherits behavior): `NeoMenu*`, `NeoPopSelect`, `NeoPopConfirm`, `NeoPopStepper`, `NeoSelect`. Dialog/Drawer/Notification/Portal use no floating-ui at all (native `<dialog>`, custom movable, fixed-position stack) but are still in scope for the safety net.

## What this plan deliberately does NOT do

- No new public abstraction layer or "neo-floating" library — the `use-floating.svelte.ts` primitives stay internal and minimal.
- No coverage threshold gate — we judge tests qualitatively (TNR), not by %.
- No e2e/Playwright suite separate from `@vitest/browser` — keeps tooling count low.
- No backwards-compat shim for the skeleton API — direct cutover behind the contract suite.
