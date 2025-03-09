<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import type { NeoStepperEvent, NeoStepperNavigations, NeoStepperPlacements, NeoStepperProps, NeoStepperStep } from '~/stepper/neo-stepper.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';

  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';

  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoForm from '~/form/NeoForm.svelte';
  import IconAccount from '~/icons/IconAccount.svelte';
  import IconAddress from '~/icons/IconAddress.svelte';
  import IconListSmall from '~/icons/IconListSmall.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';

  import NeoPassword from '~/inputs/NeoPassword.svelte';
  import NeoPin from '~/inputs/NeoPin.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoStepper from '~/stepper/NeoStepper.svelte';
  import { NeoStepperPlacement } from '~/stepper/neo-stepper.model';
  import { DefaultShadowShallowElevation } from '~/utils/shadow.utils';

  let active = $state(0);
  const step1Value = $state({ username: '', password: '' });
  const step2Value = $state({ address: '', city: '', country: '', zip: '' });

  const steps: NeoStepperStep[] = [
    {
      markProps: {
        label: 'Account',
        ariaLabel: 'Step 1',
        title: 'Step 1',
        icon: account,
      },
      get next() {
        return !!(step1Value.username && step1Value.password);
      },
      render: step1,
      value: step1Value,
    },
    {
      markProps: {
        label: 'Address',
        ariaLabel: 'Step 2',
        title: 'Step 2',
        icon: address,
      },
      render: step2,
      value: step2Value,
      onBeforeStep: async (event: NeoStepperEvent, reason?: NeoStepperNavigations) => {
        if (reason === 'next') await wait(1000);
        console.info('Stepper before step:', event, reason);
      },
    },
    {
      markProps: {
        label: 'Summary',
        ariaLabel: 'Step 3',
        title: 'Step 3',
        icon: summary,
      },
      render: step3,
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
    rounded: true,

    vertical: false,
    placement: NeoStepperPlacement.Start,
    onStep: async (event: NeoStepperEvent, reason?: NeoStepperNavigations) => {
      console.info('Stepper step:', event, reason);
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
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
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
    rounded
  />
</div>

{#snippet account()}
  <IconAccount filled={active === 0} />
{/snippet}

{#snippet address()}
  <IconAddress filled={active === 1} repeat="1" dot="var(--neo-background-color)" />
{/snippet}

{#snippet summary()}
  <IconListSmall filled={active === 2} />
{/snippet}

{#snippet step1()}
  <div class="form">
    <NeoInput
      bind:value={step1Value.username}
      name="username"
      required
      label="Username"
      autocomplete="username"
      validation="error"
      elevation={options.elevation}
      rounded={options.rounded}
    />
    <NeoPassword
      bind:value={step1Value.password}
      name="password"
      required
      label="Password"
      autocomplete="new-password"
      validation="error"
      elevation={options.elevation}
      rounded={options.rounded}
    />
  </div>
{/snippet}

{#snippet step2()}
  <div class="form">
    <NeoTextarea
      bind:value={step2Value.address}
      name="address"
      label="Address"
      autocomplete="street-address"
      resize="none"
      rows="1"
      elevation={options.elevation}
      rounded={options.rounded}
    />
    <NeoInput
      bind:value={step2Value.city}
      name="city"
      label="City"
      autocomplete="address-level2"
      elevation={options.elevation}
      rounded={options.rounded}
    />
    <NeoSelect
      bind:value={step2Value.country}
      name="country"
      label="Country"
      placeholder="Country"
      autocomplete="country"
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
      elevation={options.elevation}
      rounded={options.rounded}
    />
    <NeoPin
      bind:value={step2Value.zip}
      name="zip"
      label="Zip Code"
      count="5"
      autocomplete="postal-code"
      elevation={options.elevation}
      rounded={options.rounded}
    />
  </div>
{/snippet}

{#snippet step3()}
  <div class="form">
    <NeoInput elevation="0" hover="0" label="Username" value={step1Value.username} readonly rounded={options.rounded} />
    <NeoTextarea
      elevation="0"
      hover="0"
      resize="none"
      label="Address"
      value={[step2Value.address, [step2Value.city, step2Value.zip, step2Value.country].filter(Boolean).join(', ')].filter(Boolean).join('\n')}
      readonly
      rounded={options.rounded}
    />
  </div>
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Default</span>
    <NeoCard rounded elevation={-options.elevation}>
      <NeoForm>
        <NeoStepper bind:active {steps} {...options}>
          {#snippet children()}
            <span>Error: Unknown Step !</span>
          {/snippet}
        </NeoStepper>
      </NeoForm>
    </NeoCard>
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
    width: clamp(22rem, 22rem, 80vw);
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.content {
      :global(.neo-stepper-content-step) {
        min-width: clamp(25rem, 80vw, 30rem);
        min-height: clamp(25rem, 80vh, 30rem);
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
