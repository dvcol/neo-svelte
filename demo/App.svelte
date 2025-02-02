<script lang="ts">
  import { sentenceCase } from '@dvcol/common-utils';
  import { wait } from '@dvcol/common-utils/common/promise';

  import { RouterView } from '@dvcol/svelte-simple-router/components';
  import { fade } from 'svelte/transition';

  import { router } from './router/router.js';

  import { routes } from './router/routes.js';

  import type { Routes } from './router/routes.js';
  import type { TransitionProps } from '@dvcol/svelte-simple-router/models';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconGithub from '~/icons/IconGithub.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabDivider from '~/nav/NeoTabDivider.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoThemePicker from '~/providers/NeoThemePicker.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoThemeSelector from '~/providers/NeoThemeSelector.svelte';

  const transition: TransitionProps = {
    in: fade,
    out: fade,
    params: { in: { delay: 200, duration: 200 }, out: { duration: 200 } },
    props: {
      container: {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
    skipFirst: true,
  };

  const active = $derived(router.route?.name);
  let transitioning = $state(false);

  let first = true;
  const onChange = async () => {
    if (first) return;
    transitioning = true;
    await wait(100);
  };

  const onLoaded = async () => {
    if (active && first) {
      first = false;
      return;
    }
    await wait(300);
    transitioning = false;
  };

  const onClick = (id?: Routes) => {
    if (id === undefined || id === active) return;
    router.push({ name: id });
  };
</script>

<NeoThemeProvider>
  <div class="container">
    <header class="row header">
      <NeoTabs rounded pressed tag="nav" {active} onchange={onClick}>
        {#each routes as route}
          <NeoTab tabId={route}>{sentenceCase(route)}</NeoTab>
        {/each}

        <NeoTabDivider />

        <NeoButton aria-label="Go to Github" title="Go to Github" href="https://github.com/dvcol/neo-svelte" target="_blank">
          {#snippet icon()}
            <IconGithub stroke="2" scale="1.125" />
          {/snippet}
        </NeoButton>
      </NeoTabs>

      <NeoThemeSelector rounded reset remember />
      <NeoThemePicker rounded />
    </header>

    <main class="column view" class:transition={transitioning}>
      <RouterView {router} {transition} {onChange} {onLoaded} />
    </main>
  </div>
</NeoThemeProvider>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl));
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .header {
    flex: 0 1 auto;
    padding: 1rem;
  }

  .container {
    @include flex.column($gap: var(--neo-gap-xl));

    min-height: 100dvh;
    padding: 1rem;

    :global(.transition *),
    :global(.transition *::before),
    :global(.transition *::after) {
      box-shadow: var(--neo-box-shadow-flat) !important;
    }
  }
</style>
