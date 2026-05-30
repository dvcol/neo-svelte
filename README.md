<h1 align="center">Welcome to <i>Neo Svelte</i></h1>
<h3 align="center">A neo-morphic ui library for svelte 5</h3>

<p>
  <img alt="pnpm version" src="https://img.shields.io/badge/pnpm-%3E%3D8.0.0-blue.svg" />
  <img alt="node version" src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
  <a href="https://github.com/dvcol/neo-svelte#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/dvcol/neo-svelte/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/dvcol/neo-svelte/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/dvcol/neo-svelte" />
  </a>
 <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
  </a>
</p>

## Description

Neo Svelte is a modern UI library for Svelte 5, bringing a sleek, soft, and futuristic feel to web applications through neumorphism and glassmorphism. It ships a collection of pre-styled, accessible, and highly customizable components designed to build polished UIs with minimal effort.

## Features

- **Svelte 5 native** — built on runes and snippets; peer dependency `svelte >=5.20`.
- **Neumorphism + glassmorphism** design language out of the box.
- **Themable** via `NeoThemeProvider` (light/dark, palette, elevation tokens, transitions).
- **Accessible** primitives — ARIA wired, keyboard navigation, focus traversal.
- **Tree-shakeable** subpath exports per category — import only what you need.

## Prerequisites

Neo Svelte is a Svelte 5 native library and will not work with prior versions of Svelte.

- svelte >= 5.20

## Install

```sh
pnpm add @dvcol/neo-svelte
```

## Getting Started

Wrap your app in the theme provider:

```svelte
<script lang="ts">
  import { NeoThemeProvider } from '@dvcol/neo-svelte';
</script>

<NeoThemeProvider>
  <!-- your app -->
</NeoThemeProvider>
```

### Subpath imports

Every category is exposed as a subpath export so bundlers can tree-shake aggressively:

```ts
import { NeoButton } from '@dvcol/neo-svelte/buttons';
import { NeoTooltip } from '@dvcol/neo-svelte/floating/tooltips';
import { NeoInput } from '@dvcol/neo-svelte/inputs';
```

See the full surface in the [`exports` map of `package.json`](./package.json).

### Theming

`NeoThemeProvider` accepts theme and mode props, and exposes context for nested components. For runtime switching, drop in one of the bundled selectors:

```svelte
<script lang="ts">
  import { NeoThemePicker, NeoThemeProvider } from '@dvcol/neo-svelte';
</script>

<NeoThemeProvider>
  <NeoThemePicker />
  <!-- your app -->
</NeoThemeProvider>
```

Source: [`src/lib/providers`](./src/lib/providers) — `NeoThemeProvider`, `NeoThemePicker`, `NeoThemeSelector`, `NeoTransitionSelector`.

## Demo

- Live demo: <https://dvcol.github.io/neo-svelte/>
- Demo source: [`demo/components`](./demo/components)

## Components

Neo Svelte covers: badge, buttons, cards, collapse, containers, cursor, divider, floating (dialog, drawer, menu, notification, portal, tooltips), form, icons, inputs, list, loading, media, nav, pill, progress, providers, skeletons, stepper, text. See [ROADMAP.md](./ROADMAP.md) for what's implemented and what's planned.

## Contributing

Contribution and testing conventions live in [AGENTS.md](./AGENTS.md). Bugs and feature requests go to the [issue tracker](https://github.com/dvcol/neo-svelte/issues).

## Author

- Github: [@dvcol](https://github.com/dvcol)

## Show your support

Give a ⭐️ if this project helped you!

 <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
</a>

## 📝 License

This project is [MIT](https://github.com/dvcol/neo-svelte/blob/master/LICENSE) licensed.
