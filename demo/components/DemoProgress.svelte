<script lang="ts">
  import type { NeoSelectOption } from '~/inputs/neo-select.model';
  import type { NeoProgressBarContext, NeoProgressBarProps } from '~/progress/neo-progress-bar.model';
  import type { NeoProgressHTMLElement, NeoProgressProps, NeoProgressStatuses } from '~/progress/neo-progress.model';
  import type { SvelteEvent } from '~/utils/html-element.utils';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoIconDoubleChevronLeft from '~/icons/NeoIconDoubleChevronLeft.svelte';
  import NeoIconDoubleChevronRight from '~/icons/NeoIconDoubleChevronRight.svelte';
  import NeoIconPlayPause from '~/icons/NeoIconPlayPause.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import { NeoProgressDirection, NeoProgressStatus } from '~/progress/neo-progress.model';
  import NeoProgressBar from '~/progress/NeoProgressBar.svelte';
  import NeoProgressMark from '~/progress/NeoProgressMark.svelte';
  import { getDefaultElevation, MaxShallowShadowElevation, MinShallowShadowElevation } from '~/utils/shadow.utils';

  import { colorOptions } from '../utils/color.utils';

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

  let controlledState = $state<NeoProgressStatuses>();
  let controlled = $state<NeoProgressHTMLElement>();
  const onStopStart = (e: SvelteEvent<MouseEvent>) => {
    if (!controlled) return;
    if (controlledState === NeoProgressStatus.Active) controlled.stop();
    else if ([NeoProgressStatus.Completed, NeoProgressStatus.Error, NeoProgressStatus.Success, NeoProgressStatus.Warning].includes(controlledState)) controlled.reset(true, { indeterminate: e.altKey, pending: e.shiftKey });
    else controlled.start({ indeterminate: e.altKey, pending: e.shiftKey });
  };

  const onCancel = () => {
    controlled?.cancel();
  };

  const onComplete = (e: SvelteEvent<MouseEvent>) => {
    // if shift
    if (e.shiftKey) controlled?.complete({ state: NeoProgressStatus.Success });
    else if (e.altKey) controlled?.complete({ state: NeoProgressStatus.Error });
    else if (e.metaKey) controlled?.complete({ state: NeoProgressStatus.Warning });
    else controlled?.complete();
  };

  const label = $derived(NeoProgressStatus.Active === controlledState ? 'pause' : 'play');

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
  <NeoButtonGroup text rounded>
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
    min={MinShallowShadowElevation}
    max={MaxShallowShadowElevation}
    defaultValue={-1}
    rounded
    glass
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
    rounded
    glass
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
    rounded
    glass
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
    rounded
    glass
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
    rounded
    glass
  />
</div>

<section>
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
        <NeoProgressBar aria-label="Controlled and label" {...bar} bind:ref={controlled} bind:status={controlledState} direction={options.direction}>
          {#snippet before(ctx: NeoProgressBarContext)}
            <span class="progress-label-value" data-placement={ctx.direction}>{ctx.value}%</span>
          {/snippet}
        </NeoProgressBar>
      </div>
    </div>
  </div>

  <div class="row control-group">
    <NeoButtonGroup
      rounded
      pulse={[NeoProgressStatus.Active, NeoProgressStatus.Paused].includes(controlledState)}
      elevation="2"
      button={{ active: -1 }}
      class={{ 'neo-stop': controlledState === NeoProgressStatus.Paused }}
    >
      <NeoButton rounded onclick={onCancel} ratio="1/1" aria-label="cancel" title="cancel">
        {#snippet icon()}
          <NeoIconDoubleChevronLeft />
        {/snippet}
      </NeoButton>
      <NeoButton rounded onclick={onStopStart} checked={NeoProgressStatus.Active === controlledState} ratio="1/1" aria-label={label} title={label}>
        {#snippet icon()}
          <NeoIconPlayPause state={label} />
        {/snippet}
      </NeoButton>
      <NeoButton rounded onclick={onComplete} aria-label="finish" title="finish">
        {#snippet icon()}
          <NeoIconDoubleChevronRight />
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
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

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
