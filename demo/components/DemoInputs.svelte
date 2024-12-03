<script lang="ts">
  import { fade } from 'svelte/transition';

  import DemoElevationPicker from '../utils/DemoElevationPicker.svelte';
  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import type { NeoInputProps } from '~/inputs/neo-input.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconSearch from '~/icons/IconSearch.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoPassword from '~/inputs/NeoPassword.svelte';
  import NeoPin from '~/inputs/NeoPin.svelte';
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
    value = $state<string | number>('');

    constructor({
      touched = false,
      dirty = false,
      valid = undefined,
      value = '',
    }: {
      touched?: boolean;
      dirty?: boolean;
      valid?: boolean;
      value?: string | number;
    } = {}) {
      this.touched = touched;
      this.dirty = dirty;
      this.valid = valid;
      this.value = value;
    }

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
    pressed: false,
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

  const numberState = new ValidationState({ value: 0 });

  const pinState = new ValidationState();
  const pinStateSeparator = new ValidationState();
  const pinPasswordState = new ValidationState();

  const onClear = () => {
    validation.clear();
    validState.clear();
    invalidState.clear();
    customState.clear();

    numberState.clear();

    pinState.clear();
    pinStateSeparator.clear();
    pinPasswordState.clear();
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
        before,
      },
      state: validation,
      input: true,
    },
    {
      label: 'Suffix',
      props: {
        placeholder: 'Placeholder',
        after,
        afterProps: { onclick },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Text',
      props: {
        placeholder: 'Placeholder',
        after: text,
        before: text,
        afterProps: { onclick },
      },
      state: validation,
      input: true,
    },

    {
      label: 'Inside',
      props: {
        label: 'Inside',
        placeholder: 'Placeholder',
        after,
        afterProps: { onclick },
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
        after,
        before,
        afterProps: { onclick },
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Left',
      props: {
        after,
        before,
        afterProps: { onclick },
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
        after,
        before,
        afterProps: { onclick },
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
        afterProps: { onclick },
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
        after,
        afterProps: { onclick },
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
        after,
        afterProps: { onclick },
        autoResize: { min: 3, max: 10 },
      },
      state: validation,
      textarea: true,
    },
  ];

  const validationColumns: ColumProps[] = [
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
    <NeoButton toggle bind:checked={options.pressed}>Pressed</NeoButton>
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

{#snippet before()}
  <IconSearch style="min-width: 1.25rem; min-height:1.25rem" />
{/snippet}

{#snippet after()}
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

{#snippet validationState({ touched, dirty, valid, value }: ValidationState, show = false)}
  <div class="row">
    <div class="label">Touched: {touched}</div>
    <div class="label">Dirty: {dirty}</div>
    <div class="label">Valid: {valid}</div>
    {#if show}
      <div class="label">Value: {value}</div>
    {/if}
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
</form>

<!--  Password  -->
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
        <NeoPassword label="Password" autocomplete="current-password" {...options} />
      </SphereBackdrop>
    {:else}
      <NeoPassword in={fade} label="Password" autocomplete="current-password" {...options} />
    {/if}
  </div>
</div>

<!-- Number inputs -->
<div class="row">
  <div class="column content">
    <span class="label">Number</span>
    {@render validationState(numberState)}
    {#if options.glass}
      <SphereBackdrop>
        <NeoNumberStep
          bind:touched={numberState.touched}
          bind:dirty={numberState.dirty}
          bind:valid={numberState.valid}
          bind:value={numberState.value}
          {...options}
        />
      </SphereBackdrop>
    {:else}
      <NeoNumberStep
        bind:touched={numberState.touched}
        bind:dirty={numberState.dirty}
        bind:valid={numberState.valid}
        bind:value={numberState.value}
        {...options}
      />
    {/if}
  </div>

  <div class="column content">
    <span class="label">Min Max</span>
    {@render validationState(numberState)}
    {#if options.glass}
      <SphereBackdrop>
        <NeoNumberStep
          bind:touched={numberState.touched}
          bind:dirty={numberState.dirty}
          bind:valid={numberState.valid}
          bind:value={numberState.value}
          min="-5"
          max="5"
          {...options}
        />
      </SphereBackdrop>
    {:else}
      <NeoNumberStep
        bind:touched={numberState.touched}
        bind:dirty={numberState.dirty}
        bind:valid={numberState.valid}
        bind:value={numberState.value}
        min="-5"
        max="5"
        {...options}
      />
    {/if}
  </div>
</div>

<!-- Number inputs -->
<div class="row">
  <div class="column content">
    <span class="label">Pin</span>
    {@render validationState(pinState, true)}
    {#if options.glass}
      <SphereBackdrop>
        <NeoPin bind:touched={pinState.touched} bind:dirty={pinState.dirty} bind:valid={pinState.valid} bind:value={pinState.value} {...options} />
      </SphereBackdrop>
    {:else}
      <NeoPin bind:touched={pinState.touched} bind:dirty={pinState.dirty} bind:valid={pinState.valid} bind:value={pinState.value} {...options} />
    {/if}
  </div>

  <div class="column content">
    <span class="label">Pin Groups</span>
    {@render validationState(pinStateSeparator, true)}
    {#if options.glass}
      <SphereBackdrop>
        <NeoPin
          groups={2}
          bind:touched={pinStateSeparator.touched}
          bind:dirty={pinStateSeparator.dirty}
          bind:valid={pinStateSeparator.valid}
          bind:value={pinStateSeparator.value}
          {...options}
        />
      </SphereBackdrop>
    {:else}
      <NeoPin
        groups={2}
        required
        validation
        bind:touched={pinStateSeparator.touched}
        bind:dirty={pinStateSeparator.dirty}
        bind:valid={pinStateSeparator.valid}
        bind:value={pinStateSeparator.value}
        {...options}
      />
    {/if}
  </div>

  <div class="column content">
    <span class="label">Pin Password</span>
    {@render validationState(pinPasswordState, true)}
    {#if options.glass}
      <SphereBackdrop>
        <NeoPin
          bind:touched={pinPasswordState.touched}
          bind:dirty={pinPasswordState.dirty}
          bind:valid={pinPasswordState.valid}
          bind:value={pinPasswordState.value}
          type="password"
          {...options}
        />
      </SphereBackdrop>
    {:else}
      <NeoPin
        bind:touched={pinPasswordState.touched}
        bind:dirty={pinPasswordState.dirty}
        bind:valid={pinPasswordState.valid}
        bind:value={pinPasswordState.value}
        type="password"
        {...options}
      />
    {/if}
  </div>
</div>

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

      :global(.sphere),
      :global(.neo-validation-group-wrapper),
      :global(.neo-pin-container) {
        justify-content: center;
        width: 100%;
        text-align: center;
        container-type: inline-size;
      }

      :global(.neo-pin-separator) {
        @container (width > 460px) {
          width: 100%;
        }
      }
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }

  @media (width < 1500px) {
    .column.content {
      flex: 1 0 40%;
      max-width: 50%;
    }
  }
</style>
