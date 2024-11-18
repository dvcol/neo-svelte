<script lang="ts">
  import DemoElevationPicker from '../utils/DemoElevationPicker.svelte';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoInputProps } from '~/input/neo-input.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconSearch from '~/icons/IconSearch.svelte';
  import NeoInput from '~/input/NeoInput.svelte';

  type ColumProps = NeoInputProps;

  const options = $state<ColumProps>({
    borderless: false,
    rounded: false,
    glass: false,
    loading: false,
    skeleton: false,
    elevation: 2,
    hover: -1,
  });

  const onElevation = (value: number) => {
    const halfStep = (value > 0 && [-1, -0.5, 0, 0.5].includes(options.elevation)) || (value < 0 && [-0.5, 0, 0.5, 1].includes(options.elevation));
    options.elevation += halfStep ? Math.sign(value) * 0.5 : value;
    if (options.elevation + options.hover < -4) options.hover += 1;
    if (options.elevation + options.hover > 4) options.hover -= 1;
  };

  let touched = $state(false);
  let dirty = $state(false);
  let valid = $state(undefined);
  let value = $state('');

  const onClear = () => {
    touched = false;
    dirty = false;
    valid = undefined;
    value = '';
  };

  const columns: { label: string; props?: ColumProps }[] = [
    {
      label: 'Default',
      props: { label: 'Default', placeholder: 'Placeholder' },
    },
    {
      label: 'Prefix',
      props: { label: 'Default', placeholder: 'Prefix', prefix, prefixProps: { onclick: () => alert('Prefix') } },
    },
    {
      label: 'Suffix',
      props: { label: 'Default', placeholder: 'Suffix', suffix },
    },
  ];
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    <NeoButton onclick={onClear}>Clear</NeoButton>
  </NeoButtonGroup>

  <DemoElevationPicker bind:elevation={options.elevation} {onElevation} />
  <DemoElevationPicker
    label="Hover"
    reset={-1}
    min={options.hover + options.elevation <= -4 ? options.hover : undefined}
    max={options.hover + options.elevation >= 4 ? options.hover : undefined}
    bind:elevation={options.hover}
  />
</div>

{#snippet prefix()}
  <IconSearch />
{/snippet}

{#snippet suffix()}
  <IconFileUpload />
{/snippet}

{#snippet input(props: ColumProps)}
  <NeoInput bind:touched bind:dirty bind:valid bind:value {...options} {...props} />
{/snippet}

<div class="row">
  <span class="label">Touched: {touched}</span>
  <span class="label">Dirty: {dirty}</span>
  <span class="label">Valid: {valid}</span>
  <span class="label">Value: {value}</span>
</div>

<div class="row">
  {#each columns as { label, props }}
    <div class="column content">
      <span class="label">{label}</span>
      {#if props?.glass || options.glass}
        <SphereBackdrop>{@render input(props)}</SphereBackdrop>
      {:else}
        {@render input(props)}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
