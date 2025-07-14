<script lang="ts">
  import type { TransitionProps } from '@dvcol/svelte-utils/transition';

  import type { Routes } from './router/routes.js';

  import { sentenceCase } from '@dvcol/common-utils';
  import { RouterView } from '@dvcol/svelte-simple-router/components';
  import { resolveComponent } from '@dvcol/svelte-utils';
  import { fade } from 'svelte/transition';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoNotificationProvider from '~/floating/notification/NeoNotificationProvider.svelte';
  import NeoPortalContainer from '~/floating/portal/NeoPortalContainer.svelte';
  import NeoIconGithub from '~/icons/NeoIconGithub.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabDivider from '~/nav/NeoTabDivider.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoThemePicker from '~/providers/NeoThemePicker.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoThemeSelector from '~/providers/NeoThemeSelectors.svelte';

  import { router } from './router/router.js';
  import { routes } from './router/routes.js';

  const transition: TransitionProps = {
    in: fade,
    out: fade,
    params: { in: { delay: 300, duration: 200 }, out: { duration: 200 } },
    props: {
      container: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      wrapper: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
    first: false,
  };

  const active = $derived(router.route?.name);

  const onClick = (id?: Routes) => {
    if (id === undefined || id === active) return;
    router.push({ name: id });
  };

  const onHover = async (id?: Routes) => {
    if (id === undefined || id === active) return;
    const resolved = await router.resolve({ name: id });
    if (!resolved?.route) return;
    return resolveComponent(resolved.route.component);
  };
</script>

<NeoThemeProvider>
  <NeoNotificationProvider>
    <NeoPortalContainer>
      <div class="container">
        <header class="row header">
          <NeoTabs rounded pressed dim tag="nav" {active} onchange={onClick}>
            {#each routes as route (route)}
              <NeoTab tabId={route} onpointerenter={() => onHover(route)}>{sentenceCase(route)}</NeoTab>
            {/each}

            <NeoTabDivider aria-hidden="true" />

            <NeoButton role="tab" aria-label="Go to Github" title="Go to Github" href="https://github.com/dvcol/neo-svelte" target="_blank">
              {#snippet icon()}
                <NeoIconGithub stroke="2" scale="1.125" />
              {/snippet}
            </NeoButton>
          </NeoTabs>

          <NeoThemeSelector rounded source reset remember />
          <NeoThemePicker rounded />
        </header>

        <main class="column view">
          <RouterView {router} {transition} />
        </main>
      </div>
    </NeoPortalContainer>
  </NeoNotificationProvider>
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
    @include flex.column($gap: var(--neo-gap-l));

    min-height: 100dvh;
    padding: 1rem;
  }
</style>
