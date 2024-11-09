<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import { wait } from '@dvcol/common-utils/common/promise';

  import { RouterView } from '@dvcol/svelte-simple-router/components';
  import { fade } from 'svelte/transition';

  import { router } from './router/router.js';

  import { routes } from './router/routes.js';

  import type { Routes } from './router/routes.js';
  import type { TransitionProps } from '@dvcol/svelte-simple-router/models';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconMoon from '~/icons/IconMoon.svelte';
  import IconSun from '~/icons/IconSun.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';

  const transition: TransitionProps = {
    in: fade,
    out: fade,
    params: { in: { delay: 100, duration: 100 }, out: { duration: 100 } },
    props: { container: { style: 'display: flex; justify-content: center; align-items: center;' } },
    skipFirst: true,
  };

  const active = $derived(router.route?.name);
  let transitioning = $state(false);

  let first = true;
  const onChange = async () => {
    if (first) return;
    transitioning = true;
    await wait(150);
  };

  const onLoaded = async () => {
    if (active && first) {
      first = false;
      return;
    }
    await wait(100);
    transitioning = false;
  };

  const onClick = (id?: Routes) => {
    if (id === undefined || id === active) return;
    router.push({ name: id });
  };

  const initial = localStorage.getItem('theme');
  let dark = $state(initial ? initial === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  let remember = $state(!!localStorage.getItem('theme'));

  $effect(() => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('theme', theme);
    if (remember) localStorage.setItem('theme', dark ? 'dark' : 'light');
    else localStorage.removeItem('theme');
  });
</script>

<div class="container">
  <div class="row">
    <NeoTabs {active} onchange={onClick}>
      {#each routes as route}
        <NeoTab tabId={route}>{route}</NeoTab>
      {/each}
    </NeoTabs>

    <NeoButtonGroup>
      <NeoButton toggle bind:checked={dark}>
        {#snippet icon()}
          {#if dark}
            <IconMoon />
          {:else}
            <IconSun />
          {/if}
        {/snippet}
        <span>{dark ? 'Dark' : 'Light'} Theme</span>
      </NeoButton>
      <NeoButton toggle bind:checked={remember}>Remember</NeoButton>
    </NeoButtonGroup>
  </div>

  <main class="row view" class:transition={transitioning}>
    <RouterView {router} {transition} {onChange} {onLoaded} />
  </main>
</div>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;
  @use 'src/lib/styles/common/flex' as flex;

  .row {
    @include flex.row($center: true, $gap: var(--gap-xl));
  }

  .view {
    min-height: 70vh;
    overflow: hidden;
  }

  .container {
    @include flex.column($gap: var(--gap-xl));

    padding: 1rem;

    :global(.transition *),
    :global(.transition *::before),
    :global(.transition *::after) {
      box-shadow: var(--box-shadow-flat) !important;
    }
  }
</style>
