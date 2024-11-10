<script lang="ts">
  import { useWatchMedia } from '@dvcol/svelte-utils/media';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { useButtonState } from '../utils/use-button-state.svelte';

  import type { NeoButtonGroupContext } from '~/buttons/neo-button-group.model';
  import type { TabId } from '~/nav/neo-tab.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';

  const { onClick, loading: loading$, onLoading } = useButtonState('DemoTabsClicked');
  const loading = $derived.by(loading$);
  let skeleton = $state(false);

  const { matches } = useWatchMedia('(max-width: 1550px)');
  const vertical = $derived.by(matches);

  const added = $state([]);
  const onclose = (id: TabId) => {
    console.info('Close', id);
    const index = added.findIndex(tab => tab.tabId === id);
    if (index === -1) return;
    added.splice(index, 1);
  };
  const onadd = () => {
    console.info('Add');
    added.push({ text: `Added ${added.length + 1}`, tabId: crypto.randomUUID() });
  };

  let active: unknown | undefined = $state('button');
  let value: unknown | undefined = $state('button');

  const onChange = (id?: TabId, _value?: unknown) => {
    active = id;
    value = _value;
  };

  const onClear = () => onChange();

  const options = $state({ disabled: false, close: true, add: true, slide: true, shallow: false });

  const columns = [
    { label: 'Default' },
    { label: 'Rounded', props: { rounded: true } },
    { label: 'Flat', props: { flat: true } },
    { label: 'Text', props: { text: true } },
    { label: 'Line', props: { text: true, line: true } },
    { label: 'Recessed', props: { recessed: true, line: true } },
    { label: 'Glass', props: { glass: true } },
  ];
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

{#snippet buttons()}
  <NeoTab tabId="button" value="button" close={false} onclick={onClick}>Button</NeoTab>
  <NeoTab tabId="disabled" value="disabled" disabled close={false} onclick={onClick}>Disabled</NeoTab>
  <NeoTab tabId="loading" value="loading" {loading} close={false} onclick={onLoading}>Loading</NeoTab>
  <NeoTab tabId="icon" value="icon" {loading} close={false} onclick={onLoading} {icon} />
  <NeoTab tabId="icon-label" value="icon-label" close={false} onclick={onClick} {icon}>Icon</NeoTab>
  <NeoTab tabId="reversed" value="reversed" reverse close={false} onclick={onClick} {icon}>Reversed</NeoTab>
{/snippet}

{#snippet group(props: NeoButtonGroupContext = {})}
  <NeoTabs bind:active onchange={onChange} {vertical} {skeleton} {onclose} {onadd} {...options} {...props}>
    {@render buttons()}
    {#each added as { text, ...tab } (tab.tabId)}
      <NeoTab {...tab}>{text}</NeoTab>
    {/each}
  </NeoTabs>
{/snippet}

<div class="row">
  <span>Active: {active}</span>
  <span>Value: {typeof value === 'object' ? JSON.stringify(value, undefined, 2) : value}</span>
</div>

<div class="row">
  <div class="column">
    <NeoButtonGroup>
      <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
      <NeoButton toggle bind:checked={options.shallow}>Shallow</NeoButton>
      <NeoButton toggle bind:checked={options.add}>Add</NeoButton>
      <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
      <NeoButton toggle bind:checked={options.slide}>Slide</NeoButton>
      <NeoButton toggle bind:checked={skeleton}>Skeleton</NeoButton>
      <NeoButton onclick={onClear}>Clear</NeoButton>
    </NeoButtonGroup>
  </div>
</div>

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

  @media (width > 1550px) {
    .column {
      @include flex.row($gap: var(--gap-xxl));
    }

    .row {
      @include flex.column($center: true, $gap: var(--gap-xl));
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
