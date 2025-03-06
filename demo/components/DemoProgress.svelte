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
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import NeoProgressMark from '~/progress/NeoProgressMark.svelte';
  import { NeoProgressDirection, type NeoProgressHTMLElement, type NeoProgressProps, NeoProgressState } from '~/progress/neo-progress.model';
  import { getDefaultElevation } from '~/utils/shadow.utils';

  const options = $state<NeoProgressProps>({ value: 40, buffer: 60, direction: NeoProgressDirection.Right });
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
    track: true,
  });

  const onPressed = () => {
    bar.elevation = getDefaultElevation(bar.pressed, -1);
  };
</script>

<div class="row">
  <NeoButtonGroup rounded>
    <NeoButton toggle bind:checked={bar.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={bar.track}>Track</NeoButton>
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
    defaultValue={-1}
    rounded
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />
</div>

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
    <NeoProgressBar aria-label="Default" {...options} {...bar} buffer={undefined} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Buffer</span>
    <NeoProgressBar aria-label="Buffer" {...options} {...bar} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Min 40</span>
    <NeoProgressBar aria-label="Min 40" min="40" {...options} {...bar} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Min 40 Max 80</span>
    <NeoProgressBar aria-label="Min 40 Max 80" min="40" max="80" {...options} {...bar} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Low 20</span>
    <NeoProgressBar aria-label="Low 20" low="10" {...options} {...bar} color={['error', options.color]} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">High 90</span>
    <NeoProgressBar aria-label="High 90" high="90" {...options} {...bar} color={[options.color, 'success']} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Low 20 High 90</span>
    <NeoProgressBar aria-label="Low 20 High 90" low="10" high="90" {...options} {...bar} color={['error', options.color, 'success']} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Indeterminate</span>
    <NeoProgressBar aria-label="Indeterminate" indeterminate {...options} {...bar} />
  </div>
</div>

<div class="row">
  <div class="column content" class:vertical>
    <span class="label">Controlled & Label</span>
    <div class="progress-label">
      <NeoProgressBar aria-label="Controlled and label" bind:ref={controlled} bind:state={controlledState} direction={options.direction} {...bar}>
        {#snippet before(ctx)}
          <span class="progress-label-value" data-placement={ctx.direction}>{ctx.value}%</span>
        {/snippet}
      </NeoProgressBar>
    </div>
  </div>
</div>

<div class="row control-group">
  <NeoButtonGroup
    rounded
    pulse={[NeoProgressState.Active, NeoProgressState.Paused].includes(controlledState)}
    elevation="2"
    button={{ active: -1 }}
    class={{ 'neo-stop': controlledState === NeoProgressState.Paused }}
  >
    <NeoButton rounded onclick={() => controlled?.cancel()} ratio="1/1" aria-label="cancel" title="cancel">
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
    <span class="label">Marks</span>
    <NeoProgressBar aria-label="Custom marks" {...options} {...bar} buffer={undefined} marks={[0, 25, 50, 75, 100]}>
      {#snippet mark(ctx)}
        <NeoProgressMark
          {...ctx}
          glass={bar.glass}
          onclick={() => {
            options.value = ctx.position;
          }}
        />
      {/snippet}
    </NeoProgressBar>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .control-group {
    :global(.neo-button-group) {
      --neo-btn-group-scale-x: 2;
      --neo-btn-group-scale-y: 3;
    }

    :global(.neo-button-group.neo-stop::after),
    :global(.neo-button-group.neo-stop::before) {
      animation-play-state: paused;
    }
  }

  .content {
    &.vertical {
      height: min(50vw, 20rem);
    }

    &:not(.vertical) {
      width: max(80vw, 20rem);
    }

    .progress-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;

      &-value {
        margin: 0.125rem;
        font-size: var(--neo-font-size-sm);
        line-height: var(--neo-line-height-sm);

        &[data-placement='left'] {
          margin-inline-start: auto;
        }

        &[data-placement='right'] {
          margin-inline-end: auto;
        }

        &[data-placement='top'],
        &[data-placement='bottom'] {
          margin-inline-start: 2ch;
        }
      }
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
