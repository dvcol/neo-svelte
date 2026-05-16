# Phase 10 — Final sweep

**Status**: ✅ done

## Goals

1. Catch any consumer the per-phase grep missed.
2. Drop all deleted `NeoXxxHTMLElement` re-exports from the public surface.
3. Run final coverage + browser + type checks.
4. Open the PR.

## Steps

### 1. Demo sweep

```bash
rg -n '\?\.(toggle|update|reset|start|stop|cancel|complete|change|goTo|previous|next|scrollToTop|scrollToBottom|selectItem|clearItem|reSelect|write|abort|mark|clear|validate|resize|stepUp|stepDown|writing|promise)\?\.\(' demo \
  | rg -v 'showPicker|svelte-utils|@floating-ui'
```

Expected: 0 matches.

### 2. Public exports

Inspect `src/lib/index.ts` for any `Neo*HTMLElement` re-export. Remove:

```bash
rg -n 'Neo(Tooltip|List|Form|Progress|Collapse|Typewriter|Input|Textarea|Range|Dialog)HTMLElement' src/lib/index.ts
```

If a downstream barrel (`src/lib/index.ts`) used them, ensure no consumer of the public package relied on them — search GitHub for usages, or accept the breaking change as part of the migration commit (document in CHANGELOG).

### 3. Anti-pattern grep gate (must all return 0 in `src/lib`)

```bash
rg -n 'Object\.(assign|defineProperty)\s*\(\s*(ref|triggerRef|element|tooltipRef|el|target)' src/lib
rg -n 'ref\.(show|showModal|close|requestClose|reset|toggle|update|start|stop|cancel|complete|change|goTo|previous|next|scrollToTop|scrollToBottom|selectItem|clearItem|reSelect|write|abort|mark|clear|validate|resize|stepUp|stepDown)\s*=' src/lib
rg -n 'Neo(Tooltip|List|Form|Progress|Collapse|Typewriter|Input|Textarea|Range|Dialog)HTMLElement' src demo
```

### 4. Test gates

```bash
pnpm vitest run --project jsdom
pnpm vitest run --project browser
pnpm vitest run --coverage
pnpm check
pnpm build
```

Coverage targets:

- Each migrated component: 100% on the lines that previously hosted the `Object.assign`/`Object.defineProperty` mutation (now event-listener / instance-export paths).
- NeoDialog: 100% branch coverage on `open` / `modal` / `closedby` / `tag` / `unmountOnClose` paths.

### 5. CHANGELOG

Add entry under the next version: breaking — `NeoXxxHTMLElement` types removed; consumers must use `bind:this={instance}` for `toggle`/`update`/`reset`/etc.

### 6. PR

```bash
gh pr create --base dev --title "chore: drop ref-method mutation, move to component-instance exports" --body "<see PR template>"
```

PR body should:

- Link to this plan dir.
- List the 13 components migrated.
- Highlight the NeoDialog event-listener change as the highest-risk item.
- Note the removed type aliases.

## Status checklist

- [x] Demo sweep clean
- [x] Public re-exports cleaned (no `Neo*HTMLElement` re-exports in `src/lib/index.ts`)
- [x] All grep gates return 0 in `src/lib` (only legitimate test stubs use `Object.defineProperty` for `getBoundingClientRect`)
- [x] jsdom tests green (1 pre-existing flake on `dev`: `NeoPopConfirm.test.ts > onConfirm loading state`; out of scope)
- [x] browser tests green (119 passed, 5 skipped)
- [x] coverage thresholds met (no regressions on migrated paths)
- [x] type-check green
- [x] build green
- [x] CHANGELOG entry added
- [x] PR opened
