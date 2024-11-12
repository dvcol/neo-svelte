<script lang="ts">
  import { randomHex } from '@dvcol/common-utils/common/crypto';

  import { fade } from 'svelte/transition';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { TabId } from '~/nav/neo-tab.model.js';
  import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCard from '~/cards/NeoCard.svelte';
  import TransitionContainer from '~/container/TransitionContainer.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabPane from '~/nav/NeoTabPane.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';

  const added = $state([
    { text: `Added ${randomHex(1)}-0`, tabId: crypto.randomUUID() },
    { text: `Added ${randomHex(1)}-1`, tabId: crypto.randomUUID() },
  ]);
  const onclose = (id: TabId) => {
    const index = added.findIndex(tab => tab.tabId === id);
    if (index === -1) return;
    added.splice(index, 1);
  };
  const onadd = () => {
    added.push({ text: `Added ${randomHex(1)}-${added.length + 1}`, tabId: crypto.randomUUID() });
  };

  let active: unknown | undefined = $state();
  const onClear = () => {
    active = undefined;
  };

  const options = $state<NeoTabsProps>({
    disabled: false,
    close: true,
    add: true,
    slide: true,
    shallow: false,
    toggle: true,
    before: false,
    skeleton: false,
    vertical: false,
    nowrap: false,
  });

  const columns: { label: string; props?: NeoTabsProps }[] = [{ label: 'Default' }];
</script>

<div class="row">
  <div class="column">
    <NeoButtonGroup>
      <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
      <NeoButton toggle bind:checked={options.shallow}>Shallow</NeoButton>
      <NeoButton toggle bind:checked={options.before}>Before</NeoButton>
      <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
      <NeoButton toggle bind:checked={options.nowrap}>No Wrap</NeoButton>
      <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
      <NeoButton onclick={onClear}>Clear</NeoButton>
    </NeoButtonGroup>
  </div>
</div>

{#snippet icon()}
  <IconAccount />
{/snippet}

{#snippet tabs()}
  <NeoTab tabId="button" value="button" close={false}>Button</NeoTab>
  <NeoTab tabId="icon" value="icon" close={false} {icon}>Icon</NeoTab>
  <NeoTab tabId="reversed" value="reversed" reverse close={false} {icon}>Reversed</NeoTab>
  {#each added as { text, ...tab } (tab.tabId)}
    <NeoTab {...tab}>{text}</NeoTab>
  {/each}
{/snippet}

{#snippet content(word)}
  <div class="panel" in:fade={{ delay: 400 }} out:fade>
    <div>{Array.from({ length: 10 }, () => word).join(' ')}</div>
    <div>{Array.from({ length: 10 }, () => word).join(' ')}</div>
    <div>{Array.from({ length: 10 }, () => word).join(' ')}</div>
    <div>{Array.from({ length: 10 }, () => word).join(' ')}</div>
    <div>{Array.from({ length: 10 }, () => word).join(' ')}</div>
  </div>
{/snippet}

{#snippet panes()}
  <NeoCard>
    <TransitionContainer>
      <NeoTabPane empty>
        {@render content('Empty')}
      </NeoTabPane>
      <NeoTabPane tabId="button">
        {@render content('Button')}
      </NeoTabPane>
      <NeoTabPane tabId="icon">
        {@render content('Icon')}
      </NeoTabPane>
      <NeoTabPane tabId="reversed">
        {@render content('Reversed')}
      </NeoTabPane>

      {#each added as { text, tabId } (tabId)}
        <NeoTabPane {tabId}>
          {@render content(text)}
        </NeoTabPane>
      {/each}
    </TransitionContainer>
  </NeoCard>
{/snippet}

{#snippet group(props: NeoTabsProps = {})}
  <div class="column">
    <NeoTabs {panes} {active} {onclose} {onadd} {...options} {...props}>
      {@render tabs()}
    </NeoTabs>
  </div>
{/snippet}

<div class="row">
  {#each columns as { label, props }}
    <div class="column content">
      <span class="label">{label}</span>

      {#if props?.glass}
        <SphereBackdrop>{@render group(props)}</SphereBackdrop>
      {:else}
        {@render group(props)}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }

  .content {
    flex: 0 1 37.5rem;
    max-width: 37.5rem;
  }

  .panel {
    min-width: 37.5rem;
    min-height: 15rem;
  }
</style>
