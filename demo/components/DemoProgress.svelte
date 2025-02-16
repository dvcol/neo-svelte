<script lang="ts">
  import { colorOptions } from '../utils/color.utils';

  import type { NeoProgressBarProps } from '~/progress/neo-progress-bar.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconDoubleChevronLeft from '~/icons/IconDoubleChevronLeft.svelte';
  import IconDoubleChevronRight from '~/icons/IconDoubleChevronRight.svelte';
  import IconPlayPause from '~/icons/IconPlayPause.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { displayValue, type NeoSelectOption } from '~/inputs/neo-select.model';
  import NeoProgress from '~/progress/NeoProgress.svelte';
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import { NeoProgressDirection, type NeoProgressHTMLElement, type NeoProgressProps, NeoProgressState } from '~/progress/neo-progress.model';
  import { getDefaultElevation } from '~/utils/shadow.utils';

  const options = $state<NeoProgressProps>({ value: 40, buffer: 60 });
  const vertical = $derived([NeoProgressDirection.Top, NeoProgressDirection.Bottom].includes(options.direction));

  const directionOptions: NeoSelectOption[] = [
    {
      label: 'Right',
      value: NeoProgressDirection.Right,
    },
    {
      label: 'Left',
      value: NeoProgressDirection.Left,
    },
    {
      label: 'Top',
      value: NeoProgressDirection.Top,
    },
    {
      label: 'Bottom',
      value: NeoProgressDirection.Bottom,
    },
  ];

  let controlledState = $state();
  let controlled = $state<NeoProgressHTMLElement>();
  const onStopStart = () => {
    if (!controlled) return;
    if (controlledState === NeoProgressState.Active) controlled.stop();
    else if (controlledState === NeoProgressState.Completed) controlled.reset(true);
    else controlled.start();
  };
  const label = $derived(NeoProgressState.Active === controlledState ? 'pause' : 'play');

  const bar = $state<NeoProgressBarProps>({
    elevation: -1,
    borderless: false,
    rounded: false,
    pressed: false,
    glass: false,
  });

  const onPressed = () => {
    bar.elevation = getDefaultElevation(bar.pressed, -1);
  };
</script>

<div class="row">
  <NeoNumberStep
    label="Value"
    placement="left"
    center
    floating={false}
    bind:value={options.value}
    min={0}
    max={100}
    step="10"
    groupProps={{ style: 'margin-left: 4rem' }}
  />
  <NeoNumberStep
    label="Buffer"
    placement="left"
    center
    bind:value={options.buffer}
    min={options.value}
    max={100}
    step="10"
    groupProps={{ style: 'margin-left: 4rem' }}
  />

  <NeoSelect
    label="Direction"
    placeholder="Direction"
    placement="left"
    floating={false}
    color={options.direction}
    display={displayValue}
    size="10"
    bind:value={options.direction}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={directionOptions}
    openOnFocus
  />

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
  />
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Default</span>
    <NeoProgress {...options} buffer={undefined} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Buffer</span>
    <NeoProgress {...options} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Min 40</span>
    <NeoProgress min="40" {...options} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Min 40 Max 80</span>
    <NeoProgress min="40" max="80" {...options} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Low 20</span>
    <NeoProgress low="10" {...options} color={['error', options.color]} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">High 90</span>
    <NeoProgress high="90" {...options} color={[options.color, 'success']} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Low 20 High 90</span>
    <NeoProgress low="10" high="90" {...options} color={['error', options.color, 'success']} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Indeterminate</span>
    <NeoProgress indeterminate {...options} />
  </div>
</div>

<div class="row">
  <NeoButtonGroup
    rounded
    pulse={[NeoProgressState.Active, NeoProgressState.Paused].includes(controlledState)}
    elevation="2"
    button={{ active: -1 }}
    class={{ 'neo-stop': controlledState === NeoProgressState.Paused }}
  >
    <NeoButton rounded onclick={() => controlled?.cancel()} ratio="1/1" aria-lable="cancel" title="cancel">
      {#snippet icon()}
        <IconDoubleChevronLeft />
      {/snippet}
    </NeoButton>
    <NeoButton rounded onclick={onStopStart} checked={NeoProgressState.Active === controlledState} ratio="1/1" aria-label={label} title={label}>
      {#snippet icon()}
        <IconPlayPause state={label} />
      {/snippet}
    </NeoButton>
    <NeoButton rounded onclick={() => controlled?.complete()} aria-label="finish" title="finish">
      {#snippet icon()}
        <IconDoubleChevronRight />
      {/snippet}
    </NeoButton>
  </NeoButtonGroup>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Controlled</span>
    <NeoProgress bind:ref={controlled} bind:state={controlledState} direction={options.direction} />
  </div>
</div>

<div class="row">
  <NeoButtonGroup rounded>
    <NeoButton toggle bind:checked={bar.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={bar.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={bar.pressed} onclick={onPressed}>Pressed</NeoButton>
    <NeoButton toggle bind:checked={bar.glass}>Glass</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={bar.elevation}
    min={-2}
    max={2}
    defaultValue={0}
    rounded
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Progress bar</span>
    <NeoProgressBar {...options} {...bar} />
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .content {
    :global(.neo-button-group) {
      --neo-btn-group-scale-x: 2;
      --neo-btn-group-scale-y: 3;
    }

    :global(.neo-button-group.neo-stop::after),
    :global(.neo-button-group.neo-stop::before) {
      animation-play-state: paused;
    }

    &.vertical {
      height: min(50vw, 20rem);
    }

    &:not(.vertical) {
      width: max(80vw, 20rem);
    }
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
