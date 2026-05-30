# Using `@dvcol/neo-svelte`

Agent-oriented top-level guide for consumers of the library. Concepts only — for per-component prop details rely on the TypeScript types and the per-scope `AGENTS.md` files (also published in the npm tarball under `dist/<scope>/AGENTS.md`).

If you are working _in this repo_, read [CONTRIBUTING.md](./CONTRIBUTING.md) instead.

## Install

```sh
pnpm add @dvcol/neo-svelte
# or: npm i @dvcol/neo-svelte / yarn add @dvcol/neo-svelte
```

Peer dependency: `svelte >= 5.29` (runes mode required). The library is ESM-only and ships type declarations.

## First render

`NeoThemeProvider` is **mandatory** at the app root. It registers CSS custom properties on a target element (defaults to `document.documentElement` with a `[neo-theme-root]` attribute) and exposes theme context to every component below it. Without it, components render unstyled.

```svelte
<script lang="ts">
  import { NeoThemeProvider } from '@dvcol/neo-svelte/providers';
</script>

<NeoThemeProvider>
  <!-- your app -->
</NeoThemeProvider>
```

## Subpath imports

Every category in [`exports`](./package.json) is a subpath. Prefer subpaths over the barrel — bundlers tree-shake more aggressively and Svelte 5 compilation stays scoped:

```ts
import { NeoButton } from '@dvcol/neo-svelte/buttons';
import { NeoTooltip } from '@dvcol/neo-svelte/floating/tooltips';
import { NeoInput } from '@dvcol/neo-svelte/inputs';
import { NeoThemePicker, NeoThemeProvider } from '@dvcol/neo-svelte/providers';
```

Available scopes (one per `dist/<scope>/`): `badge`, `buttons`, `cards`, `collapse`, `containers`, `cursor`, `divider`, `floating` (+ nested `dialog`, `drawer`, `menu`, `notification`, `portal`, `tooltips`), `form`, `icons`, `inputs`, `list`, `loading`, `media`, `nav`, `pill`, `progress`, `providers`, `skeletons`, `stepper`, `text`, `utils`. The barrel `import { ... } from '@dvcol/neo-svelte'` re-exports everything, but is not recommended.

## Svelte 5 idioms used everywhere

The component API uses runes-era patterns exclusively. Three conventions repeat across the library:

1. **Two-way binding via `$bindable`** — bindable outputs are surfaced as `bind:` props (e.g. `bind:checked`, `bind:open`, `bind:value`, `bind:hovered`, `bind:ref`). Use them; do not spread state in.
2. **Customization via snippets, never slots** — children, labels, icons, and item renderers are passed as Svelte 5 snippets (`children`, `label`, `icon`, `item`, ...). Most snippets receive a context object as their first arg (e.g. theme context, list-item context) — render with `{@render label?.(ctx)}` from the consumer side, but as a consumer you mostly pass `{#snippet ...}` blocks.
3. **No global stores** — shared state lives in Svelte context (theme, form). To consume it, mount components inside the relevant provider.

```svelte
<script lang="ts">
  import { NeoCheckbox } from '@dvcol/neo-svelte/inputs';

  let checked = $state(false);
</script>

<NeoCheckbox bind:checked>
  {#snippet label()}
    Accept terms
  {/snippet}
</NeoCheckbox>
```

## Theming

`NeoThemeProvider` accepts:

| Prop       | Type                                                                     | Notes                                                                                                                   |
| ---------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `theme`    | `'light' \| 'dark'`                                                      | Default: `prefers-color-scheme`.                                                                                        |
| `source`   | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`           | Direction of the simulated light source for neumorphic shadows. Default: `top-left`.                                    |
| `remember` | `boolean`                                                                | Persist theme/source/reset to `localStorage`. Default: `true`.                                                          |
| `reset`    | `boolean`                                                                | Inject the bundled CSS reset. Default: `true`.                                                                          |
| `target`   | `'self' \| HTMLElement \| ShadowRoot \| () => HTMLElement \| ShadowRoot` | Where the theme variables are scoped. Default: `document.documentElement`. Use `'self'` for shadow-DOM / island setups. |
| `tag`      | `keyof HTMLElementTagNameMap`                                            | Wrapper element. Default: `'div'`.                                                                                      |

Companion components (also in `@dvcol/neo-svelte/providers`):

- `NeoThemePicker` — full theme controls in one drop-in panel.
- `NeoThemeSelector`, `NeoSourceSelector`, `NeoResetSelector`, `NeoRememberSelector`, `NeoTransitionSelector` — individual switches you can compose into your own settings UI.

```svelte
<NeoThemeProvider theme="dark" source="top-right">
  <NeoThemePicker />
  <!-- app -->
</NeoThemeProvider>
```

### Design tokens

All visuals are driven by CSS custom properties (`--neo-*`). The full token surface ships in `dist/styles/`:

- `dist/styles/theme.scss` — root theme mixin (applied automatically by `NeoThemeProvider`).
- `dist/styles/common/colors.scss` — OKLCH semantic palette (`primary`, `secondary`, `error`, `warning`, `success`, `default`) with light/dark variants.
- `dist/styles/common/properties.css` — `@property` registrations for animatable customs (`--neo-angle`, `--neo-progress`, `--neo-source-color`, …).
- `dist/styles/common/{shadows,spacing,typography,easing,flex}.scss` — utility tokens.

To override a token in your app, set the variable on `[neo-theme-root]` (or any descendant scope):

```css
[neo-theme-root] {
  --neo-color-primary: oklch(0.7 0.18 250);
}
```

### Cascade layers

`<NeoThemeProvider>` declares a single library-wide cascade-layer order in its adopted stylesheet:

```css
@layer neo-reset, neo-theme, neo-components, neo-variants, neo-states;
```

Every component scoped style block is layered into one of `neo-components`, `neo-variants`, or `neo-states` (low → high precedence within the library). The headline guarantee:

> **Anything you write unlayered beats every neo-\* layer regardless of selector specificity.**

So a one-off override is just:

```css
.neo-button {
  border-radius: 0;
}
```

— no `:where()` tricks, no `html .neo-button` hacks. As long as the rule lives in _your_ CSS (not inside a `@layer ...;`), it wins.

If you want your overrides to participate in the cascade as a named layer, declare your own order including the `neo-*` layers and pin your layer between two of them. The recommended interleave gives consumer overrides the precedence the library used to grant via specificity:

```css
@layer neo-reset, app-base, neo-theme, neo-components, app-overrides, neo-variants, neo-states;

@layer app-overrides {
  .neo-button { border-radius: 0; } /* beats neo-components, loses to neo-variants/neo-states */
}
```

`<NeoThemeProvider>` is required for both `--neo-*` tokens _and_ deterministic cascade ordering. Components rendered without the provider lose both — they will neither pick up theme variables nor a stable layer order. For shadow-DOM consumers, mount the provider inside the shadow root; for portal'd content rendered to `document.body`, mount a separate provider around the portal target (or use `NeoPortalTarget` / `NeoPortalContainer` to keep portals inside your shadow tree).

> ⚠️ **Breaking change in this release.** Pre-cascade-layers, scoped library rules with Svelte's hashed selectors outranked most consumer CSS through specificity. Now, every library rule lives in a layer. Audit any selector targeting `.neo-*` in your app: stale dead overrides that previously failed silently will now apply. Either remove them or wrap intentional overrides in `@layer app-overrides { ... }` with the recommended order declaration above.

## Context-based state, not stores

Two contexts cover most consumer needs:

- **Theme context** — provided by `NeoThemeProvider`, consumed implicitly by every styled component. Available programmatically via the `children` snippet's first arg if you need `theme`, `source`, `transition`, `ready`.
- **Form context** — provided by `NeoForm` / `NeoFieldSet` (from `@dvcol/neo-svelte/form`). Inputs nested inside auto-register; from outside the form they remain standalone. Use this when wrapping multiple inputs and you want validation/dirty state without prop-drilling. See `dist/form/AGENTS.md`.

## Floating primitives (dialogs, drawers, menus, tooltips, notifications)

Everything under `floating/*` is built on `@floating-ui/dom` and shares a common config surface:

- **`placement`** — `'top' | 'bottom' | 'left' | 'right'` plus `-start` / `-end` variants.
- **Open triggers** — `openOnHover`, `openOnFocus`, `openOnClick` (composable; e.g. tooltip = hover+focus, menu = click).
- **`keepOpenOnHover` / `keepOpenOnFocus`** — pointer- and focus-bridge bookkeeping so a hovered tooltip stays open while the cursor crosses into the floating element.
- **Middleware options** — `flip`, `shift`, `size`, `autoPlacement` exposed as boolean-or-options props on the appropriate components.
- **`modal`** — for dialogs/drawers; renders inside the native `<dialog>` modal stack.
- **`closable`** — adds the close affordance and wires the close action.

Floating elements **must** be inside a `NeoThemeProvider`; portaled overlays read theme tokens off `[neo-theme-root]`. See `dist/floating/AGENTS.md` and the nested scope guides.

## Accessibility

Components ship ARIA wiring (`role`, `aria-expanded`, `aria-controls`, `aria-pressed`, focus traversal, keyboard handlers). The consumer's responsibility:

- **Provide labels** — for icon-only triggers, pass an `aria-label` (or a visually-hidden label snippet).
- **Maintain reading order** — when portaling overlays, keep the trigger's logical relationship clear.
- **Reduced motion** — the bundled transitions honor `prefers-reduced-motion`; do not override unless you replicate the same fallback.

## Reusable utilities

`@dvcol/neo-svelte/utils` exposes the same helpers the components use internally — color manipulation, shadow / elevation builders, border-radius helpers, HTML-element typing helpers. Reach for these before writing your own to stay token-consistent.

## Per-scope guides

Each scope under `src/lib/<scope>/` has its own `AGENTS.md` (published as `dist/<scope>/AGENTS.md`) with import path, component list, scope-specific concepts, common patterns, and gotchas:

| Scope                   | Import path                               | Covers                                                                                                                                                                  |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `badge`                 | `@dvcol/neo-svelte/badge`                 | `NeoBadge`                                                                                                                                                              |
| `buttons`               | `@dvcol/neo-svelte/buttons`               | `NeoButton`, `NeoButtonGroup`, `NeoArrowButton`, `NeoCheckboxButton`, `NeoRadioButton`, `NeoSwitchButton`, `NeoCancelButton`, `NeoCloseButton`                          |
| `cards`                 | `@dvcol/neo-svelte/cards`                 | `NeoCard` and variants                                                                                                                                                  |
| `collapse`              | `@dvcol/neo-svelte/collapse`              | `NeoCollapse`                                                                                                                                                           |
| `containers`            | `@dvcol/neo-svelte/containers`            | `NeoTransitionContainer`                                                                                                                                                |
| `cursor`                | `@dvcol/neo-svelte/cursor`                | Custom cursor effects                                                                                                                                                   |
| `divider`               | `@dvcol/neo-svelte/divider`               | `NeoDivider`                                                                                                                                                            |
| `floating`              | `@dvcol/neo-svelte/floating`              | Cross-cutting floating primitives + `NeoConfirm`, `NeoHandle`, `NeoFloatingStepper`                                                                                     |
| `floating/dialog`       | `@dvcol/neo-svelte/floating/dialog`       | `NeoDialog`                                                                                                                                                             |
| `floating/drawer`       | `@dvcol/neo-svelte/floating/drawer`       | `NeoDrawer`                                                                                                                                                             |
| `floating/menu`         | `@dvcol/neo-svelte/floating/menu`         | `NeoMenu` and submenu cascades                                                                                                                                          |
| `floating/notification` | `@dvcol/neo-svelte/floating/notification` | Toasts / banners                                                                                                                                                        |
| `floating/portal`       | `@dvcol/neo-svelte/floating/portal`       | `NeoPortal`                                                                                                                                                             |
| `floating/tooltips`     | `@dvcol/neo-svelte/floating/tooltips`     | `NeoTooltip`                                                                                                                                                            |
| `form`                  | `@dvcol/neo-svelte/form`                  | `NeoForm`, `NeoFieldSet`, form context                                                                                                                                  |
| `icons`                 | `@dvcol/neo-svelte/icons`                 | 75+ pre-built icon components                                                                                                                                           |
| `inputs`                | `@dvcol/neo-svelte/inputs`                | `NeoInput`, `NeoCheckbox`, `NeoPassword`, `NeoFilePicker`, `NeoDateTime`, `NeoNumberStep`, `NeoSlider`, `NeoSelect`, `NeoTextArea`, `NeoNativeSelect`, `NeoColorPicker` |
| `list`                  | `@dvcol/neo-svelte/list`                  | `NeoList`, `NeoVirtualList`, `NeoListSearch`                                                                                                                            |
| `loading`               | `@dvcol/neo-svelte/loading`               | Spinners and loaders                                                                                                                                                    |
| `media`                 | `@dvcol/neo-svelte/media`                 | `NeoImage`                                                                                                                                                              |
| `nav`                   | `@dvcol/neo-svelte/nav`                   | `NeoTabs`, `NeoTabsPanel`                                                                                                                                               |
| `pill`                  | `@dvcol/neo-svelte/pill`                  | `NeoPill`                                                                                                                                                               |
| `progress`              | `@dvcol/neo-svelte/progress`              | Progress bars                                                                                                                                                           |
| `providers`             | `@dvcol/neo-svelte/providers`             | `NeoThemeProvider`, `NeoThemePicker`, theme selectors                                                                                                                   |
| `skeletons`             | `@dvcol/neo-svelte/skeletons`             | Skeleton loaders                                                                                                                                                        |
| `stepper`               | `@dvcol/neo-svelte/stepper`               | `NeoStepper`                                                                                                                                                            |
| `text`                  | `@dvcol/neo-svelte/text`                  | `NeoEllipsis`, `NeoHtml`, `NeoMark`, `NeoTypewriter`, `NeoScrollShadow`                                                                                                 |
| `utils`                 | `@dvcol/neo-svelte/utils`                 | Color / shadow / border-radius helpers                                                                                                                                  |

## Live demo & roadmap

- Live showcase: <https://dvcol.github.io/neo-svelte/> — every component has a `Demo<Name>` page with exhaustive prop variations.
- [`ROADMAP.md`](./ROADMAP.md) — what's shipped vs. planned.

## Quick reference

```svelte
<script lang="ts">
  import { NeoButton } from '@dvcol/neo-svelte/buttons';
  import { NeoTooltip } from '@dvcol/neo-svelte/floating/tooltips';
  import { NeoFieldSet, NeoForm } from '@dvcol/neo-svelte/form';
  import { NeoCheckbox, NeoInput } from '@dvcol/neo-svelte/inputs';
  import { NeoThemeProvider } from '@dvcol/neo-svelte/providers';

  let email = $state('');
  let agreed = $state(false);
</script>

<NeoThemeProvider>
  <NeoForm onsubmit={() => console.info({ email, agreed })}>
    <NeoFieldSet legend="Sign up">
      <NeoInput bind:value={email} type="email" placeholder="Email" required />
      <NeoCheckbox bind:checked={agreed}>
        {#snippet label()}I agree{/snippet}
      </NeoCheckbox>
    </NeoFieldSet>

    <NeoTooltip placement="top" openOnHover openOnFocus>
      {#snippet trigger()}
        <NeoButton type="submit" disabled={!agreed}>Submit</NeoButton>
      {/snippet}
      Submits the form
    </NeoTooltip>
  </NeoForm>
</NeoThemeProvider>
```
