<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { height } from '@dvcol/svelte-utils/transition';

  import { fly } from 'svelte/transition';

  import { colorOptions } from '../utils/color.utils';

  import type { NeoListSelectedItem } from '~/list/neo-list.model.js';

  import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoTransitionContainer from '~/containers/NeoTransitionContainer.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import IconQuestionMark from '~/icons/IconQuestionMark.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoPopSelect from '~/tooltips/NeoPopSelect.svelte';
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';

  import { DefaultShadowShallowElevation, MaxShadowElevation } from '~/utils/shadow.utils.js';
  import { defaultDuration, quickDuration } from '~/utils/transition.utils';

  const options = $state<NeoTooltipProps>({
    color: '',
    filled: false,
    tinted: false,
    rounded: true,
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

  const simpleItems = [
    'John Doe',
    'Peter Jackson',
    'John Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana Evans',
    'Eve Foster',
    'Frank Green',
    'Grace Harris',
    'Henry Irving',
    'Ivy Johnson',
  ];

  let simpleSelected = $state<NeoListSelectedItem>();

  const complexItems = [
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
  ].map(item => ({ ...item, id: getUUID(), before: avatar }));

  let complexSelected = $state<NeoListSelectedItem>();

  let open = $state(false);
</script>

{#snippet avatar()}
  <span class="custom-item-avatar">
    <IconAccount size="1.5rem" />
  </span>
{/snippet}

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.filled}>Filled</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
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
    placeholder="Select placement"
    position="left"
    floating={false}
    bind:value={options.placement}
    rounded={options.rounded}
    containerProps={{ style: 'margin-left: 6.75rem' }}
    options={position}
    size="15"
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

  <NeoSelect
    label="Color"
    placeholder="Select color"
    position="left"
    floating={false}
    size="10"
    bind:value={options.color}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={colorOptions}
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
    <span class="label">Simple hover Select</span>
    <NeoPopSelect
      bind:selected={simpleSelected}
      items={simpleItems}
      rounded={options.rounded}
      height={'20rem'}
      tooltipProps={options}
      onselect={e => console.info('selected', e)}
    >
      <NeoButton text rounded={options.rounded}>Hover select: {simpleSelected?.item?.value ?? 'none selected'}</NeoButton>
    </NeoPopSelect>
  </div>

  {#snippet question()}
    <IconQuestionMark size="1.5rem" />
  {/snippet}

  <div class="column content">
    <span class="label">Click pop select</span>
    <NeoPopSelect
      search
      bind:open
      bind:selected={complexSelected}
      items={complexItems}
      rounded={options.rounded}
      height="28rem"
      width="min"
      tooltipProps={{ ...options, openOnFocus: false, openOnHover: false }}
    >
      <NeoButton flat ghost shallow rounded={options.rounded} bind:checked={open} toggle>
        <NeoTransitionContainer overflow="hidden" style="min-width: 252px; margin: 0.5rem">
          {#key complexSelected?.item?.id}
            <div
              in:fly={{ duration: defaultDuration, y: complexSelected?.item ? '-50%' : '50%' }}
              out:fly={{ duration: quickDuration, y: complexSelected?.item ? '50%' : '-50%' }}
            >
              <NeoListBaseItem before={question} item={complexSelected?.item ?? { label: 'None Selected', description: 'Please select a profile' }} />
            </div>
          {/key}
        </NeoTransitionContainer>
      </NeoButton>
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
