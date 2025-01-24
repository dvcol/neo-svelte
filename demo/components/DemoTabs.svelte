<script lang="ts">
  import { randomHex } from '@dvcol/common-utils/common/crypto';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { useButtonState } from '../utils/use-button-state.svelte';

  import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
  import type { NeoTabContextValue, NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';

  const { onClick, loading: loading$, onLoading } = useButtonState('DemoTabsClicked');
  const loading = $derived.by(loading$);
  let skeleton = $state(false);

  const added = $state<NeoTabProps>([]);
  const onclose = (id: TabId) => {
    console.info('Close', id);
    const index = added.findIndex(tab => tab.tabId === id);
    if (index === -1) return;
    added.splice(index, 1);
  };
  const onadd = () => {
    console.info('Add');
    added.push({
      text: `Added ${randomHex(2)}-${added.length + 1}`,
      tabId: crypto.randomUUID(),
      value: added.length + 1,
    });
  };

  let active: unknown | undefined = $state('button');
  let value: unknown | undefined = $state('button');

  const onChange = (id?: TabId, context?: NeoTabContextValue) => {
    active = id;
    value = context?.value;
  };

  const onClear = () => onChange();

  const options = $state<NeoTabsProps>({
    disabled: false,
    close: false,
    add: false,
    slide: true,
    toggle: false,
    line: false,
    pill: false,
    rounded: false,
    vertical: false,
    glass: false,
  });

  const columns: { label: string; props?: NeoTabsProps }[] = [
    { label: 'Default' },
    { label: 'Flat', props: { elevation: 0 } },
    { label: 'Text', props: { elevation: 0, borderless: true } },
    { label: 'Inset', props: { elevation: -2 } },
    { label: 'Pressed', props: { elevation: -2, slideElevation: 2, pressed: true } },
    { label: 'Convex', props: { elevation: 2, convex: true } },
  ];
</script>

{#snippet icon()}
  <IconAccount />
{/snippet}

{#snippet tabs()}
  <NeoTab tabId="button" value="button" close={false} onclick={onClick}>Button</NeoTab>
  <NeoTab tabId="disabled" value="disabled" disabled close={false} onclick={onClick}>Disabled</NeoTab>
  <NeoTab tabId="loading" value="loading" {loading} close={false} onclick={onLoading}>Loading</NeoTab>
  <NeoTab tabId="icon" value="icon" {loading} close={false} onclick={onLoading} {icon} />
  <NeoTab tabId="icon-label" value="icon-label" close={false} onclick={onClick} {icon}>Icon</NeoTab>
  <NeoTab tabId="reversed" value="reversed" reverse close={false} onclick={onClick} {icon}>Reversed</NeoTab>
  {#each added as { text, ...tab } (tab.tabId)}
    <NeoTab {...tab}>{text}</NeoTab>
  {/each}
{/snippet}

{#snippet group(props: NeoTabsProps = {})}
  <NeoTabs bind:active onchange={onChange} {skeleton} {onclose} {onadd} {...options} {...props}>
    {@render tabs()}
  </NeoTabs>
{/snippet}

<div class="row">
  <div class="column">
    <NeoButtonGroup>
      <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
      <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
      <NeoButton toggle bind:checked={options.add}>Add</NeoButton>
      <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
      <NeoButton toggle bind:checked={options.slide}>Slide</NeoButton>
      <NeoButton toggle bind:checked={options.toggle}>Toggle</NeoButton>
      <NeoButton toggle bind:checked={options.line}>Line</NeoButton>
      <NeoButton toggle bind:checked={options.pill}>Pill</NeoButton>
      <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
      <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
      <NeoButton toggle bind:checked={skeleton}>Skeleton</NeoButton>
      <NeoButton onclick={onClear}>Clear</NeoButton>
    </NeoButtonGroup>
  </div>
</div>

<div class="values">
  <span>Active: {active}</span>
  <span>Value: {typeof value === 'object' ? JSON.stringify(value, undefined, 2) : value}</span>
</div>

<div class="row" class:invert={!options.vertical}>
  {#each columns as { label, props }}
    <div class="column">
      <span class="label">{label}</span>
      <SphereBackdrop glass={options.glass}>
        {@render group(props)}
      </SphereBackdrop>
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .values,
  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }

  .invert {
    @include flex.column($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    .column {
      @include flex.row($gap: var(--neo-gap-xxl));
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
