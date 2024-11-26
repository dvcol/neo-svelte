<script lang="ts">
  import DemoElevationPicker from '../utils/DemoElevationPicker.svelte';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoInputProps } from '~/inputs/neo-input.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconSearch from '~/icons/IconSearch.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import NeoPassword from '~/inputs/NeoPassword.svelte';
  import NeoTextArea from '~/inputs/NeoTextarea.svelte';
  import { DefaultShadowElevation, MaxShadowElevation, MinShadowElevation } from '~/utils/shadow.utils';

  type ColumProps = {
    label: string;
    props?: NeoInputProps;
    state: ValidationState;
    textarea?: boolean;
    input?: boolean;
  };

  class ValidationState {
    touched = $state(false);
    dirty = $state(false);
    valid = $state(undefined);
    value = $state('');

    clear() {
      this.touched = false;
      this.dirty = false;
      this.valid = undefined;
      this.value = '';
    }
  }

  const options = $state<NeoInputProps>({
    borderless: false,
    rounded: false,
    glass: false,
    loading: false,
    disabled: false,
    readonly: false,
    skeleton: false,
    floating: true,
    elevation: DefaultShadowElevation,
    dirtyOnInput: false,
    validateOnInput: false,
    clearable: false,
    hover: -1,
    size: 30,
  });

  const onElevation = () => {
    if (options.elevation + options.hover < MinShadowElevation) options.hover += 1;
    if (options.elevation + options.hover > MaxShadowElevation) options.hover -= 1;
  };

  const validation = new ValidationState();
  const validState = new ValidationState();
  const invalidState = new ValidationState();
  const customState = new ValidationState();

  const onClear = () => {
    validation.clear();
    validState.clear();
    invalidState.clear();
  };

  const onclick = (e: MouseEvent) => console.info('suffix click', e);

  const columns: ColumProps[] = [
    {
      label: 'Default',
      props: {
        placeholder: 'Placeholder',
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Prefix',
      props: {
        placeholder: 'Placeholder',
        prefix,
      },
      state: validation,
      input: true,
    },
    {
      label: 'Suffix',
      props: {
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Text',
      props: {
        placeholder: 'Placeholder',
        suffix: text,
        prefix: text,
        suffixProps: { onclick },
      },
      state: validation,
      input: true,
    },

    {
      label: 'Inside',
      props: {
        label: 'Inside',
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Top',
      props: {
        label: 'Top',
        position: 'top',
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Left',
      props: {
        label: 'Left',
        position: 'left',
        placeholder: 'Placeholder',
        containerProps: { style: 'margin-left: 4rem;' },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Right',
      props: {
        label: 'Right',
        position: 'right',
        placeholder: 'Placeholder',
        containerProps: { style: 'margin-right: 4rem;' },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Custom Label',
      props: {
        label,
        placeholder: 'Placeholder',
        suffixProps: { onclick },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Message',
      props: {
        label: 'Description',
        position: 'top',
        placeholder: 'Placeholder',
        message: 'This is a short description.',
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Minimum 5',
      props: {
        label: 'Minimum',
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
        autoResize: { min: 5 },
      },
      state: validation,
      textarea: true,
    },
    {
      label: 'Maximum 10',
      props: {
        label: 'Maximum',
        placeholder: 'Placeholder',
        suffix,
        suffixProps: { onclick },
        autoResize: { min: 3, max: 10 },
      },
      state: validation,
      textarea: true,
    },
  ];

  const validationColumns: { label: string; props?: ColumProps; state: ValidationState }[] = [
    {
      label: 'Custom Error',
      props: {
        label: 'Required',
        required: true,
        minLength: 5,
        placeholder: 'Placeholder',
        error: 'Custom error: min length 5',
      },
      state: customState,
      textarea: true,
      input: true,
    },
    {
      label: 'Valid',
      props: {
        label: 'No Restrictions',
        placeholder: 'Placeholder',
        validation: true,
        wrapperProps: { style: 'max-width: 20.5rem' },
      },
      state: validState,
      textarea: true,
      input: true,
    },
    {
      label: 'Invalid',
      props: {
        label: 'Required',
        required: true,
        minLength: 5,
        placeholder: 'Placeholder',
        validation: true,
        wrapperProps: { style: 'max-width: 20.5rem' },
      },
      state: invalidState,
      textarea: true,
      input: true,
    },
  ];
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.floating}>Floating</NeoButton>
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
  <div style="color: var(--neo-color-primary)">Custom snippet label</div>
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

{#snippet input({ props, state: _state, textarea: _textarea, input: _input }: ColumProps)}
  {#if _input}
    <NeoInput bind:touched={_state.touched} bind:dirty={_state.dirty} bind:valid={_state.valid} bind:value={_state.value} {...options} {...props} />
  {/if}
  {#if _textarea}
    <NeoTextArea
      bind:touched={_state.touched}
      bind:dirty={_state.dirty}
      bind:valid={_state.valid}
      bind:value={_state.value}
      {...options}
      {...props}
    />
  {/if}
{/snippet}

{#snippet group(column: ColumProps)}
  {#if column.props?.glass || options.glass}
    <SphereBackdrop>{@render input(column)}</SphereBackdrop>
  {:else}
    <div class="wrapper">
      {@render input(column)}
    </div>
  {/if}
{/snippet}

{#snippet validationState({ touched, dirty, valid }: ValidationState)}
  <div class="row">
    <div class="label">Touched: {touched}</div>
    <div class="label">Dirty: {dirty}</div>
    <div class="label">Valid: {valid}</div>
  </div>
{/snippet}

{@render validationState(validation)}

<form>
  <div class="row">
    {#each columns as column}
      <div class="column content">
        <span class="label">{column.label}</span>
        {@render group(column)}
      </div>
    {/each}
  </div>

  <div class="row">
    {#each validationColumns as column}
      <div class="column content">
        <span class="label">{column.label}</span>
        {@render validationState(column.state)}
        {@render group(column)}
      </div>
    {/each}
  </div>

  <div class="row">
    <div class="column content">
      <span class="label">Password</span>
      {#if options.glass}
        <SphereBackdrop>
          <NeoPassword label="Password" auto-complete="current-password" {...options} />
        </SphereBackdrop>
      {:else}
        <NeoPassword label="Password" auto-complete="current-password" {...options} />
      {/if}
    </div>
  </div>
</form>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    &.content {
      flex: 1 0 20%;
      max-width: 25%;
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }

  @media (width < 1400px) {
    .column.content {
      flex: 1 0 40%;
      max-width: 50%;
    }
  }
</style>
