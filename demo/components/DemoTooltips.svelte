<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { height } from '@dvcol/svelte-utils/transition';

  import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoNativeSelect from '~/inputs/NeoNativeSelect.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoPopSelect from '~/tooltips/NeoPopSelect.svelte';
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

  const position = [
    { value: 'auto', label: 'Auto' },
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
  ];

  const items = $state(
    [
      { label: 'John Doe', value: 'John', description: 'john.doe@gmail.com' },
      { label: 'Peter Jackson', value: 'Peter', description: 'peter.jackson@icloud.me' },
      { label: 'John Smith', value: 'Smith', description: 'john.smith@hotmal.com' },
      { label: 'Alice Johnson', value: 'Alice', description: 'alice.johnson@outlook.com' },
      { label: 'Bob Brown', value: 'Bob', description: 'bob.brown@gmail.com' },
      { label: 'Charlie Davis', value: 'Charlie', description: 'charlie.davis@icloud.com' },
      { label: 'Diana Evans', value: 'Diana', description: 'diana.evans@hotmail.com' },
      { label: 'Eve Foster', value: 'Eve', description: 'eve.foster@yahoo.com' },
      { label: 'Frank Green', value: 'Frank', description: 'frank.green@outlook.com' },
      { label: 'Grace Harris', value: 'Grace', description: 'grace.harris@gmail.com' },
      { label: 'Henry Irving', value: 'Henry', description: 'henry.irving@icloud.com' },
      { label: 'Ivy Johnson', value: 'Ivy', description: 'ivy.johnson@hotmail.com' },
      { label: 'Jack King', value: 'Jack', description: 'jack.king@yahoo.com' },
      { label: 'Karen Lee', value: 'Karen', description: 'karen.lee@outlook.com' },
      {
        label: 'Directors',
        divider: true,
        sticky: true,
        items: [
          { label: 'Denis VVilleneuve', value: 'Denis', description: '+33 1 25 48 45 45' },
          { label: 'Christopher Nolan', value: 'Christopher', description: '+44 2 07 94 60 95' },
          { label: 'Quentin Tarantino', value: 'Quentin', description: '+33 1 05 55 12 34' },
          { label: 'Martin Scorsese', value: 'Martin', description: '+33 1 25 55 56 78' },
          { label: 'Steven Spielberg', value: 'Steven', description: '+33 1 85 55 87 65' },
        ].map(item => ({ ...item, id: getUUID(), before: avatar })),
      },
      {
        label: 'Actors',
        divider: true,
        sticky: true,
        items: [
          { label: 'Leonardo DiCaprio', value: 'Leonardo', description: '+1 310 555 1234' },
          { label: 'Brad Pitt', value: 'Brad', description: '+1 323 555 5678' },
          { label: 'Meryl Streep', value: 'Meryl', description: '+1 212 555 8765' },
          { label: 'Tom Hanks', value: 'Tom', description: '+1 310 555 4321' },
          { label: 'Natalie Portman', value: 'Natalie', description: '+1 818 555 6789' },
        ].map(item => ({ ...item, id: getUUID(), before: avatar })),
      },
    ].map(item => ({ ...item, id: getUUID(), before: avatar })),
  );

  let selected = $state();
</script>

{#snippet avatar()}
  <span class="custom-item-avatar">
    <IconAccount size="1.5rem" />
  </span>
{/snippet}

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

  <NeoNativeSelect
    label="Placement"
    position="left"
    bind:value={options.placement}
    rounded={options.rounded}
    containerProps={{ style: 'margin-left: 6.75rem' }}
    options={position}
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

<div class="row">
  <div class="column content">
    <span class="label">PopSelect</span>
    <NeoPopSelect
      search
      bind:selected
      {items}
      rounded={options.rounded}
      tooltipProps={options}
      height={{ max: '20rem' }}
      width={{ min: '15.5rem' }}
      onselect={e => console.info('selected', e)}
    >
      <NeoButton text rounded={options.rounded}>Hover select: {selected?.item?.label ?? 'none selected'}</NeoButton>
    </NeoPopSelect>
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

  @media (width < 600px) {
    .column.content {
      flex: 0 1 80%;
    }
  }
</style>
