<script lang="ts">
  import NeoSelect from '../../src/lib/inputs/NeoSelect.svelte';

  import type { NeoStepperEvent, NeoStepperPlacements, NeoStepperProps, NeoStepperStep } from '~/stepper/neo-stepper.model';

  import { displayValue } from '~';
  import NeoButton from '~/buttons/NeoButton.svelte';

  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';

  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';

  import NeoStepper from '~/stepper/NeoStepper.svelte';
  import { NeoStepperPlacement } from '~/stepper/neo-stepper.model';
  import { DefaultShadowShallowElevation } from '~/utils/shadow.utils';

  const steps: NeoStepperStep[] = [
    {
      previous: true,
    },
    {
      next: true,
      previous: true,
    },
    {
      next: true,
      previous: false,
    },
    4,
    {
      next: 2,
      cancel: false,
      previous: 1,
    },
    6,
    7,
    8,
    {
      disabled: true,
    },
    {
      next: true,
      nextProps: {
        label: 'Finish',
        ariaLabel: 'Finish stepper',
        title: 'Finish stepper',
      },
    },
  ];

  const placementOptions: NeoStepperPlacements[] = [
    {
      label: 'Start',
      value: NeoStepperPlacement.Start,
    },
    {
      label: 'End',
      value: NeoStepperPlacement.End,
    },
  ];

  const options = $state<NeoStepperProps>({
    disabled: false,

    progress: true,
    marks: true,
    controls: true,

    loop: false,

    elevation: DefaultShadowShallowElevation,

    vertical: false,
    placement: NeoStepperPlacement.Start,

    onStep: (event: NeoStepperEvent) => console.info('Stepper step:', event),
  });
</script>

<div class="row">
  <NeoButtonGroup rounded>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.progress}>Progress</NeoButton>
    <NeoButton toggle bind:checked={options.marks}>Marks</NeoButton>
    <NeoButton toggle bind:checked={options.controls}>Controls</NeoButton>
    <NeoButton toggle bind:checked={options.loop}>Loop</NeoButton>
    <NeoButton toggle bind:checked={options.vertical}>Vertical</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={-2}
    max={2}
    defaultValue={DefaultShadowShallowElevation}
    rounded
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />

  <NeoSelect
    label="Placement"
    placeholder="Placement"
    placement="left"
    floating={false}
    color={options.placement}
    display={displayValue}
    size="10"
    bind:value={options.placement}
    containerProps={{ style: 'margin-left: 6rem' }}
    options={placementOptions}
    openOnFocus
  />
</div>

<div class="row">
  <div class="column content">
    <span class="label">Default</span>
    <NeoStepper {steps} {...options}>
      {#snippet children({ active })}
        {active + 1}
      {/snippet}
    </NeoStepper>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    width: max(80vw, 30rem);

    :global(.neo-stepper-content-step) {
      width: min(80vw, 40rem);
      height: min(80vh, 40rem);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
