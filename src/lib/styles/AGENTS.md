# `@dvcol/neo-svelte/styles`

> SCSS primitives shared by every component. Theme tokens, reset, typography, animation keyframes, and the cascade-layer mixins.

These files are not meant to be imported by consumers directly — they're tooling for component authors and for `<NeoThemeProvider>`. Consumer-facing tokens are documented in [`USAGE.md`](../../../USAGE.md).

## Files

| File                     | Purpose                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `layers.scss`            | **Single owner** of every `@layer` literal. Order + wrap mixins. See below.              |
| `reset.scss`             | `reset()` mixin (raw rules) and `nested($root)` mixin (gated by `[neo-reset]`).          |
| `theme.scss`             | `theme()` mixin: CSS custom properties, color schemes, transitions.                      |
| `transition.scss`        | Transition tokens consumed by `theme()`.                                                 |
| `animation.scss`         | `@keyframes` definitions and animation-emitting mixins (skeleton, pulse, indeterminate). |
| `mixin.scss`             | Reusable component mixins (`pulse`, `skeleton`, `fade-scroll`, `scrollbar`, …).          |
| `common/properties.css`  | `@property --neo-*` registrations. Loaded as raw CSS at parse time.                      |
| `common/colors.scss`     | Semantic color tokens (primary, error, warning, success, dark-theme).                    |
| `common/easing.scss`     | Easing/timing function tokens.                                                           |
| `common/typography.scss` | Font sizes, weights, line-heights.                                                       |
| `common/shadows.scss`    | Shadow utility tokens.                                                                   |
| `common/spacing.scss`    | Spacing scale tokens.                                                                    |
| `common/utils.scss`      | Misc utility classes / mixins.                                                           |
| `common/flex.scss`       | Flex column/row helpers.                                                                 |
| `common/media.scss`      | Media-query helpers.                                                                     |

## Cascade layers — the contract

Every component scoped style block opts its rules into a named layer via mixins exposed by `layers.scss`. The layer **order** is declared exactly once, by `<NeoThemeProvider>`, in its adopted stylesheet.

Order (low → high precedence within the library):

```
@layer neo-reset, neo-theme, neo-components, neo-variants, neo-states;
```

Headline guarantee: **anything a consumer writes unlayered beats every neo-\* layer regardless of specificity.**

Consumers can interleave their own layers between any pair, e.g.:

```css
@layer neo-reset, app-base, neo-theme, neo-components, app-overrides, neo-variants, neo-states;
```

### Mixins

| Mixin                   | Use                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `layers.order`          | **Provider-only.** Emits the order declaration. Do not call from a component.      |
| `layers.neo-reset`      | Wrap reset rules.                                                                  |
| `layers.neo-theme`      | Wrap theme rules.                                                                  |
| `layers.neo-components` | Wrap base component rules.                                                         |
| `layers.neo-variants`   | Wrap variant-modifier rules (e.g. `&.neo-glass`, `&.neo-flat`, `&.neo-pressed`).   |
| `layers.neo-states`     | Wrap interaction-state rules (`:hover`, `:active`, `:focus-visible`, `:disabled`). |

`@layer` literals must not appear anywhere else in the codebase. Renaming or reordering is a one-file edit in `layers.scss`.

## Authoring rules for component `<style>` blocks

Every component `<style lang="scss">` block must:

1. **`@use 'src/lib/styles/layers' as layers;`** at the top, alongside other style imports.
2. **Wrap all rules** in one or more of `@include layers.neo-{components,variants,states} { ... }`. No raw `@layer` literals.
3. **Annotate every `:not()`** survivor with `// keep: <reason>` on the same line or the line immediately above. Reasons: `a11y`, `structural`, `order`. The `pnpm lint:not-annotations` CI step rejects unannotated `:not()`.
4. **Hoist `@keyframes`** — and any mixin call that emits `@keyframes` (`@include animation.indeterminate-fast(...)`, etc.) — _outside_ the layer wrappers, alongside imports. Keyframes are name-resolved globally; layer membership doesn't change cascade behavior for them but creates a misleading mental model.
5. **Within `@include layers.neo-states { ... }`**, declare rules in this order so source-order ties resolve correctly: `:focus-visible`, `:hover`, `:active`, `:disabled, .neo-loading, [aria-busy='true']`.
6. **Within `@include layers.neo-variants { ... }`**, declare combinable variants (`.neo-glass`, `.neo-flat`) before exclusive overrides (`.neo-borderless`, `.neo-pressed`) so the latter win on combination.

### Allowed `:not()` annotations

| Annotation            | Use when                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `// keep: a11y`       | Excluding a state with semantic intent: `:disabled`, `[aria-busy]`, `[disabled]`, `:placeholder-shown`, `[hidden]`, `[inert]`. |
| `// keep: structural` | Excluding a positional pseudo (`:only-child`, `:first-child`, `:last-child`, `:nth-*`) or a `:has()` propagation guard.        |
| `// keep: order`      | Set subtraction within a variant family that is awkward or impossible to re-express via layer ordering.                        |

Pure specificity guards (e.g. `&:hover:not(.neo-pressed, .neo-flat)` solely to keep `:hover` from beating a variant's own `:hover`) **must** be removed — express the cascade via layer ordering instead.

### Example

```scss
<style lang="scss">
  @use 'src/lib/styles/layers' as layers;
  @use 'src/lib/styles/animation' as animation;

  /* Keyframes outside the cascade. */
  @include animation.indeterminate-fast(right, X);

  @include layers.neo-components {
    .neo-button {
      /* base properties */
    }
  }

  @include layers.neo-variants {
    .neo-button {
      &.neo-glass { /* ... */ }
      &.neo-flat  { /* ... */ }
    }
  }

  @include layers.neo-states {
    .neo-button {
      &:hover { /* ... */ }
      &:active { /* ... */ }
      // keep: a11y
      &:disabled,
      &.neo-loading {
        /* later in layer = wins over :active */
      }
    }
  }
</style>
```

## Runtime toggles

`NeoResetSelector` / `NeoTransitionSelector` toggle reset / animations by setting attributes on the provider host (`[neo-reset]`, `[neo-transition]`). The reset rules in `reset.scss` are gated by these attribute selectors, not by un-adopting a sheet. Attribute gating and cascade layers are orthogonal: gating decides _whether_ a rule matches; layers decide _how_ it outranks consumer overrides.
