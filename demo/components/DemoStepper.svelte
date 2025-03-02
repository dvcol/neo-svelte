<script lang="ts">
  import { tick } from 'svelte';

  import type { NeoFormContext } from '~/inputs/common/neo-form-context.svelte';
  import type { NeoFormHTMLElement } from '~/inputs/common/neo-form.model';
  import type { NeoStepperEvent, NeoStepperPlacements, NeoStepperProps, NeoStepperStep } from '~/stepper/neo-stepper.model';

  import NeoButton from '~/buttons/NeoButton.svelte';

  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';

  import IconAccount from '~/icons/IconAccount.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';

  import NeoPassword from '~/inputs/NeoPassword.svelte';
  import NeoPin from '~/inputs/NeoPin.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoTextarea from '~/inputs/NeoTextarea.svelte';
  import NeoForm from '~/inputs/common/NeoForm.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoStepper from '~/stepper/NeoStepper.svelte';
  import { NeoStepperPlacement } from '~/stepper/neo-stepper.model';
  import { DefaultShadowShallowElevation } from '~/utils/shadow.utils';

  let context = $state<NeoFormContext>();
  let ref = $state<NeoFormHTMLElement>();
  const step1Value = $state({ username: '', password: '' });

  const steps: NeoStepperStep[] = [
    {
      markProps: {
        label: 'Account',
        ariaLabel: 'Step 1',
        title: 'Step 1',
        icon: account,
      },
      get next() {
        return !!context?.valid;
      },
      render: step1,
      value: step1Value,
      onStep: async (previous, current) => {
        if (!previous || previous < current) return;
        await tick();
        ref?.validate();
        console.info('Step 1: revalidate', context?.fields);
      },
    },
    {
      markProps: {
        label: 'Address',
        ariaLabel: 'Step 2',
        title: 'Step 2',
      },
      render: step2,
    },
    {
      markProps: {
        label: 'Files',
        ariaLabel: 'Step 3',
        title: 'Step 3',
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
    borderless: false,

    vertical: false,
    placement: NeoStepperPlacement.Start,

    onStep: (event: NeoStepperEvent) => {
      console.info('Stepper step:', event);
    },
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
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
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

{#snippet account()}
  <IconAccount />
{/snippet}

{#snippet step1()}
  <div class="form">
    <NeoInput
      bind:value={step1Value.username}
      name="username"
      required
      label="Username"
      autocomplete="username"
      flex="1 0 100%"
      validation="error"
      elevation={options.elevation}
    />
    <NeoPassword
      bind:value={step1Value.password}
      name="password"
      required
      label="Password"
      autocomplete="new-password"
      flex="1 0 100%"
      validation="error"
      elevation={options.elevation}
    />
  </div>
{/snippet}

{#snippet step2()}
  <div class="form">
    <NeoTextarea name="address" label="Address" autocomplete="street-address" resize="none" rows="1" flex="1 0 100%" />
    <NeoInput name="city" label="City" autocomplete="address-level2" flex="1 0 100%" />
    <NeoSelect
      name="country"
      label="Country"
      placeholder="Country"
      autocomplete="country"
      flex="1 0 100%"
      options={[
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'France', value: 'FR' },
        { label: 'Germany', value: 'DE' },
        { label: 'Italy', value: 'IT' },
        { label: 'Spain', value: 'ES' },
        { label: 'Japan', value: 'JP' },
        { label: 'China', value: 'CN' },
        { label: 'Australia', value: 'AU' },
      ]}
    />
    <NeoPin name="zip" label="Zip Code" count="5" autocomplete="postal-code" />
  </div>
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Default</span>
    <NeoForm bind:context bind:ref>
      <NeoStepper {steps} {...options} transitionProps={{ overflow: options.vertical ? 'hidden' : 'initial' }}>
        {#snippet children()}
          <NeoTextarea name="address" label="Address" autocomplete="street-address" resize="none" width="100%" />
        {/snippet}
      </NeoStepper>
    </NeoForm>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.content {
      :global(.neo-stepper-content-step) {
        min-width: min(80vw, 30rem);
        min-height: min(80vh, 30rem);
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
