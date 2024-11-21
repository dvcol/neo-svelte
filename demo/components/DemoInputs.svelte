<script lang="ts">
  import DemoElevationPicker from '../utils/DemoElevationPicker.svelte';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoInputProps } from '~/input/neo-input.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconSearch from '~/icons/IconSearch.svelte';
  import NeoInput from '~/input/NeoInput.svelte';
  import { DefaultShadowElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils';

  type ColumProps = NeoInputProps;

  const options = $state<ColumProps>({
    borderless: false,
    rounded: true,
    glass: false,
    loading: false,
    disabled: false,
    readonly: false,
    skeleton: false,
    elevation: DefaultShadowElevation,
    dirtyOnInput: true,
    validateOnInput: true,
    clearable: true,
    hover: -1,
  });

  const onElevation = () => {
    if (options.elevation + options.hover < MinShadowElevation) options.hover += 1;
    if (options.elevation + options.hover > MaxShadowElevation) options.hover -= 1;
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

  const onclick = (e: MouseEvent) => console.info('suffix click', e);

  const columns: { label: string; props?: ColumProps }[] = [
    {
      label: 'Default',
      props: {
        placeholder: 'Placeholder',
      },
    },
    {
      label: 'Prefix',
      props: {
        placeholder: 'Placeholder',
        prefix,
      },
    },
    {
      label: 'Suffix',
      props: {
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
      },
    },
    {
      label: 'Text',
      props: {
        placeholder: 'Placeholder',
        suffix: text,
        prefix: text,
        suffixProps: { onclick },
      },
    },

    {
      label: 'Floating',
      props: {
        label: 'Floating',
        placeholder: 'Placeholder',
        floating: true,
        prefix,
        suffix,
        suffixProps: { onclick },
      },
    },
    {
      label: 'Label',
      props: {
        label,
        placeholder: 'Placeholder',
        floating: true,
        prefix,
        suffix,
        suffixProps: { onclick },
      },
    },
    {
      label: 'Top',
      props: {
        label: 'Top',
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
      },
    },
    {
      label: 'Left',
      props: {
        label: 'Left',
        placeholder: 'Placeholder',
      },
    },
    {
      label: 'Right',
      props: {
        label: 'Right',
        placeholder: 'Placeholder',
      },
    },
    {
      label: 'Message',
      props: {
        label: 'Message',
        placeholder: 'Placeholder',
      },
    },
    {
      label: 'Valid',
      props: {
        label: 'Validation',
        placeholder: 'Placeholder',
      },
    },
    {
      label: 'Invalid',
      props: {
        label: 'Validation',
        placeholder: 'Placeholder',
      },
    },
  ];
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.clearable}>Clearable</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.readonly}>Readonly</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    <NeoButton onclick={onClear}>Clear</NeoButton>
  </NeoButtonGroup>

  <DemoElevationPicker bind:elevation={options.elevation} {onElevation} />
  <DemoElevationPicker
    label="Hover"
    reset={-1}
    min={MinShadowElevation - options.elevation}
    max={MaxShadowElevation - options.elevation}
    bind:elevation={options.hover}
  />
</div>

{#snippet label()}
  <div>
    <div style="color: lightseagreen">Custom snippet label</div>
  </div>
{/snippet}

{#snippet text()}
  <span class="label">TEXT</span>
{/snippet}

{#snippet prefix()}
  <IconSearch style="min-width: 1.25rem; min-height:1.25rem" />
{/snippet}

{#snippet suffix()}
  <IconFileUpload style="min-width: 1.25rem; min-height:1.25rem" />
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
  {#each columns as column}
    <div class="column content">
      <span class="label">{column.label}</span>
      {#if column.props?.glass || options.glass}
        <SphereBackdrop>{@render input(column.props)}</SphereBackdrop>
      {:else}
        {@render input(column.props)}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    &.content {
      flex: 1 0 20%;
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
