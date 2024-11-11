<script lang="ts">
  import { randomHex } from '@dvcol/common-utils/common/crypto';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { TabId } from '~/nav/neo-tab.model.js';
  import type { TabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabPane from '~/nav/NeoTabPane.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';

  const added = $state([
    { text: `Added ${randomHex(2)}-0`, tabId: crypto.randomUUID() },
    { text: `Added ${randomHex(2)}-1`, tabId: crypto.randomUUID() },
  ]);
  const onclose = (id: TabId) => {
    const index = added.findIndex(tab => tab.tabId === id);
    if (index === -1) return;
    added.splice(index, 1);
  };
  const onadd = () => {
    added.push({ text: `Added ${randomHex(2)}-${added.length + 1}`, tabId: crypto.randomUUID() });
  };

  let active: unknown | undefined = $state();
  const onClear = () => {
    active = undefined;
  };

  let loading = $state(false);
  let skeleton = $state(false);
  let vertical = $state(false);
  const options = $state({ disabled: false, close: true, add: true, slide: true, shallow: false, toggle: true, position: 'after' });

  const togglePosition = () => {
    options.position = options.position === 'after' ? 'before' : 'after';
  };

  const columns: { label: string; props?: TabsProps }[] = [{ label: 'Default' }];
</script>

<div class="row">
  <div class="column">
    <NeoButtonGroup>
      <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
      <NeoButton toggle bind:checked={options.shallow}>Shallow</NeoButton>
      <NeoButton onclick={togglePosition}>Position</NeoButton>
      <NeoButton toggle bind:checked={vertical}>Vertical</NeoButton>
      <NeoButton toggle bind:checked={skeleton}>Skeleton</NeoButton>
      <NeoButton toggle bind:checked={loading}>Loading</NeoButton>
      <NeoButton onclick={onClear}>Clear</NeoButton>
    </NeoButtonGroup>
  </div>
</div>

{#snippet icon()}
  <IconAccount />
{/snippet}

{#snippet tabs()}
  <NeoTab tabId="button" value="button" close={false}>Button</NeoTab>
  <NeoTab tabId="icon" value="icon" {loading} close={false} {icon} />
  <NeoTab tabId="reversed" value="reversed" reverse close={false} {icon}>Reversed</NeoTab>
  {#each added as { text, ...tab } (tab.tabId)}
    <NeoTab {...tab}>{text}</NeoTab>
  {/each}
{/snippet}

{#snippet panes()}
  <NeoTabPane empty>
    <div>Empty</div>
  </NeoTabPane>
  <NeoTabPane tabId="button">
    <div>Button</div>
  </NeoTabPane>
  <NeoTabPane tabId="icon" {loading} {icon}>
    <div>Icon</div>
  </NeoTabPane>
  <NeoTabPane tabId="reversed" {icon}>
    <div>Reversed</div>
  </NeoTabPane>

  {#each added as { text, tabId } (tabId)}
    <NeoTabPane {tabId}>{text}</NeoTabPane>
  {/each}
{/snippet}

{#snippet group(props: TabsProps = {})}
  <div class="column">
    <NeoTabs {panes} {active} {vertical} {skeleton} {onclose} {onadd} {...options} {...props}>
      {@render tabs()}
    </NeoTabs>
  </div>
{/snippet}

<div class="row">
  {#each columns as { label, props }}
    <div class="column">
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
    @include flex.column($center: true, $gap: var(--gap-lg));
  }

  .row {
    @include flex.row($gap: var(--gap-xl));

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }
</style>
