<script lang="ts">
  import { height } from '@dvcol/svelte-utils/transition';

  import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';

  import { DefaultShadowShallowElevation, MaxShadowElevation } from '~/utils/shadow.utils.js';

  const options = $state<NeoTooltipProps>({
    rounded: false,
    elevation: DefaultShadowShallowElevation,

    placement: 'bottom',
    openOnHover: true,
    keepOpenOnHover: false,
    openOnFocus: true,
    keepOpenOnFocus: false,
    closeOnDismiss: true,
  });

  let containerRef = $state<HTMLElement>();
  let content = $state();
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.openOnHover}>Hover</NeoButton>
    <NeoButton toggle bind:checked={options.openOnFocus}>Focus</NeoButton>
    <NeoButton
      toggle
      bind:checked={() => options.keepOpenOnHover, // eslint-disable-line no-sequences
      value => {
        options.keepOpenOnHover = value;
        options.keepOpenOnFocus = value;
      }}
    >
      Keep Open
    </NeoButton>
    <NeoButton toggle bind:checked={options.closeOnDismiss}>Dismiss</NeoButton>
  </NeoButtonGroup>

  <NeoSelect
    label="Placement"
    position="left"
    bind:value={options.placement}
    rounded={options.rounded}
    containerProps={{ style: 'margin-left: 6.75rem' }}
    options={[
      { value: 'top', label: 'Top' },
      { value: 'top-start', label: 'Top Start' },
      { value: 'top-end', label: 'Top End' },
      { value: 'right', label: 'Right' },
      { value: 'right-start', label: 'Right Start' },
      { value: 'right-end', label: 'Right End' },
      { value: 'bottom', label: 'Bottom' },
      { value: 'bottom-start', label: 'Bottom Start' },
      { value: 'bottom-end', label: 'Bottom End' },
      { value: 'left', label: 'Left' },
      { value: 'left-start', label: 'Left Start' },
      { value: 'left-end', label: 'Left End' },
    ]}
  />

  <NeoNumberStep
    label="Elevation"
    position="left"
    center
    bind:value={options.elevation}
    min={1}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowShallowElevation}
    rounded={options.rounded}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />
</div>

{#snippet tooltip()}
  <div class="neo-tooltip-content">
    <div>Tooltip</div>
    <div>Line 1</div>
    <div>Line 2</div>
    <div>Line 3</div>
    {#if content}
      <div transition:height={{ duration: 200 }} style="overflow: hidden">{content}</div>
    {/if}
  </div>
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Tooltip</span>
    <NeoTooltip {tooltip} width {...options}>
      <NeoButton text rounded={options.rounded}>Hover Me</NeoButton>
    </NeoTooltip>
  </div>

  <div class="column content">
    <span class="label">Tooltip (string)</span>
    <NeoTooltip tooltip="This is a string tooltip" {...options}>
      <NeoButton text rounded={options.rounded}>Hover Me</NeoButton>
    </NeoTooltip>
  </div>

  <div class="column content">
    <span class="label">Tooltip (ref)</span>

    <NeoInput bind:value={content} bind:containerRef placeholder="Placeholder" rounded={options.rounded} />

    <NeoTooltip {tooltip} target={containerRef} offset={8} width="min" {...options} />
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .neo-tooltip-content {
    @include flex.column($center: true, $gap: var(--neo-gap-xxs));
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    &.content {
      flex: 1 0 20%;
      min-width: fit-content;
      max-width: min(25%, 50rem);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
