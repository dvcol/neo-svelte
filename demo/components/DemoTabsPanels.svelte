<script lang="ts">
  import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
  import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import { randomHex } from '@dvcol/common-utils/common/crypto';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabPanel from '~/nav/NeoTabPanel.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoTabsCard from '~/nav/NeoTabsCard.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  const added = $state<NeoTabProps>([
    { text: 'Button', tabId: 'button', close: false },
    { text: 'Icon', tabId: 'icon', close: false, icon },
    { text: 'Reversed', tabId: 'reversed', close: false, icon, reverse: true },
    { text: 'Removable', tabId: getUUID() },
  ]);
  const onclose = (id: TabId) => {
    const index = added.findIndex(tab => tab.tabId === id);
    if (index === -1) return;
    added.splice(index, 1);
  };

  const onadd = () => {
    added.push({
      text: `Added ${randomHex(1)}-${added.length + 1}`,
      tabId: getUUID(),
    });
  };

  let active: unknown | undefined = $state();
  const onClear = () => {
    active = undefined;
  };

  let animate = $state(true);
  const options = $state<NeoTabsProps>({
    disabled: false,
    close: true,
    add: true,
    slide: true,
    toggle: true,
    before: false,
    skeleton: false,
    vertical: false,
    nowrap: false,
  });

  const columns: { label: string; props?: NeoTabsProps }[] = [{ label: 'Default' }, { label: 'Glass', props: { glass: true } }];
</script>

<div class="row">
  <div class="column">
    <NeoButtonGroup text rounded>
      <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
      <NeoButton toggle bind:checked={options.before}>Before</NeoButton>
      <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
      <NeoButton toggle bind:checked={options.nowrap}>No Wrap</NeoButton>
      <NeoButton toggle bind:checked={animate}>Animate</NeoButton>
      <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
      <NeoButton onclick={onClear}>Clear</NeoButton>
    </NeoButtonGroup>
  </div>
</div>

{#snippet icon()}
  <NeoIconAccount />
{/snippet}

{#snippet tabs()}
  {#each added as { text, ...tab } (tab.tabId)}
    <NeoTab {...tab}>{text}</NeoTab>
  {/each}
{/snippet}

{#snippet content(word)}
  <p>{Array.from({ length: 50 }, () => word).join(' ')}</p>
{/snippet}

{#snippet panes()}
  <NeoTabsCard {animate} class="panel">
    <NeoTabPanel empty>
      <NeoSkeletonText alt justify loading={options.skeleton}>
        {@render content('Empty')}
      </NeoSkeletonText>
    </NeoTabPanel>

    {#each added as { text, tabId } (tabId)}
      <NeoTabPanel {tabId}>
        <NeoSkeletonText alt justify loading={options.skeleton}>
          {@render content(text)}
        </NeoSkeletonText>
      </NeoTabPanel>
    {/each}
  </NeoTabsCard>
{/snippet}

{#snippet group(props: NeoTabsProps = {})}
  <div class="column" class:vertical={options.vertical}>
    <NeoTabs {panes} bind:active {onclose} {onadd} {onchange} {...options} {...props}>
      {@render tabs()}
    </NeoTabs>
  </div>
{/snippet}

<section>
  <div class="row">
    {#each columns as { label, props } (label)}
      <div class="column content" class:max={options.vertical}>
        <span class="label">{label}</span>

        {#if props?.glass}
          <SphereBackdrop>{@render group(props)}</SphereBackdrop>
        {:else}
          {@render group(props)}
        {/if}
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .content {
    flex: 0 1 37.5rem;
    max-width: 37.5rem;

    &.max {
      flex: 0 1 40rem;
      max-width: unset;
    }
  }

  :global(.panel) {
    min-width: 37rem;
    min-height: 20rem;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.vertical {
      flex-direction: row;

      :global(.panel) {
        min-width: 28.5rem;
        min-height: 24rem;
      }
    }
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }
</style>
