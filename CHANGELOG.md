# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## Unreleased

### ⚠ BREAKING CHANGES

* **styles:** introduce cascade-layer hierarchy (`@layer neo-reset, neo-theme, neo-components, neo-variants, neo-states`). All library `<style>` blocks are now opt-in to `@layer neo-components`, and `<NeoThemeProvider>` is the single emission site for the order declaration. Consumer overrides that previously won via specificity bumps may now lose to layered library rules — wrap them in an interleaved layer (e.g. `@layer neo-reset, neo-theme, neo-components, app-overrides, neo-variants, neo-states;` then declare overrides in `app-overrides`). Plain unlayered overrides continue to win over every `neo-*` layer regardless of specificity. See `src/lib/styles/USAGE.md` and `src/lib/styles/AGENTS.md` for the contract and migration guide.
* **components:** drop `NeoXxxHTMLElement` ref-method aliases across the library. Component-level methods (`toggle`, `update`, `reset`, `requestClose`, `validate`, `clear`, `mark`, `change`, `start`, `stop`, `cancel`, `complete`, `goTo`, `goPrevious`, `goNext`, `previous`, `next`, `scrollToTop`, `scrollToBottom`, `selectItem`, `clearItem`, `reSelect`, `write`, `abort`, `resize`, `stepUp`, `stepDown`) are no longer attached to the bound DOM `ref`. Consumers must use `bind:this={instance}` on the component to access them. Affected: `NeoTooltip`, `NeoForm`, `NeoProgress`, `NeoStepper`, `NeoCollapse`, `NeoList`, `NeoSimpleList`, `NeoTypewriter`, `NeoBaseInput`, `NeoTextarea`, `NeoPin`, `NeoRange`, `NeoDialog`. `NeoDialog` additionally drops the `Object.defineProperty(ref, 'returnValue', …)` accessor and the `show`/`showModal`/`close`/`requestClose` monkey-patches; the `bindable` `open` is now synced via native `'close'` and `'cancel'` events on the dialog element.

## [1.2.0](https://github.com/dvcol/neo-svelte/compare/v1.1.2...v1.2.0) (2026-03-21)


### Features

* **border:** widen border-radius range ([fa5f824](https://github.com/dvcol/neo-svelte/commit/fa5f824dbb4647023d228ad7ad0d8afce00ba9a2))
* **buttons:** adds image icon support to buttons & pills ([3e02aca](https://github.com/dvcol/neo-svelte/commit/3e02aca68fc74cd0daa877496f6f71f8054e193f))
* **buttons:** alter background when hovering/activating buttons ([1e82f4c](https://github.com/dvcol/neo-svelte/commit/1e82f4c0f7ae75b2eb1b0b9a6f949ffc1a010f32))
* **icon:** fix unplug & rework props ([b42a890](https://github.com/dvcol/neo-svelte/commit/b42a89021766f52421aed4664ce6be78658d6b4b))
* **icon:** make watch enter toggle ([820b795](https://github.com/dvcol/neo-svelte/commit/820b795fe2e81f5dabb3a1801a922c9c78dd0b5a))
* **icon:** rework selector & export some icons ([d58de75](https://github.com/dvcol/neo-svelte/commit/d58de75733a2406ee08d8afc28b4e09dab41ae4e))
* **image:** support error & fallback ([83a8f5d](https://github.com/dvcol/neo-svelte/commit/83a8f5d0ca0ce53f36316adcdd3c575aeefa328d))
* **list:** add transition to virtual list ([684b1a5](https://github.com/dvcol/neo-svelte/commit/684b1a52895e503c55fdcd358604321bdf0c6f16))
* **list:** adds media to base loader ([8807c1e](https://github.com/dvcol/neo-svelte/commit/8807c1e1084c966f51960b1ed3af3fd3f83fdc77))
* **list:** adds scrolltop/scrollbottom event listener ([dbfce7f](https://github.com/dvcol/neo-svelte/commit/dbfce7f881c0e2684d5f5bf0c2108ceab33ec0b6))
* **list:** adds tags support to list item ([78772c1](https://github.com/dvcol/neo-svelte/commit/78772c183b5da05f75cf645e68a45b9da0d38184))
* **list:** adds virtual list component ([0484ddc](https://github.com/dvcol/neo-svelte/commit/0484ddc563a71914ed5e05a0aaf108db8ab0a63b))
* **list:** introduce simpler flat list before virtual list ([6a5c63d](https://github.com/dvcol/neo-svelte/commit/6a5c63d3f47762c129937a71dd68d61c24bdaa10))
* **list:** move style to virtual list ([44fde70](https://github.com/dvcol/neo-svelte/commit/44fde70a0ef053a19312b2f74a9fb0a8870584f2))
* **list:** support reversing flow in list & menu ([1df5367](https://github.com/dvcol/neo-svelte/commit/1df5367a58983981c6203132a86d924d0e4d89e5))
* **media:** adds basic image support ([d2cb84a](https://github.com/dvcol/neo-svelte/commit/d2cb84a2bb797c013e44592d56b4df8180bd760b))
* **media:** adds media wrapper & image support ([b3c8d4d](https://github.com/dvcol/neo-svelte/commit/b3c8d4d572887bcdd5dd5afefe693d528ae3ac59))
* **media:** move skeleton loading to NeoImage ([fd15ba4](https://github.com/dvcol/neo-svelte/commit/fd15ba45ac55e351c7a2eb9c89997be4d19df8d4))
* **notification:** adds basic notification stack plumbing ([542cede](https://github.com/dvcol/neo-svelte/commit/542cede52d044c008158fd1103806158546377c6))
* **notification:** adds drag to dismiss ([3616a44](https://github.com/dvcol/neo-svelte/commit/3616a445f587748e18eb932d9aff39f481b57691))
* **notification:** adds notification content ([82a99f1](https://github.com/dvcol/neo-svelte/commit/82a99f1a2e7a1f274fcb15f383b25d9d2ba4bedc))
* **notification:** basic styling & swipe to dismiss ([a4c6259](https://github.com/dvcol/neo-svelte/commit/a4c6259a51b58cfe68fc15729e1a7628bd35094b))
* **notification:** split notification item & stack ([ec97213](https://github.com/dvcol/neo-svelte/commit/ec97213995d4d726f16bf1145c8cddbdc8e94a5a))
* **pill:** adds icon to pills ([4dd9dd8](https://github.com/dvcol/neo-svelte/commit/4dd9dd89da587df442fbaf0a42151abc8dad9f5d))
* **progress:** adds delay support ([236b1e8](https://github.com/dvcol/neo-svelte/commit/236b1e8bf6fc3de14447049038ec4c8fcb014cc2))
* **progress:** adds queuing service to progress ([a5fadd9](https://github.com/dvcol/neo-svelte/commit/a5fadd92fc72ca352496d6ee668e5f885314adc5))
* **progress:** adds service hook & context ([5ed620a](https://github.com/dvcol/neo-svelte/commit/5ed620ab2fba7c3b0d2b7fb4507784d090bb9c6a))
* **progress:** enter & exit from indeterminate gracefully ([871b526](https://github.com/dvcol/neo-svelte/commit/871b526780f5313c90d0e247b98b24ffc6ccda06))
* **rounded:** support custom rounded value ([efe1282](https://github.com/dvcol/neo-svelte/commit/efe1282f74186e58361dcd413de02f0b26ec7e21))
* **row:** adds tabs & button row ([45f69e1](https://github.com/dvcol/neo-svelte/commit/45f69e1dfca5d4f5df4bc880a84bf407c4c4c9ab))
* **tabs:** forward focus & pointer events in tabs ([98e0791](https://github.com/dvcol/neo-svelte/commit/98e07915359040db5c1d014aa50f1aa52fa85e6e))
* **text:** adds html support to NeoMark ([44ad0ba](https://github.com/dvcol/neo-svelte/commit/44ad0ba9d9ba2057c31b5eba9d96439a6ae08564))
* **theme:** adds spin transition option ([1aa9fd3](https://github.com/dvcol/neo-svelte/commit/1aa9fd3020955bdffdd71eb84cc88667bf60ce2d))
* **transition:** adds transition selector ([796f6b3](https://github.com/dvcol/neo-svelte/commit/796f6b3277760790a0f872c731f29f641a05dc46))


### Bug Fixes

* **border:** adjust border radius for menu & tooltips ([182cb77](https://github.com/dvcol/neo-svelte/commit/182cb777cdf9e79bebb91043047085459f6e16f1))
* **buttons:** adjust group specificity ([b3805e6](https://github.com/dvcol/neo-svelte/commit/b3805e6017777124a8741f350002e386e610b41e))
* **components:** export bound methods to component instance ([ee02250](https://github.com/dvcol/neo-svelte/commit/ee0225098fb998def7c3e0def7c5868b62b226aa))
* **css:** rename variables ([8a96aa3](https://github.com/dvcol/neo-svelte/commit/8a96aa30bf8dd3a3f7f6cbe7bec4f919e3b281a6))
* **dialog:** css sizing issue in safari ([a24d40d](https://github.com/dvcol/neo-svelte/commit/a24d40dbca48d6edf26966d854b1a5d571f7982a))
* **dialog:** fix drawer ([12dce43](https://github.com/dvcol/neo-svelte/commit/12dce43862a26ffec0daa3a8de1273ba0a0bf545))
* **floating:** export notifications ([1376474](https://github.com/dvcol/neo-svelte/commit/1376474884e3ffd473624b8b9d6b730a339716fb))
* **icon:** make empty stroke color dynamic ([e20f69a](https://github.com/dvcol/neo-svelte/commit/e20f69a3028d2a6a42fab006a7a43aa4172d7221))
* **input:** adds native select overflow auto ([f1d154a](https://github.com/dvcol/neo-svelte/commit/f1d154a46bb659dfe9de5d393921228eb502d1d2))
* **input:** fix multiple select value reflect ([55b3af4](https://github.com/dvcol/neo-svelte/commit/55b3af42931c58df2aba57a23a68635818a4c1eb))
* **input:** make select pointer cursor ([3d91970](https://github.com/dvcol/neo-svelte/commit/3d9197019df03e8b3393a2b54446c9971757be90))
* **inputs:** reflect value change in selects & fix buttons ([b56518f](https://github.com/dvcol/neo-svelte/commit/b56518f1c2e5cad9f97d314dfdf31bd3d2edfd78))
* **lazy:** relax component props ([5591986](https://github.com/dvcol/neo-svelte/commit/5591986417c3f6c7d87674fed59fe241e6aaaf4e))
* **list:** adds loading to virtual list ([c47cd1b](https://github.com/dvcol/neo-svelte/commit/c47cd1bce77282f6913991f41a0a4f0f6d2b966b))
* **list:** adjust spacing in list elements ([b0334a6](https://github.com/dvcol/neo-svelte/commit/b0334a694441ef31e72b25583e6ff197428aec41))
* **list:** broaden tab select targets ([a744101](https://github.com/dvcol/neo-svelte/commit/a744101c73ce30c852bcd52760a3128c6a97110e))
* **list:** correct typings ([2a1a48d](https://github.com/dvcol/neo-svelte/commit/2a1a48d7aa6a24b206e6f5b217e5099edadc1fed))
* **list:** correctly render dividers ([2f10550](https://github.com/dvcol/neo-svelte/commit/2f10550f1a6b230c8bd03de8ee2b554375c34781))
* **list:** expose virtual props ([bef22ff](https://github.com/dvcol/neo-svelte/commit/bef22ffe05bd9ed1bfaa791f444f815617e9a848))
* **list:** fix divider support in flip mode ([dfa5241](https://github.com/dvcol/neo-svelte/commit/dfa524194af6f118971fe63aeff6fc373c2400d7))
* **list:** fix flip behaviour and arrow/tab nav ([bdc5b31](https://github.com/dvcol/neo-svelte/commit/bdc5b315a8daf30fb822f4ac216fd5e35a3e6416))
* **list:** fix scroll detection, add tolerance & widen search styles ([490af21](https://github.com/dvcol/neo-svelte/commit/490af217aeeab39b2683e75a12f71fd938fed1bd))
* **list:** fix skeleton & section label ([3c60652](https://github.com/dvcol/neo-svelte/commit/3c6065208827769dd7bbe4cf02ae7163abb1708b))
* **list:** improve virtual list performance ([064ce40](https://github.com/dvcol/neo-svelte/commit/064ce40ca139daf8d987638dad9a82f14fbe34bd))
* **list:** remove flip logic from virtual ([c5ee022](https://github.com/dvcol/neo-svelte/commit/c5ee022912115bec2b2e2715bae11176eca57ef0))
* **list:** remove skeleton from list ([266d59f](https://github.com/dvcol/neo-svelte/commit/266d59f1b07a53400b52affb911531bd87ceedd5))
* **list:** reverse flow of tags ([82a2ae9](https://github.com/dvcol/neo-svelte/commit/82a2ae987cdd57d2c6dea25abae876e5d8fec728))
* **media:** adjust border-radius ([76a994f](https://github.com/dvcol/neo-svelte/commit/76a994f9c8457472dfee402e7b2b54c8b3ddce25))
* **media:** fix alt text visibility ([a18fe15](https://github.com/dvcol/neo-svelte/commit/a18fe15b66b8373f4051c3d6b53d1a60c7083d2d))
* **media:** fix sizing of alt text while loading ([d1c3d03](https://github.com/dvcol/neo-svelte/commit/d1c3d038c2c78652b5d8cec92c59ce5e7f883393))
* **menu:** fallback to value if section has no label ([b94498d](https://github.com/dvcol/neo-svelte/commit/b94498d4d216a38e674d6862d3877cb8ac5c3445))
* **menu:** increase rounded menu spacing ([f8a1952](https://github.com/dvcol/neo-svelte/commit/f8a1952b70508daecd586324fe2501381330cdcd))
* **notification:** adds collapsed view ([80ae3f4](https://github.com/dvcol/neo-svelte/commit/80ae3f4032a34efada5286dc1f1c4e17536ec9e3))
* **notification:** adjust rounded style & fix drag/swipe ([e7649c9](https://github.com/dvcol/neo-svelte/commit/e7649c9c2234a56d67234b4c01d9f30f52236d5f))
* **notification:** debounce swipe in stacks ([c3c88ef](https://github.com/dvcol/neo-svelte/commit/c3c88ef3eb9ae1afff9bd432beac53d88bea8dc9))
* **notification:** fix height on safari ([9e18807](https://github.com/dvcol/neo-svelte/commit/9e1880741e04449445ffcbe3f3128d511a46f634))
* **notification:** increase stagger & fix touch drag ([e914e54](https://github.com/dvcol/neo-svelte/commit/e914e54e1276c259ef694120bb95a0a812fc3573))
* **notification:** switch to grid ([842e6b5](https://github.com/dvcol/neo-svelte/commit/842e6b53c3bc7e9c0df03ae45040d0a374f7e9c2))
* **notification:** update delay ([c057316](https://github.com/dvcol/neo-svelte/commit/c0573167d610efbb29d6fa6d58f5e63dd2efaaad))
* **portal:** svelte doesn't support mounting snippets anymore ([6b52970](https://github.com/dvcol/neo-svelte/commit/6b5297077b466c087a640eae8678089e8220f695))
* **progress:** rework controlleds methods ([101a405](https://github.com/dvcol/neo-svelte/commit/101a4057fed6c54f6d7b815bec98f59223deb6e8))
* **row:** rework tab registration ([fce041e](https://github.com/dvcol/neo-svelte/commit/fce041e23244216b29b54c0e4f31cedb258ddc3d))
* **row:** show active tab in menu ([daf9142](https://github.com/dvcol/neo-svelte/commit/daf9142a7d2f670956d29ccea7dcc3409667357f))
* **style:** adjust glass border colours & bump svelte ([7602f07](https://github.com/dvcol/neo-svelte/commit/7602f0796661d1768941bea3a1886d26bbfb7921))
* **tooltip:** fix floating state access & reflect final position ([e12762c](https://github.com/dvcol/neo-svelte/commit/e12762c774558f783a1898e1ed12c369f69d9ee1))
* **touch:** disable touch action on draggable elements ([ac01b68](https://github.com/dvcol/neo-svelte/commit/ac01b68005c55db11fa2146ccbfc785aaf591075))

### [1.1.2](https://github.com/dvcol/neo-svelte/compare/v1.1.1...v1.1.2) (2025-04-21)


### Bug Fixes

* **nav:** fix snippet when exported ([bda737c](https://github.com/dvcol/neo-svelte/commit/bda737c4fc9fd206e28253fee559fd02a9528642))

### [1.1.1](https://github.com/dvcol/neo-svelte/compare/v1.1.0...v1.1.1) (2025-04-21)


### Bug Fixes

* **lint:** bump deps & fix errors ([b349483](https://github.com/dvcol/neo-svelte/commit/b3494830f2c91586c3b9983e6d016b0fa853c226))
* **loading:** fix flex behavior ([6bbb288](https://github.com/dvcol/neo-svelte/commit/6bbb288c1e7dcfbd1575960801fdb67dd07c1d11))

## [1.1.0](https://github.com/dvcol/neo-svelte/compare/v1.0.1...v1.1.0) (2025-04-21)


### Features

* **loading:** adds Lazy & Suspense ([5c9d5fe](https://github.com/dvcol/neo-svelte/commit/5c9d5fef799049c4f494950d8c1127098e76edeb))


### Bug Fixes

* **portal:** adds missing export ([da77cd7](https://github.com/dvcol/neo-svelte/commit/da77cd7a082bface934a9135bea4088493af49d1))

### [1.0.1](https://github.com/dvcol/neo-svelte/compare/v0.1.12...v1.0.1) (2025-04-21)


### Bug Fixes

* **chore:** bump dependencies ([e2d49aa](https://github.com/dvcol/neo-svelte/commit/e2d49aa2259bc7300facdb6a7516091d898e34a0))
* **lint:** fix stylelint error due to bump ([5f1a83c](https://github.com/dvcol/neo-svelte/commit/5f1a83c56a063006ea9ad47005be94781171cc92))
* **typescript:** rework tsconfig project setup ([c963570](https://github.com/dvcol/neo-svelte/commit/c9635707ea391afab42b2ba27a8167938639c20b))

### [0.1.12](https://github.com/dvcol/neo-svelte/compare/v0.1.11...v0.1.12) (2025-04-11)


### Features

* **cursor:** adds neo-cursor component ([0a1d805](https://github.com/dvcol/neo-svelte/commit/0a1d80522711407ae1a0af2dfa9fadb6da9cf974))
* **cursor:** adds pressure sensitivity ([d4b4de4](https://github.com/dvcol/neo-svelte/commit/d4b4de4f57ca6845cd529da1472eb075e6f76519))
* **cursor:** refactor pointer & support overrides ([9038b64](https://github.com/dvcol/neo-svelte/commit/9038b64a1bc3927891a3095d2406fc14e822b1cd))
* **cursor:** supports tilt direction ([e8736ac](https://github.com/dvcol/neo-svelte/commit/e8736ac0acf0e8c63d3251143c31630b70c17714))
* **dialog:** add movable dialog option ([026cde0](https://github.com/dvcol/neo-svelte/commit/026cde004631b28c7bf17abfd70f6f67722b8a8f))
* **dialog:** adds base dialog element ([b8b354f](https://github.com/dvcol/neo-svelte/commit/b8b354f64970f429f9c5d9968f1d4b2fac8d1dfd))
* **dialog:** adds dragging limits ([a36ac02](https://github.com/dvcol/neo-svelte/commit/a36ac02524c50366e0c978fe92e18624902b21fd))
* **dialog:** adds edge snapping ([3e67f77](https://github.com/dvcol/neo-svelte/commit/3e67f773f51de898256d6b54a227417e03cdea85))
* **dialog:** adds placement ([28d78e6](https://github.com/dvcol/neo-svelte/commit/28d78e62582f3fd7ffaaf5a2ae3cce587ac15b7a))
* **dialog:** adds snap outside offset ([3906416](https://github.com/dvcol/neo-svelte/commit/390641650faa323c9a4ed4ec813203f5c9ca3924))
* **dialog:** adds stepper dialog ([3d05132](https://github.com/dvcol/neo-svelte/commit/3d05132a40066408348c153f4f45c7cf147b37fc))
* **dialog:** allow corner only snapping ([3e79cf7](https://github.com/dvcol/neo-svelte/commit/3e79cf7066700774d65d00633deb4336d10e5e5d))
* **dialog:** bind reset to ref ([2be3554](https://github.com/dvcol/neo-svelte/commit/2be3554f614898a6025aaab5b5364b2cad882c4b))
* **dialog:** close on threshold ([a3d8274](https://github.com/dvcol/neo-svelte/commit/a3d8274d4d978c6d8d0729ce7bf52ed79d0de0bc))
* **dialog:** create NeoDialogConfirm ([ffa739f](https://github.com/dvcol/neo-svelte/commit/ffa739fad7ee0fdfc8699833caaa30d45b9038f2))
* **dialog:** custom translate easing & speed ([aaf7e75](https://github.com/dvcol/neo-svelte/commit/aaf7e75d5e4f6dfad1f38c80c2adeab8e635939c))
* **dialog:** fully draggable modal ([5d5f9d0](https://github.com/dvcol/neo-svelte/commit/5d5f9d06444b532d113bc45cfab374667628bd53))
* **dialog:** rework focus trap & fix css ([5b758bd](https://github.com/dvcol/neo-svelte/commit/5b758bda6e3f74d1d8aec87e94f972b586d015f2))
* **dialog:** rework to use patched function because of safari ([a2c5667](https://github.com/dvcol/neo-svelte/commit/a2c5667a899ab25ed5ff1aa390728c271c3175ab))
* **dialog:** snap to all placements ([e177ea8](https://github.com/dvcol/neo-svelte/commit/e177ea8d0cfaa7fff252929712e100752e36808f))
* **dialog:** snap to viewport edge ([e23e54e](https://github.com/dvcol/neo-svelte/commit/e23e54eaff75e5acdc087d2e40cd244b914aca00))
* **dialog:** support edge collapse ([b916f3e](https://github.com/dvcol/neo-svelte/commit/b916f3ea92afdda467a707152a31dc87f5a62c68))
* **dialog:** support full-size prop ([660a5ce](https://github.com/dvcol/neo-svelte/commit/660a5cee7d63f8a63ccdf7533a454e198581e810))
* **dialog:** support svelte transition & custom element ([689fd52](https://github.com/dvcol/neo-svelte/commit/689fd52984d3df2cc2adc4ee9cce24b2a71855dd))
* **dialog:** supports outside handles ([d6366e7](https://github.com/dvcol/neo-svelte/commit/d6366e7ab203b7572c9dac027c3ac3d6fab6f0f4))
* **drawer:** adds Confirm & Stepper variant ([02d3bc6](https://github.com/dvcol/neo-svelte/commit/02d3bc6035021de1a942e69588dc4b178b9de6bf))
* **list:** adds arrow item to list base item ([0db14f6](https://github.com/dvcol/neo-svelte/commit/0db14f6af7d2b0af4f3f22f0e10a52e9fe9a72b7))
* **menu:** adds basic dropdown menu ([2a8f7cc](https://github.com/dvcol/neo-svelte/commit/2a8f7cc4442807c94af45d0690aa24a797991e8b))
* **menu:** adds basic section management ([3bdf6cc](https://github.com/dvcol/neo-svelte/commit/3bdf6cc876bf9bca99a39b67d85d0ab97039c942))
* **menu:** adds custom scrollbar ([441e156](https://github.com/dvcol/neo-svelte/commit/441e15697d8d0395bb9c6d2f558513bb57cb7e02))
* **menu:** adds divider support ([8428d0f](https://github.com/dvcol/neo-svelte/commit/8428d0fa292ee99e2677afcc6b7512c456286fcd))
* **menu:** adds support for colors ([f9b317c](https://github.com/dvcol/neo-svelte/commit/f9b317c11e136c80d3123e148d14274b8785b28e))
* **portal:** adds portal component & add portal to dialog & tooltips ([5353918](https://github.com/dvcol/neo-svelte/commit/5353918278cbe0a4e4cd5a03e3bd58e481696990))
* **portal:** adds portal container & scale option ([623c089](https://github.com/dvcol/neo-svelte/commit/623c089598edd4e89320934cd51b7ab7f783ced2))
* **select:** adds onChange event listener ([5279670](https://github.com/dvcol/neo-svelte/commit/5279670cc8dd99d42abb4cc62bca9dd4e495fb19))
* **text:** adds ref to typewriter ([9236997](https://github.com/dvcol/neo-svelte/commit/923699764b98bd994667f2f3e1b07d904bc106d6))
* **text:** adds type writer component ([59042f3](https://github.com/dvcol/neo-svelte/commit/59042f3a7c6b369a8970f755d5509c36cb7d3a29))
* **tooltip:** adds click trigger ([d3bf4ad](https://github.com/dvcol/neo-svelte/commit/d3bf4ad34781f446a0ff27061a8b4fb0bde004cf))
* **tooltip:** adds neo-pop-stepper ([5914689](https://github.com/dvcol/neo-svelte/commit/59146898760a5794f868da1e00bf7eae4fc492a5))
* **tooltip:** support disabling unmounted content ([e7d18c7](https://github.com/dvcol/neo-svelte/commit/e7d18c727a7680d982a83d6a298dd795d38b6fac))


### Bug Fixes

* **button:** change ghost to container ([a4df4ad](https://github.com/dvcol/neo-svelte/commit/a4df4ad1e5ced8e625483f5768b155f5f743c77e))
* **button:** increase specificity ([280b35c](https://github.com/dvcol/neo-svelte/commit/280b35c52ee66ebf70d5f7ecf4cc2bdd9afc894f))
* **button:** small css fixes ([7f8db1e](https://github.com/dvcol/neo-svelte/commit/7f8db1e2fb6c1a16e5b5ebda3e2b5e2ff20eefb5))
* **button:** unsafe mutation & close css ([43177e6](https://github.com/dvcol/neo-svelte/commit/43177e670ba324d948c44f5afb018ca78704a3a3))
* **card:** rework close button & fix media spacing ([c593082](https://github.com/dvcol/neo-svelte/commit/c593082bc45416022a431db36b162c7daca883f5))
* **collapse:** adds unmountOnClose option ([3996ae6](https://github.com/dvcol/neo-svelte/commit/3996ae697a7fb4349db7df24a902bf662fd2c1ee))
* **collapse:** support keeping content partially visible when collapsed ([f5b18af](https://github.com/dvcol/neo-svelte/commit/f5b18af1abb17435376985c71a880a4ef7e47c56))
* **color:** adjust shadow intensity ([889a434](https://github.com/dvcol/neo-svelte/commit/889a43435f9da90132f1370c9e136fc7553cfa8c))
* **css:** adjust range scale, collapse transition & stepper radius ([d77cb8d](https://github.com/dvcol/neo-svelte/commit/d77cb8d3bb5c2bd5b798717e0ca61306333c6d92))
* **css:** make shadow intensity customizable ([eeff729](https://github.com/dvcol/neo-svelte/commit/eeff7295cd03d4ba50b2fb5dc973bf514303a183))
* **css:** rename variable to prevent collision ([f450610](https://github.com/dvcol/neo-svelte/commit/f450610d9643dc47ea3dd33181264109bc39fc06))
* **cursor:** fix enter transition & expose inner states ([06f920b](https://github.com/dvcol/neo-svelte/commit/06f920baa489b8a0c79a3a835c1bd97141cab707))
* **dialog:** fix desync in native dialog & fix css ([8da4b2d](https://github.com/dvcol/neo-svelte/commit/8da4b2d2fbb1ffb0f9b9f0a5f47ad4650c12f253))
* **dialog:** fix stepper button bg ([ced32ed](https://github.com/dvcol/neo-svelte/commit/ced32ed9e6991457292e0a8205274cccee7d5e8d))
* **dialog:** prevent default when dragging ([eaf2b05](https://github.com/dvcol/neo-svelte/commit/eaf2b05c13404b486813144da934fe8ec7216d67))
* **dialog:** scroll lock for ios ([be058c3](https://github.com/dvcol/neo-svelte/commit/be058c30a665cd643cac3dc2f62eaa6f02b9f0c4))
* **dim:** adjust opacity transition ([084a8a6](https://github.com/dvcol/neo-svelte/commit/084a8a6ed52fb202519ddbeba98b30e6081d7a52))
* **elevation:** expand shallow elevation ([75e0d47](https://github.com/dvcol/neo-svelte/commit/75e0d472728999068df181b21495d7a459dcd503))
* **floating:** refactor style between tooltip & dialog ([d771192](https://github.com/dvcol/neo-svelte/commit/d7711920ee7e23cd25f36b40fd5139836979491a))
* **hover:** adjust hover/opacity trigger in list & tabs ([d91b19b](https://github.com/dvcol/neo-svelte/commit/d91b19b258acd9614ab3b7e4538cbf5699561ab2))
* **input:** fix css transition on select ([11d9efc](https://github.com/dvcol/neo-svelte/commit/11d9efc9bd91af4d33d9b5f3467c18b048dcf459))
* **list:** adjust scaling of buttons when pressed ([164d6d7](https://github.com/dvcol/neo-svelte/commit/164d6d7510b732bbbe1fed27f5fb0ef65ba7eb82))
* **list:** adjust styling ([f09cc1a](https://github.com/dvcol/neo-svelte/commit/f09cc1acb0b7c098030ae807697991d08a21f5ad))
* **list:** fix rounded & scroll padding ([394ca9a](https://github.com/dvcol/neo-svelte/commit/394ca9a6a1915655ce16cc61fa1b95774cc2c307))
* **list:** make skeleton opt-in to reduce DOM clutter ([242f849](https://github.com/dvcol/neo-svelte/commit/242f84981db06e7857147083b23d34c437e01d10))
* **menu:** change defaults ([e5cc2b2](https://github.com/dvcol/neo-svelte/commit/e5cc2b29246f9ea5b09af657dbd19c14ca9b738e))
* **menu:** fix divider & click off logic ([384e7f6](https://github.com/dvcol/neo-svelte/commit/384e7f6ae317d099d3ca18777982e638b176a109))
* **range:** increase step speed when holding ([6b8ca75](https://github.com/dvcol/neo-svelte/commit/6b8ca75586af313ab15791e93a05d52188a3315f))
* **routing:** fix catchall redirect ([01b5b59](https://github.com/dvcol/neo-svelte/commit/01b5b59b12fa4643a79a96b08892df978b82760e))
* **select:** only re-calculate when value change ([b40e449](https://github.com/dvcol/neo-svelte/commit/b40e4496064eca678d4fcf6d8fb2a0592721cab3))
* **select:** reflect change in value to selected ([cbc0d66](https://github.com/dvcol/neo-svelte/commit/cbc0d66da5f71b67385d87e83ff7e12fe2fc7fb7))
* **stepper:** adds rounded prop ([af2507e](https://github.com/dvcol/neo-svelte/commit/af2507e7e149d93ad986446dac06c2d4583e51fc))
* **styles:** adjust glass shadow & backdrops ([15038ba](https://github.com/dvcol/neo-svelte/commit/15038ba7eb2fa5b45cf1bbccbaad4da7be385cb1))
* **tooltip:** adds closable & fix css ([7185ca9](https://github.com/dvcol/neo-svelte/commit/7185ca9c3f69efefca3e9ce5b45369e03df654f0))
* **tooltip:** adjust css ([738b301](https://github.com/dvcol/neo-svelte/commit/738b301fa35609e39b0630b3bf4cccbe3d7b2f11))
* **tooltip:** expand sizing strategy ([8bc49d4](https://github.com/dvcol/neo-svelte/commit/8bc49d4f5bca88950e56134565c68fea96a15ed6))
* **tooltip:** fix pop confirm css ([af111b3](https://github.com/dvcol/neo-svelte/commit/af111b348e6895cd39d58b5c76254de7d6570ac4))
* **tooltip:** fix select reflect & tooltip css fade ([70044ac](https://github.com/dvcol/neo-svelte/commit/70044ac04a2d112213a6bc0d5de53ee932074494))
* **tooltip:** fix typescript error ([ea77854](https://github.com/dvcol/neo-svelte/commit/ea778544f5a3f72291279a61728333290474d923))
* **tooltip:** properly attach aria roles ([d5ec755](https://github.com/dvcol/neo-svelte/commit/d5ec755a8d72ca5910c29287e1da57e7300f3b7d))

### [0.1.11](https://github.com/dvcol/neo-svelte/compare/v0.1.10...v0.1.11) (2025-03-06)


### Features

* **accordion:** adds accordion styling for collapse ([ef3ae15](https://github.com/dvcol/neo-svelte/commit/ef3ae155ee55c1b3b801fc5e5fe68d47db5ec223))
* **collapse:** adds base neo-collapse ([7038e5d](https://github.com/dvcol/neo-svelte/commit/7038e5d07f89bcebc33bd692db26124908942eee))
* **collapse:** adds collapse-groups ([2cb2844](https://github.com/dvcol/neo-svelte/commit/2cb28440a3a55272e34bdad8047bd8a411be978b))
* **collapse:** adds min/max strategy ([0d91033](https://github.com/dvcol/neo-svelte/commit/0d91033ac5f9304b7a79cd0fce62b834fb09928d))
* **collapse:** style base collapse ([b3a1b99](https://github.com/dvcol/neo-svelte/commit/b3a1b99f3af34fc2d7f47d7a11625ff5683d158c))
* **form:** adds neo-form & neo-fieldset ([527eeb9](https://github.com/dvcol/neo-svelte/commit/527eeb91039686a698ae2c87489176d6a1be6f2d))
* **form:** support form name and registration opt-out ([ec854bb](https://github.com/dvcol/neo-svelte/commit/ec854bb379e8fb7f734e6b35289b9ecc64a2d099))
* **stepper:** adds arrow button & exports ([dce7eef](https://github.com/dvcol/neo-svelte/commit/dce7eefe151f69424a52caf4e7e7654c03d4be12))
* **stepper:** adds simple stepper component ([389b16d](https://github.com/dvcol/neo-svelte/commit/389b16d400a6ada7c5f18f9f10f2591f7aa0c238))
* **stepper:** adds support for async step transiitons ([7c7dfc9](https://github.com/dvcol/neo-svelte/commit/7c7dfc9f57c66ab4aa7c45be783e2a362b1dace8))
* **stepper:** adds touch support ([a9f98ee](https://github.com/dvcol/neo-svelte/commit/a9f98eee7f09e81ffafe829da89e94ec9ad3b1e8))
* **tooltip:** adds popconfirm ([8f69873](https://github.com/dvcol/neo-svelte/commit/8f69873532d9d76c1fc66ca69b09166a9c652e44))


### Bug Fixes

* **accordion:** adds sizing props ([fe2ccec](https://github.com/dvcol/neo-svelte/commit/fe2ccec2eaafdb1ac1c76eb3d0f478016af1542b))
* **accordion:** adjust collapse border to prevent content shift ([b260a7c](https://github.com/dvcol/neo-svelte/commit/b260a7c53f681897af275ffa47e3aa4436620ef9))
* **arrow:** disable line on mobile ([3cf3970](https://github.com/dvcol/neo-svelte/commit/3cf3970d586aaba5f2bcdd87426a5af3056645b9))
* **button:** adds button context to snippets ([d6b88ee](https://github.com/dvcol/neo-svelte/commit/d6b88eed0e340f37edba435ea1d4a8ab5b6c41e9))
* **button:** rework readonly mode (to be disabled without styling) ([e53561f](https://github.com/dvcol/neo-svelte/commit/e53561f3579d62ed7b4471e4ebef2fa8b40cc858))
* **buttons:** adds checked state when loading ([da4a571](https://github.com/dvcol/neo-svelte/commit/da4a57177e8e50885653539220996184cee4ff57))
* **buttons:** adds sizing to button groups ([9f1ceb1](https://github.com/dvcol/neo-svelte/commit/9f1ceb194d05cfaf135a180931cbdb8c35c56059))
* **buttons:** set type to button to prevent form submit ([025f412](https://github.com/dvcol/neo-svelte/commit/025f4127d3e8e0e1d5f49bfec8d613bad7363070))
* **form:** adds validate method ([582d0be](https://github.com/dvcol/neo-svelte/commit/582d0beb594fe02370538fba5d0f8bb646ea82a0))
* **input:** adjust styling & support nullable select ([b4884c0](https://github.com/dvcol/neo-svelte/commit/b4884c0fab593f48504ebe48f7d9568988aed3e1))
* **input:** fix auto-complete in chrome ([95e5c3d](https://github.com/dvcol/neo-svelte/commit/95e5c3d770e14009093fb49093a7ec6734c00d2c))
* **input:** fix textarea default binding & fix stepper vertical css ([1e406e5](https://github.com/dvcol/neo-svelte/commit/1e406e57c74bd5db82d650468bdf2cf907165a76))
* **input:** remove infinite resize hooks ([a5af533](https://github.com/dvcol/neo-svelte/commit/a5af53348be20db9b4aedb379df294390f71026e))
* **inputs:** corrects autofill styling for webkit ([9db7aeb](https://github.com/dvcol/neo-svelte/commit/9db7aeb03af791de194245dabb55f56ec5657ff3))
* **progress:** adds track disable & fix css ([3ab6cee](https://github.com/dvcol/neo-svelte/commit/3ab6cee677836091d21bf6656668dd0d11c43494))
* **progress:** adjust bar sizing ([8da6764](https://github.com/dvcol/neo-svelte/commit/8da67648457b476532591f83b6de2151a18ee308))
* **progress:** dynamically size margin to fit inner marks ([32af1fe](https://github.com/dvcol/neo-svelte/commit/32af1feb27f2c3fb5665c8d57b3ce6770dc21762))
* **reactivity:** remove ref binding to reduce unnecessary effects ([aa2a454](https://github.com/dvcol/neo-svelte/commit/aa2a454fe15c5d7772cf2fd2e586c527aac52e3d))
* **select:** auto-select if value set but not selected ([c431b50](https://github.com/dvcol/neo-svelte/commit/c431b50c18ecc625c61109fc2212f94098bd6c72))
* **select:** transform items before processing ([89b77e7](https://github.com/dvcol/neo-svelte/commit/89b77e77a625029da3f5a0b4bf3684a3974e69b0))
* **sizing:** adds sizing binding for various inputs ([afe52f1](https://github.com/dvcol/neo-svelte/commit/afe52f114e274cc3dfeedcac66ea838e5f0e2b8e))
* **sizing:** adjust sizing options & add flex prop ([ecb37de](https://github.com/dvcol/neo-svelte/commit/ecb37deb3f1af2cd5ba5167e2a39821248c1cbad))
* **sizing:** move progress to custom sizing props ([e0cfa36](https://github.com/dvcol/neo-svelte/commit/e0cfa367c0388042fb4fe8e1c690c33d1c0c3920))
* **stepper:** adds debounce to loading state ([cc2a20a](https://github.com/dvcol/neo-svelte/commit/cc2a20a9273c5e96d8f25e5a9d70a66bf7496fe1))
* **stepper:** adjust margin to align with first and last refs ([4522547](https://github.com/dvcol/neo-svelte/commit/452254779d93b496883ea64c8ff72c792f5e61a8))
* **textarea:** adjust padding when overflow is set ([e5241b3](https://github.com/dvcol/neo-svelte/commit/e5241b3d07ae1ea0816eb45a2605bac0b6e942fa))
* **tooltip:** adjust auto-sizing ([bee11b2](https://github.com/dvcol/neo-svelte/commit/bee11b2f0adcab9c2409849d2d15636423f48319))
* **transition:** adds keys to transition container ([f2a82ed](https://github.com/dvcol/neo-svelte/commit/f2a82eda98269461a8e17f314c0ee6696f76cfc1))
* **validation:** simplify input validation ([4fa7811](https://github.com/dvcol/neo-svelte/commit/4fa7811a8470a05dd517d0705e91b643096a74c4))
* **various:** fix textarea default size, account draw animation, ... ([19dc238](https://github.com/dvcol/neo-svelte/commit/19dc238effb950dfd25d29d6a589e92181520ec4))

### [0.1.10](https://github.com/dvcol/neo-svelte/compare/v0.1.9...v0.1.10) (2025-02-19)

### [0.1.9](https://github.com/dvcol/neo-svelte/compare/v0.1.8...v0.1.9) (2025-02-19)


### Bug Fixes

* **provider:** change scss to use relative path for packaging ([b5f1acf](https://github.com/dvcol/neo-svelte/commit/b5f1acf7130e5dc0605569139d04574cc3690902))

### [0.1.8](https://github.com/dvcol/neo-svelte/compare/v0.1.7...v0.1.8) (2025-02-19)


### Features

* **badge:** adds badge component ([0a8c71b](https://github.com/dvcol/neo-svelte/commit/0a8c71b13bdac40e102f35ce9a6b9fb3578dbd11))
* **blur:** adds blur as props ([cceacc4](https://github.com/dvcol/neo-svelte/commit/cceacc4ffbe250fff0fa10b6b887130d794cce39))
* **button:** adds button group colour & add tint support ([0a551ed](https://github.com/dvcol/neo-svelte/commit/0a551ede0ac9234fc0822d3ff5f8a894a9c6309b))
* **button:** adds custom hover/active to groups ([c2e227a](https://github.com/dvcol/neo-svelte/commit/c2e227ad2be66277e5c716e062eb82fa292513b3))
* **button:** rework of button elevation ([edb2cba](https://github.com/dvcol/neo-svelte/commit/edb2cba204dd09b02f2795ce620f16c6b7a64cbe))
* **buttons:** adds hover support to group itself ([d2ccdc3](https://github.com/dvcol/neo-svelte/commit/d2ccdc33cea572be351d2a634109ba78910287ee))
* **card:** adds tint & colour support ([4dba81b](https://github.com/dvcol/neo-svelte/commit/4dba81b1700d93945c6f561acabac2b58c1cf413))
* **input:** adds colour and tint support to inputs ([7973653](https://github.com/dvcol/neo-svelte/commit/7973653c9e20c11e0a5d94ae6cd1136bb7b98600))
* **input:** adds first draft of custom select ([5839709](https://github.com/dvcol/neo-svelte/commit/58397096f07592213a9870ac9a950e92df19b558))
* **input:** adds hidden support directly to basic input ([c7ba00c](https://github.com/dvcol/neo-svelte/commit/c7ba00cefe81f3379a00fb4b555c7efc0ae7760d))
* **list:** adds custom empty snippet support for sections ([d60fe7b](https://github.com/dvcol/neo-svelte/commit/d60fe7bc91ccde60c7d8a06d73ad4b7b0e9f543e))
* **list:** fix aria issues ([278bd04](https://github.com/dvcol/neo-svelte/commit/278bd049a27e05e4ca1ee5162adaea272076bd83))
* **list:** show empty snippet when list is filtered ([a3ec707](https://github.com/dvcol/neo-svelte/commit/a3ec7076c0e1717cbd2b85eaf4dc20446b36600c))
* **pill:** adds pills component ([8a3abb3](https://github.com/dvcol/neo-svelte/commit/8a3abb3ff937cec1875c27bc31e74869b9483e3a))
* **progress:** adds initial progress component ([2cb8925](https://github.com/dvcol/neo-svelte/commit/2cb89255f65453f7deb0968af5aa5795ab6a6c73))
* **progress:** adds progress bar component ([8d3003f](https://github.com/dvcol/neo-svelte/commit/8d3003f399b82e37fe1ce482aefbad40741436aa))
* **progress:** adds progress buttons ([bcfbada](https://github.com/dvcol/neo-svelte/commit/bcfbadad83b27947053b00ab733c059c9ac2470e))
* **range:** adds tick markers ([516cf1f](https://github.com/dvcol/neo-svelte/commit/516cf1f651fda943fb194157978e3cd81db2bf0e))
* **select:** adds custom display support ([eaddfe6](https://github.com/dvcol/neo-svelte/commit/eaddfe6774899861b3b74a17673f851ab497a58d))
* **select:** support arrowUp/Down selection ([a12c2c4](https://github.com/dvcol/neo-svelte/commit/a12c2c43b5a933f844dc5c8104a0950a110be808))
* **select:** support custom display snippet ([4b8f79d](https://github.com/dvcol/neo-svelte/commit/4b8f79dbdd5efe3b5f74aa646469d489e04fa034))
* **size:** adds customisable min/max size ([1b35dce](https://github.com/dvcol/neo-svelte/commit/1b35dce056fe0d671794255d5d0efae86657f7cd))
* **tabs:** adds hover effect ([646384e](https://github.com/dvcol/neo-svelte/commit/646384e95fec6c8eb3d71f56091305be08005a96))
* **text:** adds demo for texts and improve scroll-shadow ([f52500d](https://github.com/dvcol/neo-svelte/commit/f52500df22cf285b7e331285d111ca8287569961))
* **theme:** disable transitions during theme switch ([58e0d77](https://github.com/dvcol/neo-svelte/commit/58e0d77e702acfc24f6dd4b87fe29026dbea8cdf))
* **tooltip:** adds colour & tint support ([6659707](https://github.com/dvcol/neo-svelte/commit/665970727c231120c2fb3153b2bd9fd47971cb7f))
* **tooltip:** adds complex pop select example ([706ecfc](https://github.com/dvcol/neo-svelte/commit/706ecfc2ad7d6c5325ea183eadf3853b6ad7ba5f))
* **tooltip:** adds filled background option ([2966853](https://github.com/dvcol/neo-svelte/commit/29668533c57ed21bce119f912250b78bb332bbfd))
* **tooltip:** adds pop select ([86d7a8d](https://github.com/dvcol/neo-svelte/commit/86d7a8df7e4bf0abc2ae736dfea4f136656a6b04))
* **tooltip:** fix positionning in auto ([9619859](https://github.com/dvcol/neo-svelte/commit/9619859d0809e3820a05bd0eb8c2b197fc32ca89))
* **tooltip:** rework tooltip and input sizing api ([7090740](https://github.com/dvcol/neo-svelte/commit/7090740cc161017f577776d7c64a310c95b35f6e))


### Bug Fixes

* **affix:** rework affix transiitons timing ([1c26919](https://github.com/dvcol/neo-svelte/commit/1c26919104b22a9d15bec84370413816c22220a5))
* **browser:** add custom scrollbar to firefox ([2b42707](https://github.com/dvcol/neo-svelte/commit/2b42707628827833a641afd0b352f1d45844f91e))
* **card:** correct scrollbar padding in safari ([b5c4b66](https://github.com/dvcol/neo-svelte/commit/b5c4b66c76798f2187f5299c338c0cefc0fdfb7b))
* **css:** adds hover effect to borders ([9b0dfbe](https://github.com/dvcol/neo-svelte/commit/9b0dfbebf48f8908ef7b5f7fbdcd563fec4fc7d6))
* **css:** adds safari & firefox fallbacks ([30ed289](https://github.com/dvcol/neo-svelte/commit/30ed289f09adcfc1a8bbf6243f2147447ff9cf60))
* **css:** change background-clip to exclude padding ([bd7c623](https://github.com/dvcol/neo-svelte/commit/bd7c623952c96f8fe56490a1b40606501713dd98))
* **css:** remove scale override & add unchecked colour to mark ([eb010b2](https://github.com/dvcol/neo-svelte/commit/eb010b2c7117071f9b167e0d4b6e6f433bd4aa79))
* **css:** remove starting-style border ([fae7140](https://github.com/dvcol/neo-svelte/commit/fae71402dc89592b646e604062580403d227c46f))
* **demo:** update sizing for dividers ([f534e2a](https://github.com/dvcol/neo-svelte/commit/f534e2a222ec94fefd99b3562d5844beb52ba7c2))
* **dim:** change hover-dim to be on focus-visible ([1c54cc8](https://github.com/dvcol/neo-svelte/commit/1c54cc8c4f07e97687d081e7a2bd0d375cc7dcff))
* **glass:** adds offset box-shadow in glass mode ([0e1a7c9](https://github.com/dvcol/neo-svelte/commit/0e1a7c916d958458e13c5f1c50ce295b19ee1f8b))
* **input:** adds border colour on validation ([35f6a13](https://github.com/dvcol/neo-svelte/commit/35f6a13592073c030de84f6f99bac1ae89222d81))
* **input:** adds hover colour tint to various inputs ([f0b8a37](https://github.com/dvcol/neo-svelte/commit/f0b8a371053a676ac9acac66f6cc8db2c2fb3a4f))
* **input:** fix accessibility issues ([11fee58](https://github.com/dvcol/neo-svelte/commit/11fee5864dd89eda7d2c19ae4f315daaad4412ef))
* **inputs:** force buttons to text when in glass mode ([942f6a3](https://github.com/dvcol/neo-svelte/commit/942f6a31c2500d78e144b47d6061717f5dc716eb))
* **input:** switch to inert for select display input ([d0512fe](https://github.com/dvcol/neo-svelte/commit/d0512fe158881a2f6f1a29541b35303565dadc5a))
* **input:** update validation styling & support readonly validation ([bc8c72e](https://github.com/dvcol/neo-svelte/commit/bc8c72eb5c3caa0e666fb5b2b00e12dd486e640f))
* **label:** inverse condition to support less strict inputs ([baac658](https://github.com/dvcol/neo-svelte/commit/baac658cf5d19b2cfd4ddc19d2033d52e4d3d707))
* **list:** search mirrors loading/skeleton state from list ([321b706](https://github.com/dvcol/neo-svelte/commit/321b7063003ee7dac09ee4cb423b4bf7fc355a36))
* **list:** support toggle button style ([9a7b815](https://github.com/dvcol/neo-svelte/commit/9a7b81526efcf500ba4dd91a35795fa86fef8443))
* **select:** adds clearable support ([0833a4f](https://github.com/dvcol/neo-svelte/commit/0833a4f0421d212c5835741b8bbd6b06139e0879))
* **skeleton:** change skeleton default to explicit false ([6d97feb](https://github.com/dvcol/neo-svelte/commit/6d97feb28ade813e48c791b8f7f765768f6b6644))
* **skeleton:** simplify skeleton container ([9b2f189](https://github.com/dvcol/neo-svelte/commit/9b2f18903ebca94bd776921f6849d8402cb73658))
* **style:** better scoping of :global selectors ([8fb9aea](https://github.com/dvcol/neo-svelte/commit/8fb9aea7f316e08dbeb24d3c04e2286270e81d62))
* **tags:** make tags reactive ([8637080](https://github.com/dvcol/neo-svelte/commit/863708038d96a0aff2137d5dde88e2d65068c574))
* **tooltip:** adjust clip path ([38ca8f0](https://github.com/dvcol/neo-svelte/commit/38ca8f0c54ad7a74088a2c1da5d3425fc230664b))
* **tooltip:** adjust padding & sizing on tooltips with lists ([7e0a27f](https://github.com/dvcol/neo-svelte/commit/7e0a27f24799e3b86f86b2d6c88f93d7ecfe2993))
* **tooltip:** remove tint when filled & un-tinted ([8ced754](https://github.com/dvcol/neo-svelte/commit/8ced754a6632dbc693d930588f3e680d11272d4c))

### [0.1.7](https://github.com/dvcol/neo-svelte/compare/v0.1.6...v0.1.7) (2025-02-03)


### Features

* **affix:** adds custom loading/close/validation snippets ([fcefc30](https://github.com/dvcol/neo-svelte/commit/fcefc309853a6566edacc244e59a3b288b534dd9))
* **button:** adds support for theme colors ([e01c567](https://github.com/dvcol/neo-svelte/commit/e01c5679bf3b7d48fe822e2a43634b0fd6ac18f4))
* **buttons:** adds indeterminate to switch and shallow to buttons ([a196c57](https://github.com/dvcol/neo-svelte/commit/a196c57c2b4c3eabcd2eb9dbce2b71492ebec848))
* **buttons:** adds label snippet ([b39de08](https://github.com/dvcol/neo-svelte/commit/b39de087d34c78c8ea93236801e9c79fe99ad44e))
* **buttons:** split checkbox, switch, radio buttons out ([536b353](https://github.com/dvcol/neo-svelte/commit/536b3539868fbf78bf720a807744bb6c6a2d0e2a))
* **button:** support label in switch buttons ([9d69d2a](https://github.com/dvcol/neo-svelte/commit/9d69d2ac3832308482c5ba0f91ba66282739cad8))
* **divider:** expand divider api ([fb2e932](https://github.com/dvcol/neo-svelte/commit/fb2e9327b8c5cbb41f322f53eaae9aaf61766782))
* **elevation:** adds support for string elevations ([45d1cd0](https://github.com/dvcol/neo-svelte/commit/45d1cd00d59e3ef8e3df415099ff91022938eaa4))
* **input:** adds native select component ([0b7dfc1](https://github.com/dvcol/neo-svelte/commit/0b7dfc105e6b65a13665423c37a42bde61f51580))
* **inputs:** adds customisable icons ([054f4d7](https://github.com/dvcol/neo-svelte/commit/054f4d73d273e7abc8d34f21789776293d02da18))
* **input:** style multi select native inputs ([308a6de](https://github.com/dvcol/neo-svelte/commit/308a6de8ae6f7a2892926a8defe6dc6cca7b1ba7))
* **list:** adds aria roles ([165693d](https://github.com/dvcol/neo-svelte/commit/165693d7c55aa1ee58f260f72c92dbbecac0aa3d))
* **list:** adds arrow navigation ([f339b75](https://github.com/dvcol/neo-svelte/commit/f339b75a2fbe3749e51a4c7d893e3486915335c0))
* **list:** adds basic support for filtering/sorting ([bcf1c8f](https://github.com/dvcol/neo-svelte/commit/bcf1c8f46dda64ac29775886cd9960fe45296e1c))
* **list:** adds custom base loader ([01bc010](https://github.com/dvcol/neo-svelte/commit/01bc010de72117d3cad4af9cf2f23e1cc20df3d9))
* **list:** adds description support ([f7a2025](https://github.com/dvcol/neo-svelte/commit/f7a20254c586b6806547c7c014cd10ef27d7aa90))
* **list:** adds onclick & href support ([da844ea](https://github.com/dvcol/neo-svelte/commit/da844eadc3da4fd15370601dba6c7b03e95a4948))
* **list:** adds search input ([8d1593a](https://github.com/dvcol/neo-svelte/commit/8d1593a8548f7bf4c10251869f4b92874efc718c))
* **list:** adds section support ([ce8f7ce](https://github.com/dvcol/neo-svelte/commit/ce8f7ce2d7ea0ed038432fd171921e856aaf40e0))
* **list:** adds sticky section header ([9276852](https://github.com/dvcol/neo-svelte/commit/9276852220729eee5413aa17c4845cf48fcf7fc2))
* **list:** adds support for disabled items ([6180f4c](https://github.com/dvcol/neo-svelte/commit/6180f4cfa17034622e9294fe0d4f12913d30866e))
* **list:** clear selected if list mutates ([086d1bf](https://github.com/dvcol/neo-svelte/commit/086d1bf66210c8a527e4c7e595d1c93b75267bdd))
* **list:** first draft for lists ([502885c](https://github.com/dvcol/neo-svelte/commit/502885ce92ba5525566f57440be75e76d32aaafc))
* **list:** initial support for selectable lists ([1451253](https://github.com/dvcol/neo-svelte/commit/145125319e90e5896347b287873809d1676e32a3))
* **list:** support after & before loading skeleton ([331a21d](https://github.com/dvcol/neo-svelte/commit/331a21d656d5f0902774b42878b2287edf1546f9))
* **list:** support checkmarks ([45564ba](https://github.com/dvcol/neo-svelte/commit/45564ba73a681a1c82ec41e5967ef5aeba4cd52b))
* **nav:** adds tab divider support ([5d07d80](https://github.com/dvcol/neo-svelte/commit/5d07d800a1d38248b7c2b3da6ef7eea1de22c031))
* **scroll:** makes custom scrollbar optional ([2b54880](https://github.com/dvcol/neo-svelte/commit/2b54880ba24b38f1eff1dedafb8b97487bbf35fb))
* **select:** basic option array input ([6b412fd](https://github.com/dvcol/neo-svelte/commit/6b412fd240ef848ba895a9024ec446c390e004de))
* **skeleton:** adds auto-line discovery for skeleton ([1c54529](https://github.com/dvcol/neo-svelte/commit/1c54529f9c5c7078ef07b0c1637bb777eb2fe1a7))
* **skeleton:** adds glass skeleton to generic component ([e0fe4f4](https://github.com/dvcol/neo-svelte/commit/e0fe4f4a1bac3c8a506e0e57ed76354ca07dacc6))
* **skeleton:** auto-size skeleton containers ([10938e2](https://github.com/dvcol/neo-svelte/commit/10938e2a6f09f27e5186957d6dd64ca79919d000))
* **tabs:** adds pill mode ([84d3615](https://github.com/dvcol/neo-svelte/commit/84d36158dac3a80d33b36bd3f8e7233a0abef0b3))
* **tabs:** adjust hover colors & transitions ([a6a8fed](https://github.com/dvcol/neo-svelte/commit/a6a8fed31343b1c93dab4b8163d4a878ca8b92dc))
* **text:** adds ellipsis and mark components ([0719445](https://github.com/dvcol/neo-svelte/commit/0719445b9f6ae0229c887bfb7000cad165995c91))
* **text:** adds scroll-shadow ([9c6fd29](https://github.com/dvcol/neo-svelte/commit/9c6fd29a75796427a264dd9f97ec3e9444796bf0))
* **theme:** adds colour pickers ([9757934](https://github.com/dvcol/neo-svelte/commit/97579340e0b143b182267b36c35905234bf4644e))
* **tooltip:** adds custom tooltip snippets ([33d2d59](https://github.com/dvcol/neo-svelte/commit/33d2d59bd90052462d4b16618900e6ed82e860ba))
* **tooltip:** adds generic tooltip component ([813fc2f](https://github.com/dvcol/neo-svelte/commit/813fc2ff5b43d8157954bf79186ee9e3913bb9a5))
* **tooltip:** adds supports for external refs ([09f1be1](https://github.com/dvcol/neo-svelte/commit/09f1be1d748e34e45d157b0d40d2b5f039253c2e))
* **tooltip:** match width with trigger ([853ed32](https://github.com/dvcol/neo-svelte/commit/853ed324ac5a647e3ad94d1bd4cff5c641604b84))
* **tooltips:** adds tooltip styling ([4e5418b](https://github.com/dvcol/neo-svelte/commit/4e5418b60aa8d840a543dabdca3ef8b2958a4e14))


### Bug Fixes

* **button:** adjust icon spacing ([cb6f163](https://github.com/dvcol/neo-svelte/commit/cb6f163fb939ba382361dc0ff8ff28ef141f8d8a))
* **button:** remove enter pressed state on blur ([9c53dd1](https://github.com/dvcol/neo-svelte/commit/9c53dd16aa68da20495fae09c5ffe051f865d4ad))
* **buttons:** correct border color for flat glass style ([65b9e12](https://github.com/dvcol/neo-svelte/commit/65b9e121bd740119182f852ff7ece796a4742c28))
* **card:** fix media card css ([8dd8088](https://github.com/dvcol/neo-svelte/commit/8dd8088fcaae8ec0764b6cae6a3edbd5695d3b61))
* **card:** makes scrollbar transition additive ([59e2a8f](https://github.com/dvcol/neo-svelte/commit/59e2a8ff4c976cd63a30f4e2f7940ddb39bbde9d))
* **checkbox:** adds missing touched binding ([8736cb6](https://github.com/dvcol/neo-svelte/commit/8736cb68507e6d465a4267e9c0667a0009dd974f))
* **colors:** adjust variables to be relative to theme color ([754e4d2](https://github.com/dvcol/neo-svelte/commit/754e4d2effe5d74e67eff20a85413c39c84fd7be))
* **glass:** adjust border color when flat ([01995fe](https://github.com/dvcol/neo-svelte/commit/01995fe9757b9d2504c60f7416338f8b5be1178a))
* **glass:** adjust pressed glass shadow ([2182943](https://github.com/dvcol/neo-svelte/commit/21829437e5fbc5e832aeda9f963fd7a529099902))
* **glass:** remove border when inset ([631efbe](https://github.com/dvcol/neo-svelte/commit/631efbe00268c3546e7d3b097695c3f0eeb528a3))
* **icon:** make checkbox prop reactive ([7f72fb6](https://github.com/dvcol/neo-svelte/commit/7f72fb6c324a640f124362f2a4b54dab23ca484f))
* **input:** adjust color picker min height/width ([8536e03](https://github.com/dvcol/neo-svelte/commit/8536e03709a4a03132fe7f5e0c30317baf8ee82b))
* **input:** adjust label translate ([3e35382](https://github.com/dvcol/neo-svelte/commit/3e3538250314464afca4e9ed0582df33ab7e15fd))
* **input:** debounce clearable to fix touch flashing on mobile ([72b86d8](https://github.com/dvcol/neo-svelte/commit/72b86d81269d4ef800dd3f0dacf813279b041afe))
* **input:** keep close button visible on focusin ([761ac31](https://github.com/dvcol/neo-svelte/commit/761ac31461cae17bff17caa41cf77f723e226f3f))
* **input:** resize floating values on element resize ([f77acc2](https://github.com/dvcol/neo-svelte/commit/f77acc2c903c8ee02c19b3663ebec6e4f35fe824))
* **list:** handle reflow dividers ([8b7ca36](https://github.com/dvcol/neo-svelte/commit/8b7ca36dceacb46006719263b5e31325a23c55f9))
* **list:** keep selection when sorting/filtering ([48c43ec](https://github.com/dvcol/neo-svelte/commit/48c43ec2194a9eb4f39e38b1b737552d98001abb))
* **list:** move to simple scale and scrollToBottom ([80165fa](https://github.com/dvcol/neo-svelte/commit/80165fa73d988e48ad8748ed45187d86fb53ef74))
* **list:** only animate top level list ([9106151](https://github.com/dvcol/neo-svelte/commit/9106151154dec7fec0ec7b386c0f60816b1447de))
* **list:** remove scroll shadow when empty ([2654975](https://github.com/dvcol/neo-svelte/commit/2654975c22e68ea9590d2f60a11dcda3b8c47f23))
* **list:** rework transitions ([3bf6de9](https://github.com/dvcol/neo-svelte/commit/3bf6de959206f844a6964e57c3af1839624f73cf))
* **skeleton:** adjust font & line height to match defaults ([06eb497](https://github.com/dvcol/neo-svelte/commit/06eb4973b2d72fef3e12effd6cbdbcb927e28332))
* **skeleton:** adjust line spacing in alt mode ([7ec1ec9](https://github.com/dvcol/neo-svelte/commit/7ec1ec91906f6aabffe61d49c5b4ce795819a1ff))
* **style:** improve :global scoping in tabs & list ([363e106](https://github.com/dvcol/neo-svelte/commit/363e106b1ade7ba0baa7c788146a757fc270f972))
* **tabs:** fix line regression & add dynamic default slide elevation ([8894bdf](https://github.com/dvcol/neo-svelte/commit/8894bdffd7006e44186852c60da733304964e20b))
* **tooltip:** keep open while focused ([ac5df59](https://github.com/dvcol/neo-svelte/commit/ac5df592a96fc793b7637b1a6117a66c0f5cc797))

### [0.1.6](https://github.com/dvcol/neo-svelte/compare/v0.1.5...v0.1.6) (2025-01-10)


### Features

* **style:** adds typography for headings ([d02ff78](https://github.com/dvcol/neo-svelte/commit/d02ff78e251fbb7dd7343bde29858d80336f6925))


### Bug Fixes

* **input:** adjust text-area sizing & fix typing ([c54d607](https://github.com/dvcol/neo-svelte/commit/c54d607dc707a819c7d29b814993719b2520fbce))

### [0.1.5](https://github.com/dvcol/neo-svelte/compare/v0.1.4...v0.1.5) (2025-01-10)


### Features

* **input:** adds basic select support ([f0a7973](https://github.com/dvcol/neo-svelte/commit/f0a797395a67017a437e9f32229d0ccc578b47a4))
* **input:** adds range prefix & suffix ([1c6ab9c](https://github.com/dvcol/neo-svelte/commit/1c6ab9c731a9964dc921e6f11f77a0c45a7bfaf7))
* **input:** adds range slider drag support ([f9c6275](https://github.com/dvcol/neo-svelte/commit/f9c6275ff0bf3cb717de94cbe75190237ca143be))
* **input:** adds styling to labels ([7823b84](https://github.com/dvcol/neo-svelte/commit/7823b845e58762e51dae6eba36cc42f73b3349f2))
* **input:** range switch to variable value ([41e491d](https://github.com/dvcol/neo-svelte/commit/41e491dd10ef6992c3e1b679edf4846c037f9e4c))


### Bug Fixes

* **input:** adjust range spacing ([d68bd8f](https://github.com/dvcol/neo-svelte/commit/d68bd8f2d7ebfd3c27b1d8f87aa15748eebd98be))

### [0.1.4](https://github.com/dvcol/neo-svelte/compare/v0.1.3...v0.1.4) (2024-12-31)


### Features

* **affix:** refactor affix in standalone ([a5574a1](https://github.com/dvcol/neo-svelte/commit/a5574a1b7d0e8340f4ed5dee8cb0397c70165c88))
* **input:** adds affix to pin ([4f8d9ba](https://github.com/dvcol/neo-svelte/commit/4f8d9babfdd27c9205474f8860e876d027724e59))
* **input:** adds checkbox input ([c530603](https://github.com/dvcol/neo-svelte/commit/c530603c1ddd833c16b909ee30a0328e69870a04))
* **input:** adds date-time input ([c170a51](https://github.com/dvcol/neo-svelte/commit/c170a513fd577e75e121843493ac0b12774aee02))
* **input:** adds drop append for file picker ([fc4b65d](https://github.com/dvcol/neo-svelte/commit/fc4b65d5f3e9132b33930880ba4d68e9ff26331a))
* **input:** adds expanded files input view ([6576cc8](https://github.com/dvcol/neo-svelte/commit/6576cc868a58324cd7b121a9740517a65280fe05))
* **input:** adds first draft of pin input ([12cda19](https://github.com/dvcol/neo-svelte/commit/12cda1924250d66b4c47f07b90c8bc69c2c6d96d))
* **input:** adds flat styles for range ([f5c9f1e](https://github.com/dvcol/neo-svelte/commit/f5c9f1ebdd168f00bc8b01f66cae521c2b06d649))
* **input:** adds pin labels ([d3651b9](https://github.com/dvcol/neo-svelte/commit/d3651b9b36e702a4728ec80afb58e0a7435470c2))
* **input:** adds pin password ([2096c45](https://github.com/dvcol/neo-svelte/commit/2096c45712fee3611aa85111591c70ee3fad819e))
* **input:** adds pin validity check ([cf1452d](https://github.com/dvcol/neo-svelte/commit/cf1452de9211b359d05db7384390b3727f299391))
* **input:** adds radio input ([1e05949](https://github.com/dvcol/neo-svelte/commit/1e05949a5f80f8ef971f04dbf19d972e17205053))
* **input:** adds styled number input ([999e90b](https://github.com/dvcol/neo-svelte/commit/999e90b0e76a2f5a6d2d066806469d6786764118))
* **input:** adds switch ([99bc099](https://github.com/dvcol/neo-svelte/commit/99bc09968871fba1503116ba69af7d98e57d6dd7))
* **input:** adds validation to expanded file picker ([e6d9a8c](https://github.com/dvcol/neo-svelte/commit/e6d9a8c7d3d79cafcb49433c0a8883346f22f298))
* **input:** drag & drop file base logic ([9ea5d68](https://github.com/dvcol/neo-svelte/commit/9ea5d6840783c51913e34cf7ff0c48ebb0f9c549))
* **input:** drag & drop support for default file view ([251cf35](https://github.com/dvcol/neo-svelte/commit/251cf3510471834bf8ed6f94df3ce5f22a50cac9))
* **input:** first draft range input ([c4509e0](https://github.com/dvcol/neo-svelte/commit/c4509e02b2cc8d806496d581552e951f378b4102))
* **input:** inset dropzone on drag hover ([ce9311d](https://github.com/dvcol/neo-svelte/commit/ce9311d5ea736cfcaa08d3631c561c8e79e457a8))
* **inputs:** merge neo-button override within inputs ([5d8b5e4](https://github.com/dvcol/neo-svelte/commit/5d8b5e4869a23da5ae9fafd54acc30fb8c071d5d))
* **input:** split expanded input into dedicated component ([d4cdfb2](https://github.com/dvcol/neo-svelte/commit/d4cdfb2041a1947687df56e07028b23d1ec649c2))
* **input:** supports double range ([e1a17e5](https://github.com/dvcol/neo-svelte/commit/e1a17e5d9e6e1a5036f9e4f5a3c3a87b3c96699e))
* **input:** wip file picker ([deba9d8](https://github.com/dvcol/neo-svelte/commit/deba9d827e3441e5b4e50f402fa71dbc99ab6acd))
* **shadows:** adds convex & pressed ([52a6748](https://github.com/dvcol/neo-svelte/commit/52a67487bcb4720298bba375c65d01fd64c029db))
* **shadows:** adds pressed to inputs & cards ([57e8ad0](https://github.com/dvcol/neo-svelte/commit/57e8ad0fc84ac67dda0121b9f078168e8decab6d))


### Bug Fixes

* **affix:** adjust styling and include disable ([a410944](https://github.com/dvcol/neo-svelte/commit/a41094427d3b8ca238535730cb887a4ca6401f2b))
* **affix:** move inputs to refactored affix ([7549b97](https://github.com/dvcol/neo-svelte/commit/7549b97dc0931c05822a9544b31fdda3173ee80c))
* **button:** rework button styling ([822518a](https://github.com/dvcol/neo-svelte/commit/822518ad9bccb0a9e933e2c54ae9b2b4ae9c29d4))
* **buttons:** fix flat border in glass mode ([13bda34](https://github.com/dvcol/neo-svelte/commit/13bda348e860566e33e362119e9fa26394df5172))
* **elevation:** change pressed default elevation ([aae3eab](https://github.com/dvcol/neo-svelte/commit/aae3eab314923da2a8a64d0a22e7ed8f4f920c62))
* **flex:** change inputs to inline-flex ([668acb8](https://github.com/dvcol/neo-svelte/commit/668acb8dff879ecf176fdad529b566f6f50e1e5e))
* **glass:** fix glass shadows and filters ([8f790cd](https://github.com/dvcol/neo-svelte/commit/8f790cd63a564ef8f48c3d0a75cffb26c19c2344))
* **group:** rework group to use elevation ([2301b64](https://github.com/dvcol/neo-svelte/commit/2301b64053acf65c459deb6271af0055f5f5295d))
* **groups:** remove shallow & inset ([4171224](https://github.com/dvcol/neo-svelte/commit/417122407c40cf4181a1523b3e740f02cac9cb34))
* **icon:** adds scaling option to icons ([8822a60](https://github.com/dvcol/neo-svelte/commit/8822a6016d6a7a99aa7444db7437656294f668e4))
* **input:** add missing context to file picker & type value ([fcc56d8](https://github.com/dvcol/neo-svelte/commit/fcc56d81d5909a7ca3bfee6b8f5cec07f785723c))
* **input:** adds colour picker ([a5f41e9](https://github.com/dvcol/neo-svelte/commit/a5f41e96fb7d626e949cbadd5442241a9fb7c0ea))
* **input:** adds disable state to file picker ([ebcc1c9](https://github.com/dvcol/neo-svelte/commit/ebcc1c94e914c2e36320fb78c928d274a8236da2))
* **input:** adds skeleton to affix & buttons ([fa8ab3f](https://github.com/dvcol/neo-svelte/commit/fa8ab3fb722c21c39d57ed931daea9b3e0545b68))
* **input:** adds transition to number ([34e5d82](https://github.com/dvcol/neo-svelte/commit/34e5d82b5a461009975b6c2f2ec52dcb6d02bfcb))
* **input:** adjust ios color picker & fix file validation ([aab6462](https://github.com/dvcol/neo-svelte/commit/aab64621910f6a43ed2d7014cbdf92a81fabc0ee))
* **input:** adjust styles to support extra long labels ([b433d07](https://github.com/dvcol/neo-svelte/commit/b433d07ab18e7c5f9cf842d6f554034f0697a03d))
* **input:** adjust styling for ios Safari ([c3e85b3](https://github.com/dvcol/neo-svelte/commit/c3e85b388b2b6cc2a4a439c0fd88427977f756d1))
* **input:** adjust various css styling in inputs ([21d2653](https://github.com/dvcol/neo-svelte/commit/21d2653147d7341650ec0a43a3e8a84ab44fffda))
* **input:** await tick before clearing state ([9bd0045](https://github.com/dvcol/neo-svelte/commit/9bd0045638b4300827a6f74f0e4a19807e774418))
* **input:** clean up styles ([b1ba008](https://github.com/dvcol/neo-svelte/commit/b1ba0082276761185753a1cddea327c0662ba393))
* **input:** de-correlate toggle width from spacing ([04dd1c8](https://github.com/dvcol/neo-svelte/commit/04dd1c853e5393d0e776ad71e619692de7ffdf59))
* **input:** emit input event on clear ([cf8731b](https://github.com/dvcol/neo-svelte/commit/cf8731bb181b92ad4aa5fc9050ea146a3a9854b3))
* **input:** expose container props as group props ([18415bc](https://github.com/dvcol/neo-svelte/commit/18415bce8f19b34e01001f857ad71f563bdbb3f6))
* **input:** fix flat styles for switch ([4f04bcf](https://github.com/dvcol/neo-svelte/commit/4f04bcf9de82b022644c22f4ff2aef3d4b25c488))
* **input:** fix styling with prefix & floating ([241a809](https://github.com/dvcol/neo-svelte/commit/241a80928942e2f61df95b83abf2bb3200b48724))
* **input:** incorrect floating condition ([6a1938a](https://github.com/dvcol/neo-svelte/commit/6a1938af3a365a45d661ffe9dad446106d923fd8))
* **input:** make checkbox elevation customizable ([a334e40](https://github.com/dvcol/neo-svelte/commit/a334e40ed704e662eb1c1a5242ee7effc52047f6))
* **input:** override neo-button in textarea after ([4d9c1c9](https://github.com/dvcol/neo-svelte/commit/4d9c1c9ca0c15352ac164ad97b6b8878f402c2e1))
* **input:** simplify fallback logic ([005ad27](https://github.com/dvcol/neo-svelte/commit/005ad273d1f6ef20ac1264eb17876538a4c63431))
* **inputs:** update styling on icons & sizing ([b3353d8](https://github.com/dvcol/neo-svelte/commit/b3353d8190a5fbb65b88eeb8ef03e963fd4cbd65))
* **input:** switch uses absolute positioning instead of width ([5be7a16](https://github.com/dvcol/neo-svelte/commit/5be7a16d4bba5dfffa6b4c15219517ac46644232))
* **input:** trigger picker on mobile & fix styling ([6838137](https://github.com/dvcol/neo-svelte/commit/6838137fd734514ca6753fa3c94af6d8571ed4bd))
* **input:** update state on blue by default ([3517bae](https://github.com/dvcol/neo-svelte/commit/3517baea9fab7635bf3be8e8cb7455dce95c6487))
* **input:** update validity on input number increment ([7a73cf2](https://github.com/dvcol/neo-svelte/commit/7a73cf2b9f3d9ee0d61c1c97d86a9cd95093a161))
* **mixin:** add transparent mask to border rotate & progress ([d7cb224](https://github.com/dvcol/neo-svelte/commit/d7cb2246c43bbb643c464e510973b2dcd18f836e))
* **nav:** move to elevation & adds pressed/convex ([9354c3b](https://github.com/dvcol/neo-svelte/commit/9354c3b91b258c7538da5b761c4ff41f6663772c))
* **styling:** adjust spacing to round pixels ([19caae1](https://github.com/dvcol/neo-svelte/commit/19caae1936116b909582ff7a4adae4a366f34951))
* **theme:** adjust glass color theme ([00c0817](https://github.com/dvcol/neo-svelte/commit/00c0817ce5930b368197f3976047fca8f728d21f))
* **theme:** rework glass colors & theme provider styles ([dcb0257](https://github.com/dvcol/neo-svelte/commit/dcb025713be14fd80d72348b28904b464da2c5ce))

### [0.1.3](https://github.com/dvcol/neo-svelte/compare/v0.1.2...v0.1.3) (2024-11-25)


### Bug Fixes

* **theme:** makes remember by default ([55d1738](https://github.com/dvcol/neo-svelte/commit/55d1738062e7879f9524890766082b56d935a891))
* **types:** correct props types & relative img path ([35bd74a](https://github.com/dvcol/neo-svelte/commit/35bd74a6046d07aeb9425a1191d7b3d178af3140))

### [0.1.2](https://github.com/dvcol/neo-svelte/compare/v0.1.1...v0.1.2) (2024-11-25)


### Bug Fixes

* **selector:** prevent $effect loop when provider props change ([2d9f6b1](https://github.com/dvcol/neo-svelte/commit/2d9f6b150ea69e6e66b111bf0b3ac4baea83c8d5))
* **style:** bundle theme scss with component & make reset optional ([1712a25](https://github.com/dvcol/neo-svelte/commit/1712a25ad42b3528783f09da1f8cd9fecc54f20f))

### 0.1.1 (2024-11-25)


### Features

* **button-groups:** adds button groups ([92c23bf](https://github.com/dvcol/neo-svelte/commit/92c23bf1cef47a06ca1f01d407e204a9d675ca21))
* **button:** adds glass button style ([287f7fe](https://github.com/dvcol/neo-svelte/commit/287f7fe4eaec6ef6907c1aa31def0b2b95d8e6f7))
* **button:** adds initial setup & button component ([f3c6237](https://github.com/dvcol/neo-svelte/commit/f3c62378bd29b950c77de1d4599c96432355d41a))
* **button:** adds skeleton state ([c1bae7c](https://github.com/dvcol/neo-svelte/commit/c1bae7c23a5474bd4746e109a9963681b3019fd1))
* **button:** adds support for anchor buttons ([6919204](https://github.com/dvcol/neo-svelte/commit/6919204bed54b9b93b8192f52e88e8bc0a653012))
* **buttons:** adds shallow styling for buttons & tabs ([3bbb5d7](https://github.com/dvcol/neo-svelte/commit/3bbb5d79f6e9dc75930feff5c37608e9b58ae5cd))
* **cards:** adds card segments ([c7eb3df](https://github.com/dvcol/neo-svelte/commit/c7eb3dfc7683b8c3c50544650361de690a3d0c0e))
* **cards:** first commit about cards ([50496e4](https://github.com/dvcol/neo-svelte/commit/50496e4c5673f1346b4b06e47817be4aea1b65ce))
* **card:** supports close button ([8d0bff1](https://github.com/dvcol/neo-svelte/commit/8d0bff16cf52e636429291fd45a1fed87c66e437))
* **card:** supports horizontal view ([71699c3](https://github.com/dvcol/neo-svelte/commit/71699c32bd9d9b2613b113737dad665c4a5f5321))
* **glass:** adds saturation ([aee2cd9](https://github.com/dvcol/neo-svelte/commit/aee2cd9462433be0296ba0dd754e6b6995a1725b))
* **groups:** adds recessed style to groups & tabs ([98ce6dc](https://github.com/dvcol/neo-svelte/commit/98ce6dc0aeb52b5a5a0bafceb7407a0e51c957b9))
* **input:** adds basic label support ([473b4c7](https://github.com/dvcol/neo-svelte/commit/473b4c79dc540caa74a69e419b6d869c8c283f28))
* **input:** adds first draft of text area ([902d43c](https://github.com/dvcol/neo-svelte/commit/902d43ced6e7bafd2abded70595813f74e43900c))
* **input:** adds text-area auto-resize ([c8892af](https://github.com/dvcol/neo-svelte/commit/c8892af1d861b103958739224433f0bb68014760))
* **input:** adds text-area scrollbar ([0752d22](https://github.com/dvcol/neo-svelte/commit/0752d22d1204af900efa8f3ef701b77f58c07ba9))
* **input:** initial commit for inputs ([df5f565](https://github.com/dvcol/neo-svelte/commit/df5f565271109187d53d21024bd19d888ba02544))
* **input:** input password ([82abf80](https://github.com/dvcol/neo-svelte/commit/82abf8079a3c0f0b0ecbb9fb7cd930defcb40bce))
* **input:** refactor validation ([9f5940a](https://github.com/dvcol/neo-svelte/commit/9f5940a6ddded79c04de2514e7067385374c400f))
* **input:** standard inputs ([fc5df4a](https://github.com/dvcol/neo-svelte/commit/fc5df4afb7347aa780db6f228c71e0b9065ba426))
* **input:** support validation ([b323288](https://github.com/dvcol/neo-svelte/commit/b3232889523429db24eca274198a1f3da323244b))
* **input:** switch to translate instead of absolute ([32e117e](https://github.com/dvcol/neo-svelte/commit/32e117e9003ffe5b2ec1cc5a1ca1e9dc87fb0b65))
* **package:** adds index & exports ([506fcea](https://github.com/dvcol/neo-svelte/commit/506fceaa9980f451af228cedb6baa1eb3a8ba3f2))
* **provider:** adds theme provider & selector ([93f68e6](https://github.com/dvcol/neo-svelte/commit/93f68e65741fc257b96dce0ba1c5ae2f4c81d4d0))
* **shadows:** adds light source origin ([6ea598c](https://github.com/dvcol/neo-svelte/commit/6ea598cae648411c6b1414d6188cbe630722f157))
* **skeleton:** adds skeleton & various fixes ([96994a8](https://github.com/dvcol/neo-svelte/commit/96994a800f9dfb3cdd12d17374a2f112efd83953))
* **style:** adds dark mode support ([b0a9422](https://github.com/dvcol/neo-svelte/commit/b0a942212a3db1a24e8c958de931912d93c8baf4))
* **styles:** adds border loading & progress ([07b65c2](https://github.com/dvcol/neo-svelte/commit/07b65c20755f25370f04760576e32511440ae16c))
* **TabBar:** adds slider animation ([1fd438a](https://github.com/dvcol/neo-svelte/commit/1fd438a3c86c5856e20d53f513624bf9e7c98e02))
* **tabs:** adds animated tab card wrapper ([105202c](https://github.com/dvcol/neo-svelte/commit/105202c796d76f7fe8446aef85f7ddd7c48d3bda))
* **tabs:** adds base tab bar component ([9864b86](https://github.com/dvcol/neo-svelte/commit/9864b86ce56df1ba4b225ce5714fd55cb73e8543))
* **tabs:** adds pane to tabs ([0e6d0fa](https://github.com/dvcol/neo-svelte/commit/0e6d0fab0e120e3ae0acd1eb2aca33955296606e))
* **theme:** adds light/dark theme toggle ([6a33674](https://github.com/dvcol/neo-svelte/commit/6a3367457bf42f9cfa6a70b4899895610f993ddc))


### Bug Fixes

* **a11y:** update aria dynamically ([a151753](https://github.com/dvcol/neo-svelte/commit/a151753d46a4828c307e110ceb3f2860b707d9fc))
* **button:** remove border rotate ([03a6c14](https://github.com/dvcol/neo-svelte/commit/03a6c14440ff1fda1a4f63832b21cd0e21995aee))
* **buttons:** fix line styling & rework action binding ([62b9544](https://github.com/dvcol/neo-svelte/commit/62b9544aab91581447c033f012e46547cb0b0e8c))
* **card:** show close on hover & fix focus-visible color ([23026ee](https://github.com/dvcol/neo-svelte/commit/23026eeb90c3ecd51e93d4a1e767d43766abba73))
* **css:** adjust css and switch to semantic tags ([b5d80d8](https://github.com/dvcol/neo-svelte/commit/b5d80d816dbb81dde1adc54cfe31759412c4d10e))
* **elevation:** remove half steps ([4f9801e](https://github.com/dvcol/neo-svelte/commit/4f9801e31d22f17eb4b9e9f6a566e2079be6ba6a))
* **input:** support floating positions labels ([f249aec](https://github.com/dvcol/neo-svelte/commit/f249aec28a8b134f6b777c00717f26e49fbaa590))
* **lint:** fix various ts errors ([63c19e9](https://github.com/dvcol/neo-svelte/commit/63c19e9449b501893d98f5419c3fd5f3ee34ad6e))
* **panes:** get animate state from context if not provided ([a2510a6](https://github.com/dvcol/neo-svelte/commit/a2510a659ecd7bc670c968fba255e51543fe0b46))
* **spacing:** adjust margin and elevation ([45f0858](https://github.com/dvcol/neo-svelte/commit/45f0858492de4028c3d2b3bc33f2d078b1269a8b))
* **spacing:** adjust shadow margin ([a1ea01f](https://github.com/dvcol/neo-svelte/commit/a1ea01fd677985c7eea7a94628df6bf28ad014d1))
* **tabs:** adds flex override and nowrap ([02cfac5](https://github.com/dvcol/neo-svelte/commit/02cfac5839ca7c79989173338e72b04d23ccd3b6))
