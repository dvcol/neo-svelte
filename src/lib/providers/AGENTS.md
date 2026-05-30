# `@dvcol/neo-svelte/providers`

```ts
import {
  NeoRememberSelector,
  NeoResetSelector,
  NeoSourceSelector,
  NeoThemePicker,
  NeoThemeProvider,
  NeoThemeSelector,
  NeoThemeSelectors,
  NeoTransitionSelector,
} from '@dvcol/neo-svelte/providers';
```

## Components

- `NeoThemeProvider` — **mandatory app-root wrapper.** Registers CSS custom properties on a target element and exposes theme context.
- `NeoThemePicker` — drop-in panel exposing every theme control at once. Background/text color overrides are scoped per theme: each theme remembers its own override and the picker swatch + applied CSS var swap automatically when the active theme changes.
- `NeoThemeSelector`, `NeoSourceSelector`, `NeoResetSelector`, `NeoRememberSelector`, `NeoTransitionSelector` — individual switches you can compose.
- `NeoThemeSelectors` — convenience grouping of the most common switches.

## `NeoThemeProvider` props

| Prop       | Type                                                                     | Default                             |
| ---------- | ------------------------------------------------------------------------ | ----------------------------------- |
| `theme`    | `'light' \| 'dark'`                                                      | `prefers-color-scheme`              |
| `source`   | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`           | `'top-left'`                        |
| `remember` | `boolean`                                                                | `true` (persists to `localStorage`) |
| `reset`    | `boolean`                                                                | `true` (injects bundled CSS reset)  |
| `target`   | `'self' \| HTMLElement \| ShadowRoot \| () => HTMLElement \| ShadowRoot` | `document.documentElement`          |
| `tag`      | `keyof HTMLElementTagNameMap`                                            | `'div'`                             |

## Concepts

- The provider sets `[neo-theme-root]` on the target. All component CSS reads tokens off that attribute selector.
- Theme switching uses the View Transitions API when available, with a circle-start animation. Disable via `transition="none"` on the selector if you don't want it.
- The `children` snippet receives the live theme context — useful for inline UI that depends on `theme`/`source` without re-reading from DOM.

## Gotchas

- Mount `NeoThemeProvider` exactly once. Multiple providers in the same tree create competing token scopes.
- For shadow-DOM islands, set `target="self"` and place the provider inside the shadow root.
- `remember={false}` opts out of `localStorage`; useful for SSR or multi-tenant setups.

See also: [USAGE.md](../../../USAGE.md) (top-level theming concepts).
