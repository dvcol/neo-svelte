<h1 align="center">Welcome to <i>Neo Svelte</i></h1>
<h3 align="center">A neo-morphic ui library for svelte 5</h3>

<p>
  <img src="https://img.shields.io/badge/pnpm-%3E%3D8.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
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

Neo Svelte is a modern UI library for Svelte 5, designed to bring a sleek, soft, and futuristic look to web applications with neumorphism and glassmorphism design elements.

It provides a collection of pre-styled, accessible, and highly customizable components that make it easy to build visually appealing UIs with minimal effort.

## Prerequisites

Note: Svelte Simple Router is a svelte 5 native library, and will not work with prior versions of svelte.

- svelte >= 5.0.0

## Install

```sh
pnpm add @dvcol/neo-svelte
```

## Getting Started

Wrap any component inside the style provider

```svelte
<script lang="ts">
  import { NeoThemeProvider } from '@dvcol/neo-svelte';
</script>

<NeoThemeProvider>
  ...
</NeoThemeProvider>
```

Then import any of the components you want to use.

See examples in the demo (code [here](https://github.com/dvcol/neo-svelte/tree/fed1b3f42e863e18968c77256527a837957b3304/demo/components), live demo [here](https://dvcol.github.io/neo-svelte/#/inputs)).

## TODO

- [ ] @media any-pointer:coarse any-hover:none
- [ ] move to inline/bloc to support writing-mode
- [x] Buttons
  - [x] toggle
  - [x] groups
  - [ ] floating (speed dial)
  - [ ] split
- [x] tags/pills
  - [x] badge
- [x] Tabs
- [x] Card
- [x] Inputs
  - [x] Password
  - [x] Pin
  - [x] Color picker
  - [x] checkbox
  - [x] radio
- [x] Text Area
  - [ ] @ / # tags
- [x] file picker
  - [x] drag & drop
  - [x] multiple
- [x] numbers
  - [x] digits
  - [ ] phone
  - [ ] credit card
  - [x] pin
- [x] time/date/week
  - [ ] range
- [x] switch
- [x] slider
  - [x] range
  - [x] inset
  - [x] custom before-after
  - [x] steps
  - [x] ticks
  - [ ] vertical
  - [ ] circular
  - [ ] rating (stars)
- [x] select
  - [x] native
  - [x] custom
- [x] form

  - [x] validation
  - [x] fieldset

- [x] list

  - [x] select
    - [x] multiple
    - [x] disabled
    - [x] readonly
    - [x] sections
    - [x] keyboard navigation
  - [x] scroll shadow
  - [ ] virtualized
  - [ ] infinite scroll
  - [ ] drag & drop
  - [ ] pagination
  - [ ] drag & drop
  - [ ] timeline
  - [ ] pull/scroll to refresh
  - [x] filter
  - [x] sort
  - [ ] tree

- [x] progress

  - [x] vertical
  - [ ] circular
  - [ ] meter (progress group)
  - [x] ticks
  - [x] min/max
  - [x] indeterminate
  - [x] color/background
  - [x] duration/timeout
  - [x] start/stop/cancel/finish/reset

- [x] collapse

  - [x] description
  - [x] vertical
  - [x] accordion
  - [x] controlled (min, max, toggle)

- [x] stepper

  - [x] vertical
  - [ ] collapse
  - [x] progress/dots
  - [x] controls (cancel, next, prev, finish)
  - [x] touch swipe

- [x] tooltip

  - [x] popconfirm
  - [x] popselect
  - [x] popstepper

- [ ] Modal/dialog

  - [x] HTML Dialog
    - [x] animation (slide/fade)
    - [x] stepper
    - [x] confirm
    - [x] backdrop
    - [x] position (center, top, bottom, left, right)
    - [x] custom tag (not dialog)
    - [x] draggable
  - [ ] HTML Popover
  - [x] Drawer
    - [x] size (width, height)
    - [x] scrollable
    - [x] close button
    - [ ] persistant

- [x] menu

  - [x] nested menus
  - [ ] collapsable (expand below)
  - [ ] menu pane (multi column, expand right/left)
  - [ ] menu list
  - [x] Dropdown
  - [x] Sections
  - [x] Dividers

- [ ] Chat
  - [ ] infinite scroll
  - [ ] virtual scroll
  - [ ] async
  - [ ] stream
  - [ ] generative text animation
  - [ ] scroll to bottom
  - [ ] typing indicator
  - [ ] read indicator
  - [ ] reactions
  - [ ] threads
  - [ ] @ / # tags
  - [ ] mentions
  - [ ] attachments
  - [ ] gifs/images
  - [ ] videos
  - [ ] audio
  - [ ] custom cards (contact, etc.)
  - [ ] custom bubbles
  - [ ] custom input
- [ ] table
- [ ] pagination

- [ ] auto-complete

  - [ ] @ / # tags
  - [ ] select
  - [ ] multiple
  - [ ] auto-complete
    - [ ] @ / # tags

- [ ] image
  - [ ] videos
  - [ ] carousel
  - [ ] parallax
- [ ] avatar

  - [x] badge

- [x] PointerTracker (Pointer Events)

  - [x] track cursor
  - [x] grow to tabindex targets
  - [x] twist, tilt & pressure support (for supported pencils)

- [ ] text

  - [ ] elevation
  - [ ] code block (shiki ?)
  - [x] ellipsis
  - [x] mark
  - [x] scroll & shadow
  - [x] typing animation
    - [x] fake cursor
    - [x] fake typos
    - [x] random pauses

- [ ] Alerts
  - [ ] toast
  - [ ] rich notification
- [ ] container
  - [x] transition
  - [ ] split/resizable
  - [ ] flex
  - [ ] grid
  - [ ] masonry ?

## Author

- Github: [@dvcol](https://github.com/dvcol)

## Show your support

Give a ⭐️ if this project helped you!

 <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
</a>

## 📝 License

This project is [MIT](https://github.com/dvcol/neo-svelte/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
