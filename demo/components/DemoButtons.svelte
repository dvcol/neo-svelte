<script lang="ts">
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import { link } from '@dvcol/svelte-simple-router';

  import { NeoFlatButton, NeoRaisedButton, NeoTextButton } from '~/buttons/neo-button.model.js';
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoCheckboxButton from '~/buttons/NeoCheckboxButton.svelte';
  import NeoRadioButton from '~/buttons/NeoRadioButton.svelte';
  import NeoSwitchButton from '~/buttons/NeoSwitchButton.svelte';
  import NeoIconAccount from '~/icons/NeoIconAccount.svelte';
  import { displayValue } from '~/inputs/neo-select.model';
  import NeoSelect from '~/inputs/NeoSelect.svelte';

  import { Path } from '../router/routes.js';
  import { colorOptions } from '../utils/color.utils';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';
  import { useButtonState } from '../utils/use-button-state.svelte';

  const { onClick, loading: isLoading, onLoading } = useButtonState('DemoButtonClick');

  const options = $state<NeoButtonProps>({
    disabled: false,
    readonly: false,
    skeleton: false,
    loading: false,
    glass: false,
    tinted: false,
    color: '',
  });

  const loading = $derived.by(() => isLoading() || options.loading);

  const columns = [
    { label: 'Default' },
    { label: 'Rounded', props: { rounded: true } },
    { label: 'Flat', props: NeoFlatButton },
    { label: 'Text', props: NeoTextButton },
    { label: 'Raise', props: NeoRaisedButton },
  ];

// TODO : button group
  // TODO : select for hover, active, elevation
  // TODO - support override
</script>

{#snippet icon()}
  <NeoIconAccount />
{/snippet}

{#snippet buttons(opts: NeoButtonProps = {})}
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} onclick={onClick} href={`${Path.ButtonGroups}`} use={link}>Anchor</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} onclick={onClick}>Button</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} toggle onclick={onClick}>Toggle</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} disabled onclick={onClick}>Disabled</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} {loading} onclick={onLoading}>Loading</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} {loading} onclick={onLoading} {icon} />
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} onclick={onClick} {icon}>Icon</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} reverse onclick={onClick} {icon}>Reversed</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} {loading} pulse onclick={onLoading}>Pulse</NeoButton>
  </SphereBackdrop>
  <SphereBackdrop glass={options.glass}>
    <NeoButton {...opts} {...options} coalesce onclick={onClick}>Coalesce</NeoButton>
  </SphereBackdrop>
{/snippet}

<div class="row">
  <NeoButtonGroup text rounded active="-2">
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.readonly}>Readonly</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
  </NeoButtonGroup>

  <NeoSelect
    rounded
    glass
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

<section>
  <div class="row">
    {#each columns as { label, props } (label)}
      <div class="column content">
        <span class="label">{label}</span>
        {@render buttons(props)}
      </div>
    {/each}
    <div class="column">
      <span class="label">Checkbox</span>
      <SphereBackdrop glass={options.glass}>
        <NeoCheckboxButton indeterminate {...options} />
      </SphereBackdrop>
      <span class="label">Radio</span>
      <SphereBackdrop glass={options.glass}>
        <NeoRadioButton {...options} />
      </SphereBackdrop>
      <span class="label">Switch</span>
      <SphereBackdrop glass={options.glass}>
        <NeoSwitchButton indeterminate {...options} />
      </SphereBackdrop>
    </div>
    <div class="column">
      <span class="label">Checkbox</span>
      <SphereBackdrop glass={options.glass}>
        <NeoCheckboxButton elevation="0" indeterminate {...options} />
      </SphereBackdrop>
      <span class="label">Radio</span>
      <SphereBackdrop glass={options.glass}>
        <NeoRadioButton elevation="0" {...options} />
      </SphereBackdrop>
      <span class="label">Switch</span>
      <SphereBackdrop glass={options.glass}>
        <NeoSwitchButton elevation="0" indeterminate {...options} />
      </SphereBackdrop>
    </div>
  </div>
</section>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  section {
    flex: 1 1 100%;
    align-content: center;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg));

    &.content {
      align-self: flex-start;
      justify-content: space-between;
    }
  }

  .row {
    @include flex.row($gap: var(--neo-gap-xl), $flex: 0 1 auto);

    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }

  @media (width > 1550px) {
    .column {
      @include flex.row($gap: var(--neo-gap-lg));

      &.content {
        width: 100%;
      }
    }

    .row {
      @include flex.column($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);
    }

    .label {
      min-width: 4.5rem;
    }
  }
</style>
