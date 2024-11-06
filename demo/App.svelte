<script lang="ts">
  import '~/styles/reset.scss';
  import '~/styles/theme.scss';

  import { wait } from '@dvcol/common-utils/common/promise';

  import { RouterView } from '@dvcol/svelte-simple-router/components';
  import { fade } from 'svelte/transition';

  import { router } from './router/router.js';

  import { Route } from './router/routes';

  import type { TransitionProps } from '@dvcol/svelte-simple-router/models';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconMoon from '~/icons/IconMoon.svelte';
  import IconSun from '~/icons/IconSun.svelte';

  const transition: TransitionProps = {
    in: fade,
    out: fade,
    params: { in: { delay: 200, duration: 200 }, out: { duration: 200 } },
    skipFirst: true,
  };

  const active = $derived(router.route?.name);
  let transitioning = $state(false);

  const onChange = async () => {
    transitioning = true;
    await wait(150);
  };

  const onLoaded = async () => {
    await wait(350);
    transitioning = false;
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

  const routes = [Route.Buttons, Route.ButtonGroups];
</script>

<div class="container">
  <div class="row">
    <NeoButtonGroup>
      {#each routes as route}
        <NeoButton checked={active === route} onclick={() => router.push({ name: route })}>
          {route}
        </NeoButton>
      {/each}
    </NeoButtonGroup>

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
  }

  .container {
    @include flex.column($gap: var(--gap-xl));

    padding: 1rem;

    :global(.transition *),
    :global(.transition *::before),
    :global(.transition *::after) {
      box-shadow: var(--box-shadow-flat) !important;
    }

    :global(.rotate) {
      @include mixin.border-rotate;
    }

    :global(.progress) {
      @include mixin.border-progress;
    }
  }
</style>
