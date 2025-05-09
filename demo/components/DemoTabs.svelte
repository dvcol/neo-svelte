<script lang="ts">
  import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
  import type { NeoTabRowItem } from '~/nav/neo-tabs-row.model';
  import type { NeoTabContextValue, NeoTabsProps } from '~/nav/neo-tabs.model.js';

  import { randomHex } from '@dvcol/common-utils/common/crypto';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabDivider from '~/nav/NeoTabDivider.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoTabsRow from '~/nav/NeoTabsRow.svelte';

  import { colorOptions } from '../utils/color.utils';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';
  import { useButtonState } from '../utils/use-button-state.svelte';

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
      tabId: getUUID(),
      value: added.length + 1,
    });
  };

  let active = $state<string>('button');
  let context = $state<NeoTabContextValue>('button');

  const onChange = (id?: TabId, ctx?: NeoTabContextValue) => {
    console.info('Change', { id, ctx });
  };

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
    dim: true,

    color: '',
  });

  const columns: { label: string; props?: NeoTabsProps }[] = [
    { label: 'Default' },
    { label: 'Flat', props: { elevation: 0 } },
    { label: 'Text', props: { elevation: 0, borderless: true } },
    { label: 'Inset', props: { elevation: -2 } },
    { label: 'Pressed', props: { elevation: -2, slideElevation: 2, pressed: true } },
    { label: 'Convex', props: { elevation: 2, convex: true } },
  ];

  let collapseActive = $state<string>('button');
  let collapseContext = $state<NeoTabContextValue>('button');

  const items: NeoTabRowItem[] = [
    { label: 'Button', tabId: 'button', value: 'button', onclick: onClick, close: false },
    { label: 'Disabled', tabId: 'disabled', value: 'disabled', disabled: true, close: false, onclick: onClick },
    { divider: true },
    { tabId: 'icon', value: 'icon', get loading() {
      return loading;
    }, onclick: onLoading, icon },
    { label: 'Icon', tabId: 'icon-label', value: 'icon-label', close: false, onclick: onClick, icon },
    { divider: true },
    { label: 'Reversed', tabId: 'reversed', value: 'reversed', reverse: true, close: false, onclick: onClick, icon },
    ...Array.from({ length: 3 }, (_, i) => ({
      label: `Button ${i + 1}`,
      tabId: `button-${i + 1}`,
      value: `button-value-${i + 1}`,
      onclick: onClick,
    })),
    { divider: true },
    ...Array.from({ length: 3 }, (_, i) => ({
      label: `Button ${i + 4}`,
      tabId: `button-${i + 4}`,
      value: `button-value-${i + 4}`,
      onclick: onClick,
    })),
  ];
</script>

{#snippet icon()}
  <NeoIconAccount />
{/snippet}

{#snippet tabs()}
  <NeoTab tabId="button" value="button" close={false} onclick={onClick}>Button</NeoTab>
  <NeoTab tabId="disabled" value="disabled" disabled close={false} onclick={onClick}>Disabled</NeoTab>
  <NeoTabDivider aria-hidden="true" />
  <NeoTab tabId="loading" value="loading" {loading} close={false} onclick={onLoading}>Loading</NeoTab>
  <NeoTab tabId="icon" aria-label="icon button" value="icon" {loading} close={false} onclick={onLoading} {icon} />
  <NeoTab tabId="icon-label" value="icon-label" close={false} onclick={onClick} {icon}>Icon</NeoTab>
  <NeoTabDivider aria-hidden="true" />
  <NeoTab tabId="reversed" value="reversed" reverse close={false} onclick={onClick} {icon}>Reversed</NeoTab>
  {#each added as { text, ...tab } (tab.tabId)}
    <NeoTab {...tab}>{text}</NeoTab>
  {/each}
{/snippet}

{#snippet group(props: NeoTabsProps = {})}
  <NeoTabs bind:active bind:value={context} onchange={onChange} {skeleton} {onclose} {onadd} {...options} {...props}>
    {@render tabs()}
  </NeoTabs>
{/snippet}

<div class="row">
  <NeoButtonGroup text rounded>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.add}>Add</NeoButton>
    <NeoButton toggle bind:checked={options.close}>Close</NeoButton>
    <NeoButton toggle bind:checked={options.slide}>Slide</NeoButton>
    <NeoButton toggle bind:checked={options.toggle}>Toggle</NeoButton>
    <NeoButton toggle bind:checked={options.line}>Line</NeoButton>
    <NeoButton toggle bind:checked={options.pill}>Pill</NeoButton>
    <NeoButton toggle bind:checked={options.dim}>Dim</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
    <NeoButton toggle bind:checked={skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <NeoSelect
    label="Color"
    placeholder="Select color"
    placement="left"
    floating={false}
    color={options.color}
    display={displayValue}
    size="10"
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={colorOptions}
    openOnFocus
    rounded
    glass
  />
</div>

{#snippet values(_active = active, _context = context)}
  <div class="values">
    <span>Active: {_active}</span>
    <span>Value: {typeof _context?.value === 'object' ? JSON.stringify(_context?.value, undefined, 2) : _context?.value}</span>
  </div>
{/snippet}

<section>
  {@render values(active, context)}

  <div class="content">
    <div class="row" class:invert={!options.vertical}>
      {#each columns as { label, props } (label)}
        <div class="column">
          <span class="label">{label}</span>
          <SphereBackdrop glass={options.glass}>
            {@render group(props)}
          </SphereBackdrop>
        </div>
      {/each}
    </div>
  </div>

  {@render values(collapseActive, collapseContext)}

  <div class="content">
    <div class="row" class:invert={!options.vertical}>
      <div class="column">
        <span class="label">Collapse</span>
        <SphereBackdrop glass={options.glass}>
          <NeoTabsRow {items} bind:active={collapseActive} bind:value={collapseContext} onchange={onChange} {skeleton} {onclose} {onadd} {...options} />
        </SphereBackdrop>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;

    :global(.neo-button-group) {
      max-width: min(80vw, 38rem);
      max-height: min(80vh, 31rem);
    }
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-xl));
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
