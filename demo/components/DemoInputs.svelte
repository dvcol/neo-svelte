<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import SphereBackdrop from '../utils/SphereBackdrop.svelte';

  import { colorOptions } from '../utils/color.utils';

  import type { NeoInputProps, NeoInputState } from '~/inputs/common/neo-input.model.js';
  import type { NeoDateTimeProps } from '~/inputs/neo-date-time.model.js';
  import type { NeoFilePickerProps } from '~/inputs/neo-file-picker.model.js';
  import type { NeoRangeHTMLElement } from '~/inputs/neo-range.model.js';
  import type { NeoNativeSelectOption } from '~/inputs/neo-select.model.js';
  import type { NeoListItem } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoForm from '~/form/NeoForm.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconFileUpload from '~/icons/IconFileUpload.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import IconSearch from '~/icons/IconSearch.svelte';
  import NeoCheckbox from '~/inputs/NeoCheckbox.svelte';
  import NeoColorPicker from '~/inputs/NeoColorPicker.svelte';
  import NeoDateTime from '~/inputs/NeoDateTime.svelte';
  import NeoFilePicker from '~/inputs/NeoFilePicker.svelte';
  import NeoNativeSelect from '~/inputs/NeoNativeSelect.svelte';
  import NeoNumberStep from '~/inputs/NeoNumberStep.svelte';
  import NeoPassword from '~/inputs/NeoPassword.svelte';
  import NeoPin from '~/inputs/NeoPin.svelte';
  import NeoRadio from '~/inputs/NeoRadio.svelte';
  import NeoRange from '~/inputs/NeoRange.svelte';
  import NeoSelect from '~/inputs/NeoSelect.svelte';
  import NeoSwitch from '~/inputs/NeoSwitch.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoTextArea from '~/inputs/common/NeoTextarea.svelte';
  import { displayValue } from '~/inputs/neo-select.model.js';
  import NeoPill from '~/pill/NeoPill.svelte';
  import {
    DefaultShadowElevation,
    DefaultShadowHoverElevation,
    getDefaultElevation,
    getDefaultHoverElevation,
    MaxShadowElevation,
    MinShadowElevation,
  } from '~/utils/shadow.utils.js';
  import { quickCircOutProps, quickDurationProps } from '~/utils/transition.utils';

  type ColumProps<T = NeoInputProps> = {
    label: string;
    props?: T;
    state: ValidationState;
    textarea?: boolean;
    input?: boolean;
  };

  type InputState = Pick<NeoInputProps, 'type' | 'touched' | 'dirty' | 'valid' | 'value' | 'group' | 'checked' | 'indeterminate' | 'files'>;

  class ValidationState<T extends HTMLElement = HTMLElement> implements InputState {
    ref = $state<T>();
    type = $state<string>('text');
    touched = $state<boolean>(false);
    dirty = $state<boolean>(false);
    valid = $state<boolean>();
    value = $state<any>();
    group = $state<any | any[]>();
    checked = $state<boolean>(false);
    indeterminate = $state<boolean>(false);
    files = $state<FileList>();

    constructor({ type, touched = false, dirty = false, valid, value = '', group, checked, indeterminate, files }: Partial<InputState> = {}) {
      this.type = type;
      this.touched = touched;
      this.dirty = dirty;
      this.valid = valid;
      this.value = value;
      this.group = group;
      this.checked = checked ?? false;
      this.indeterminate = indeterminate ?? false;
      this.files = files;
    }

    clear() {
      this.touched = false;
      this.dirty = false;
      this.valid = undefined;
      this.value = '';
      this.group = '';
      this.checked = false;
      this.indeterminate = false;
      this.files = undefined;
    }
  }

  const options = $state<NeoInputProps>({
    borderless: false,
    rounded: false,
    pressed: false,
    glass: false,
    tinted: false,
    color: '',
    loading: false,
    disabled: false,
    readonly: false,
    skeleton: false,
    floating: true,
    elevation: DefaultShadowElevation,
    dirtyOnInput: false,
    validateOnInput: false,
    clearable: false,
    nullable: true,
    hover: -1,
    size: 30,
    onchange: (...args: any[]) => console.info('change', ...args),
    oninput: (...args: any[]) => console.info('input', ...args),
  });

  const onPressed = () => {
    options.elevation = getDefaultElevation(options.pressed);
    options.hover = getDefaultHoverElevation(options.pressed);
  };

  const onElevation = () => {
    if (options.elevation + options.hover < MinShadowElevation) options.hover += 1;
    if (options.elevation + options.hover > MaxShadowElevation) options.hover -= 1;
  };

  const validation = new ValidationState();
  const validState = new ValidationState();
  const invalidState = new ValidationState();
  const customState = new ValidationState();

  const selectState = new ValidationState<HTMLSelectElement>();
  const selectMultipleState = new ValidationState<HTMLSelectElement>();
  const selectCustomState = new ValidationState<HTMLSelectElement>();
  const selectCustomMultipleState = new ValidationState<HTMLSelectElement>();

  const numberState = new ValidationState({ type: 'number', value: 0 });

  const pinState = new ValidationState();
  const pinStateSeparator = new ValidationState();
  const pinPasswordState = new ValidationState();

  const colorState = new ValidationState({ type: 'color' });

  const fileState = new ValidationState({ type: 'file' });
  const multipleFileState = new ValidationState({ type: 'file' });
  const expandedFileState = new ValidationState({ type: 'file' });

  const checkboxState = new ValidationState({ type: 'checkbox', indeterminate: true });
  const checkboxGroupState = new ValidationState({ type: 'checkbox' });

  const radioState = new ValidationState({ type: 'radio' });

  const switchState = new ValidationState({ type: 'checkbox' });
  const switchGroupState = new ValidationState({ type: 'checkbox' });

  const rangeState = new ValidationState<NeoRangeHTMLElement>({ type: 'range', value: 0 });
  const rangeArrayState = new ValidationState({ type: 'range', value: [25, 75] });
  const rangeMinMaxState = new ValidationState({ type: 'range', value: [-100, 100] });
  const rangeSteppedState = new ValidationState({ type: 'range', value: 50 });

  const onClear = () =>
    [
      validation,
      validState,
      invalidState,
      customState,

      selectState,
      selectMultipleState,
      selectCustomState,
      selectCustomMultipleState,

      numberState,

      pinState,
      pinStateSeparator,
      pinPasswordState,

      colorState,

      fileState,
      multipleFileState,
      expandedFileState,

      checkboxState,
      checkboxGroupState,

      radioState,

      switchState,
      switchGroupState,

      rangeState,
      rangeArrayState,
      rangeMinMaxState,
      rangeSteppedState,
    ].forEach(state => state.clear());

  const columns: ColumProps[] = [
    {
      label: 'Default',
      props: {
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        name: 'default',
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Prefix',
      props: {
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        before,
        name: 'prefix',
      },
      state: validation,
      input: true,
    },
    {
      label: 'Suffix',
      props: {
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        after,
        name: 'suffix',
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Text',
      props: {
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        after: text,
        before: text,
        name: 'text',
      },
      state: validation,
      input: true,
    },

    {
      label: 'Inside',
      props: {
        label: 'Inside',
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        after,
        name: 'inside',
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Top',
      props: {
        label: 'Top',
        placement: 'top',
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        after,
        before,
        name: 'top',
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

        label: 'Left',
        placement: 'left',
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        containerProps: { style: 'margin-left: 4rem;' },
        name: 'left',
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

        label: 'Right',
        placement: 'right',
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        containerProps: { style: 'margin-right: 4rem;' },
        name: 'right',
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
        defaultValue: 'Fallback',
        name: 'custom',
      },
      state: validation,
      textarea: true,
      input: true,
    },
    {
      label: 'Message',
      props: {
        label: 'Description',
        placement: 'top',
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        message: 'This is a short description.',
        name: 'message',
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
        defaultValue: 'Fallback',
        after,

        autoResize: { min: 5 },
        name: 'minimum',
      },
      state: validation,
      textarea: true,
    },
    {
      label: 'Maximum 10',
      props: {
        label: 'Maximum',
        placeholder: 'Placeholder',
        defaultValue: 'Fallback',
        after,

        autoResize: { min: 3, max: 10 },
        name: 'maximum',
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
        validation: true,
        error: 'Custom error: min length 5',
        message: 'This is only visible when valid or untouched.',
        name: 'custom-error',
      },
      state: customState,
      textarea: true,
      input: true,
    },
    {
      label: 'Only Valid',
      props: {
        label: 'No Restrictions',
        placeholder: 'Placeholder',
        required: true,
        validation: 'success',
        wrapperProps: { style: 'max-width: 20.5rem' },
        name: 'valid',
      },
      state: validState,
      textarea: true,
      input: true,
    },
    {
      label: 'Only Invalid',
      props: {
        label: 'Required',
        required: true,
        minLength: 5,
        placeholder: 'Placeholder',
        validation: 'error',
        wrapperProps: { style: 'max-width: 20.5rem' },
        message: 'This is only visible when valid or untouched.',
        name: 'invalid',
      },
      state: invalidState,
      textarea: true,
      input: true,
    },
  ];

  // ['date', 'datetime-local', 'time', 'week', 'month']
  const dateColumns: ColumProps<NeoDateTimeProps>[] = [
    {
      label: 'Date',
      props: {
        label: 'Date Picker',
        type: 'date',
        required: true,
      },
      state: new ValidationState(),
      input: true,
    },
    {
      label: 'Date Time',
      props: {
        label: 'Date Time Picker',
        type: 'datetime-local',
        required: true,
      },
      state: new ValidationState(),
      input: true,
    },
    {
      label: 'Time',
      props: {
        label: 'Time Picker',
        type: 'time',
        required: true,
      },
      state: new ValidationState(),
      input: true,
    },
    {
      label: 'Week',
      props: {
        label: 'Week Picker',
        type: 'week',
        required: true,
      },
      state: new ValidationState(),
      input: true,
    },
    {
      label: 'Month',
      props: {
        label: 'Month Picker',
        type: 'month',
        required: true,
      },
      state: new ValidationState(),
      input: true,
    },
  ];

  const fileColumns: ColumProps<NeoFilePickerProps>[] = [
    {
      label: 'File',
      props: {
        label: 'File Picker',
        type: 'file',
        required: true,
        validation: true,
      },
      state: fileState,
      input: true,
    },
    {
      label: 'Multiple File',
      props: {
        label: 'Multiple File',
        type: 'file',
        required: true,
        validation: true,
        multiple: true,
      },
      state: multipleFileState,
      input: true,
    },
    {
      label: 'Expanded Picker',
      props: {
        label: 'Drag & Drop',
        type: 'file',
        required: true,
        validation: true,
        multiple: true,
        expanded: true,
        append: true,
        drop: true,
        width: 'min(25rem, 100%)',
      },
      state: expandedFileState,
      input: true,
    },
  ];

  const nativeSelectOptions: NeoNativeSelectOption[] = [
    { value: 'value 1', label: 'Label for value 1' },
    { value: 'value 2', label: 'Label for value 2' },
    'value 3',
  ];

  const items: NeoListItem = [
    { value: 'value 1', label: 'Label for value 1' },
    { value: 'value 2', label: 'Label for value 2' },
    { value: 'value 3', label: 'Label for value 3', disabled: true },
    { value: 'value 4', label: 'Label for value 4' },
  ];
</script>

<div class="row">
  <NeoButtonGroup rounded={options.rounded}>
    <NeoButton toggle bind:checked={options.borderless}>Borderless</NeoButton>
    <NeoButton toggle bind:checked={options.pressed} onclick={onPressed}>Pressed</NeoButton>
    <NeoButton toggle bind:checked={options.rounded}>Rounded</NeoButton>
    <NeoButton toggle bind:checked={options.glass}>Glass</NeoButton>
    <NeoButton toggle bind:checked={options.tinted}>Tinted</NeoButton>
    <NeoButton toggle bind:checked={options.floating}>Floating</NeoButton>
    <NeoButton toggle bind:checked={options.loading}>Loading</NeoButton>
    <NeoButton toggle bind:checked={options.clearable}>Clearable</NeoButton>
    <NeoButton toggle bind:checked={options.nullable}>Nullable</NeoButton>
    <NeoButton toggle bind:checked={options.disabled}>Disabled</NeoButton>
    <NeoButton toggle bind:checked={options.readonly}>Readonly</NeoButton>
    <NeoButton toggle bind:checked={options.skeleton}>Skeleton</NeoButton>
    <NeoButton onclick={onClear}>Clear</NeoButton>
  </NeoButtonGroup>

  <NeoNumberStep
    label="Elevation"
    placement="left"
    center
    bind:value={options.elevation}
    min={MinShadowElevation}
    max={MaxShadowElevation}
    defaultValue={DefaultShadowElevation}
    rounded={options.rounded}
    oninput={onElevation}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 6rem' }}
  />
  <NeoNumberStep
    label="Hover"
    placement="left"
    center
    bind:value={options.hover}
    min={MinShadowElevation - options.elevation}
    max={MaxShadowElevation - options.elevation}
    defaultValue={DefaultShadowHoverElevation}
    rounded={options.rounded}
    nullable={false}
    floating={false}
    groupProps={{ style: 'margin-left: 4rem' }}
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

{#snippet label()}
  <div style="color: var(--neo-color-primary)">Custom snippet label</div>
{/snippet}

{#snippet text()}
  <span class="label" style="min-width: 2.625rem">TEXT</span>
{/snippet}

{#snippet before()}
  <IconSearch style="min-width: 1.25rem; min-height:1.25rem" />
{/snippet}

{#snippet after()}
  <NeoButton text aria-label="After button snippet" rounded={options.rounded} disabled={options.disabled} readonly={options.readonly}>
    {#snippet icon()}
      <IconFileUpload style="min-width: 1.25rem; min-height:1.25rem" />
    {/snippet}
  </NeoButton>
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

{#snippet inputGroup(column: ColumProps)}
  <SphereBackdrop glass={column.props?.glass || options.glass}>
    {@render input(column)}
  </SphereBackdrop>
{/snippet}

{#snippet validationState({ type, touched, dirty, valid, value, files, checked, group, indeterminate }: ValidationState, show = false)}
  <div class="row">
    <div class="label">Touched: {touched}</div>
    <div class="label">Dirty: {dirty}</div>
    <div class="label">Valid: {valid}</div>
    {#if show}
      {#if type === 'file'}
        <div class="label">Files: {files?.length}</div>
      {:else if type === 'checkbox'}
        <div class="label">Group: {group}</div>
        <div class="label">Checked: {checked}</div>
        <div class="label">Indeterminate: {indeterminate}</div>
      {:else if type === 'radio'}
        <div class="label">Group: {group}</div>
      {:else}
        <div class="label">Value: {value}</div>
      {/if}
    {/if}
  </div>
{/snippet}

{@render validationState(validation)}

<div class="column">
  <NeoForm legend="Input / Textarea" novalidate>
    <div class="row">
      {#each columns as column}
        <div class="column content">
          <span class="label">{column.label}</span>
          {@render inputGroup(column)}
        </div>
      {/each}
    </div>

    <div class="row">
      {#each validationColumns as column}
        <div class="column content">
          <span class="label">{column.label}</span>
          {@render validationState(column.state)}
          {@render inputGroup(column)}
        </div>
      {/each}
    </div>
  </NeoForm>

  <!--  Select  -->
  <NeoForm legend="Select" novalidate>
    <div class="row">
      <div class="column">
        <span class="label">Native Select</span>
        {@render validationState(selectState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoNativeSelect
            type="select"
            validation
            required
            label="Native Select"
            bind:ref={selectState.ref}
            bind:touched={selectState.touched}
            bind:dirty={selectState.dirty}
            bind:valid={selectState.valid}
            bind:value={selectState.value}
            {...options}
            size={undefined}
          >
            <option value="" selected>Select an option below</option>
            <option value="value 1">Label for value 1</option>
            <option value="value 2">Label for value 2</option>
            <option value="value 3" disabled>Label for value 3</option>
            <option value="value 4">Label for value 4</option>
          </NeoNativeSelect>
        </SphereBackdrop>
      </div>

      <div class="column">
        <span class="label">Native Multiple Select</span>
        {@render validationState(selectMultipleState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoNativeSelect
            type="select"
            validation
            required
            multiple
            label="Native Multiple Select"
            options={nativeSelectOptions}
            bind:ref={selectMultipleState.ref}
            bind:touched={selectMultipleState.touched}
            bind:dirty={selectMultipleState.dirty}
            bind:valid={selectMultipleState.valid}
            bind:value={selectMultipleState.value}
            {...options}
            size={undefined}
          />
        </SphereBackdrop>
      </div>
    </div>

    <div class="row">
      <div class="column">
        <span class="label">Custom Select</span>

        {@render validationState(selectCustomState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoSelect
            validation
            required
            label="Custom Select"
            options={items}
            bind:ref={selectCustomState.ref}
            bind:touched={selectCustomState.touched}
            bind:dirty={selectCustomState.dirty}
            bind:valid={selectCustomState.valid}
            bind:value={selectCustomState.value}
            {...options}
            size={undefined}
          />
        </SphereBackdrop>
      </div>

      <div class="column">
        <span class="label">Custom Multi Select</span>

        {@render validationState(selectCustomMultipleState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoSelect
            validation
            required
            label="Custom Select"
            placeholder="Select multiple"
            options={items}
            multiple
            bind:ref={selectCustomMultipleState.ref}
            bind:touched={selectCustomMultipleState.touched}
            bind:dirty={selectCustomMultipleState.dirty}
            bind:valid={selectCustomMultipleState.valid}
            bind:value={selectCustomMultipleState.value}
            {...options}
            size={undefined}
          />
        </SphereBackdrop>
      </div>
    </div>

    <div class="row">
      <div class="column">
        <span class="label">Custom display text</span>

        {@render validationState(selectCustomMultipleState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoSelect
            validation
            required
            label="Custom Select"
            placeholder="Select multiple"
            display={displayValue}
            options={items}
            multiple
            bind:ref={selectCustomMultipleState.ref}
            bind:touched={selectCustomMultipleState.touched}
            bind:dirty={selectCustomMultipleState.dirty}
            bind:valid={selectCustomMultipleState.valid}
            bind:value={selectCustomMultipleState.value}
            {...options}
            size={undefined}
          />
        </SphereBackdrop>
      </div>

      <div class="column">
        <span class="label">Custom display snippet</span>

        {@render validationState(selectCustomMultipleState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoSelect
            required
            label="Custom Select"
            placeholder="Select multiple"
            options={items}
            multiple
            bind:ref={selectCustomMultipleState.ref}
            bind:touched={selectCustomMultipleState.touched}
            bind:dirty={selectCustomMultipleState.dirty}
            bind:valid={selectCustomMultipleState.valid}
            bind:value={selectCustomMultipleState.value}
            {...options}
            size={undefined}
          >
            {#snippet content({ value }: NeoInputState)}
              <div style="display: inline-flex; gap: 0.25rem; margin-left: -0.125rem;">
                {#each value as item (item)}
                  <span in:fade out:fade={quickDurationProps} animate:flip={quickCircOutProps}>
                    <NeoPill tinted small elevation="0">{item}</NeoPill>
                  </span>
                {/each}
              </div>
            {/snippet}
          </NeoSelect>
        </SphereBackdrop>
      </div>
    </div>
  </NeoForm>

  <!-- Custom inputs -->
  <NeoForm legend="Custom inputs" novalidate>
    <!--  Password  -->
    <div class="row">
      <div class="column content">
        <span class="label">Password</span>
        <SphereBackdrop glass={options.glass}>
          <NeoPassword label="Password" autocomplete="current-password" {...options} />
        </SphereBackdrop>
      </div>
    </div>

    <!-- Number inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Number</span>
        {@render validationState(numberState)}
        <SphereBackdrop glass={options.glass}>
          <NeoNumberStep
            bind:touched={numberState.touched}
            bind:dirty={numberState.dirty}
            bind:valid={numberState.valid}
            bind:value={numberState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Min Max</span>
        {@render validationState(numberState)}
        <SphereBackdrop glass={options.glass}>
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
      </div>
    </div>

    <!-- Number inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Pin</span>
        {@render validationState(pinState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoPin
            label="Pin Default"
            bind:touched={pinState.touched}
            bind:dirty={pinState.dirty}
            bind:valid={pinState.valid}
            bind:value={pinState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Pin Groups</span>
        {@render validationState(pinStateSeparator, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoPin
            label="Pin Validation"
            groups={2}
            required
            validation
            bind:touched={pinStateSeparator.touched}
            bind:dirty={pinStateSeparator.dirty}
            bind:valid={pinStateSeparator.valid}
            bind:value={pinStateSeparator.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Pin Password</span>
        {@render validationState(pinPasswordState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoPassword
            label="Pin Password"
            required
            validation
            pin
            bind:touched={pinPasswordState.touched}
            bind:dirty={pinPasswordState.dirty}
            bind:valid={pinPasswordState.valid}
            bind:value={pinPasswordState.value}
            type="password"
            {...options}
          />
        </SphereBackdrop>
      </div>
    </div>

    <!-- Date/Time Picker inputs -->
    <div class="row">
      {#each dateColumns as column}
        <div class="column content">
          <span class="label">{column.label}</span>
          {@render validationState(column.state, true)}
          <SphereBackdrop glass={options.glass}>
            <NeoDateTime
              bind:touched={column.state.touched}
              bind:dirty={column.state.dirty}
              bind:valid={column.state.valid}
              bind:value={column.state.value}
              {...options}
              {...column.props}
            />
          </SphereBackdrop>
        </div>
      {/each}
    </div>

    <!-- Color Picker inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Color Picker</span>
        {@render validationState(colorState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoColorPicker
            validation
            required
            bind:touched={colorState.touched}
            bind:dirty={colorState.dirty}
            bind:valid={colorState.valid}
            bind:value={colorState.value}
            label="Color Picker"
            {...options}
            size="10"
          />
        </SphereBackdrop>
      </div>
    </div>

    <!-- File Picker inputs -->
    <div class="row">
      {#each fileColumns as column}
        <div class="column content">
          <span class="label">{column.label}</span>
          {@render validationState(column.state, true)}
          <SphereBackdrop glass={options.glass}>
            <NeoFilePicker
              bind:touched={column.state.touched}
              bind:dirty={column.state.dirty}
              bind:valid={column.state.valid}
              bind:value={column.state.value}
              bind:files={column.state.files}
              {...options}
              {...column.props}
            />
          </SphereBackdrop>
        </div>
      {/each}
    </div>
  </NeoForm>

  <!-- Checkbox / Radio -->
  <NeoForm legend="Checkbox / Radio" novalidate>
    <!-- Checkbox inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Checkbox</span>
        {@render validationState(checkboxState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoCheckbox
            bind:touched={checkboxState.touched}
            bind:dirty={checkboxState.dirty}
            bind:valid={checkboxState.valid}
            bind:checked={checkboxState.checked}
            bind:indeterminate={checkboxState.indeterminate}
            label="Checkbox"
            required
            validation
            {...options}
            width="18rem"
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Flat Checkbox</span>
        {@render validationState(checkboxState, true)}

        <SphereBackdrop glass={options.glass}>
          <NeoCheckbox
            bind:touched={checkboxState.touched}
            bind:dirty={checkboxState.dirty}
            bind:valid={checkboxState.valid}
            bind:checked={checkboxState.checked}
            bind:indeterminate={checkboxState.indeterminate}
            label="Flat Checkbox"
            validation
            {...options}
            elevation={0}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Checkbox Group</span>
        <div class="label">Group: {checkboxGroupState.group}</div>
        <SphereBackdrop glass={options.glass}>
          <div class="column" style:gap="0.5rem">
            <NeoCheckbox label="Checkbox 1" value="Checkbox 1" name="checkbox-group" bind:group={checkboxGroupState.group} {...options} />
            <NeoCheckbox label="Checkbox 2" value="Checkbox 2" name="checkbox-group" bind:group={checkboxGroupState.group} {...options} />
            <NeoCheckbox label="Checkbox 3" value="Checkbox 3" name="checkbox-group" bind:group={checkboxGroupState.group} {...options} />
          </div>
        </SphereBackdrop>
      </div>
    </div>

    <!-- Radio inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Radio Group</span>
        <div class="label">Group: {radioState.group}</div>
        <SphereBackdrop glass={options.glass}>
          <div class="column" style:gap="0.5rem">
            <NeoRadio label="Radio 1" value="Radio 1" name="radio-group" bind:group={radioState.group} {...options} />
            <NeoRadio label="Radio 2" value="Radio 2" name="radio-group" bind:group={radioState.group} {...options} />
            <NeoRadio label="Radio 3" value="Radio 3" name="radio-group" bind:group={radioState.group} {...options} />
          </div>
        </SphereBackdrop>
      </div>
    </div>

    <!-- Switch inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Switch</span>
        {@render validationState(switchState, true)}
        <SphereBackdrop glass={options.glass}>
          <div class="column">
            <NeoSwitch
              label="Switch"
              bind:touched={switchState.touched}
              bind:dirty={switchState.dirty}
              bind:valid={switchState.valid}
              bind:checked={switchState.checked}
              bind:indeterminate={switchState.indeterminate}
              required
              validation
              {...options}
              width="18rem"
            />
          </div>
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Switch Group</span>
        <div class="label">Group: {switchGroupState.group}</div>
        <SphereBackdrop glass={options.glass}>
          <div class="column" style:gap="0.5rem">
            <NeoSwitch label="Switch 1" value="Switch 1" name="switch-group" bind:group={switchGroupState.group} {...options} />
            <NeoSwitch label="Switch 2" value="Switch 2" name="switch-group" bind:group={switchGroupState.group} {...options} />
            <NeoSwitch label="Switch 3" value="Switch 3" name="switch-group" bind:group={switchGroupState.group} {...options} />
          </div>
        </SphereBackdrop>
      </div>
    </div>
  </NeoForm>

  <!-- Range inputs -->
  <NeoForm legend="Range" novalidate>
    <div class="row">
      <div class="column content">
        <span class="label">Range</span>
        {@render validationState(rangeState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Range"
            bind:touched={rangeState.touched}
            bind:dirty={rangeState.dirty}
            bind:valid={rangeState.valid}
            bind:value={rangeState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Stepped</span>
        {@render validationState(rangeSteppedState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            step={10}
            label="Stepped"
            bind:touched={rangeSteppedState.touched}
            bind:dirty={rangeSteppedState.dirty}
            bind:valid={rangeSteppedState.valid}
            bind:value={rangeSteppedState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>
    </div>

    <div class="row">
      <div class="column content">
        <span class="label">Interval</span>
        {@render validationState(rangeArrayState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Interval"
            bind:touched={rangeArrayState.touched}
            bind:dirty={rangeArrayState.dirty}
            bind:valid={rangeArrayState.valid}
            bind:value={rangeArrayState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Min Max</span>
        {@render validationState(rangeMinMaxState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Min Max"
            min={-200}
            max={200}
            bind:touched={rangeMinMaxState.touched}
            bind:dirty={rangeMinMaxState.dirty}
            bind:valid={rangeMinMaxState.valid}
            bind:value={rangeMinMaxState.value}
            {...options}
          >
            {#snippet tooltip({ value, upper }, { min, max })}
              {#if upper}
                {value} / {max}
              {:else}
                {min} / {value}
              {/if}
            {/snippet}
          </NeoRange>
        </SphereBackdrop>
      </div>
    </div>

    <!-- Range inputs -->
    <div class="row">
      <div class="column content">
        <span class="label">Tick Range</span>
        {@render validationState(rangeSteppedState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Tick Stepped"
            step={10}
            ticks
            bind:touched={rangeSteppedState.touched}
            bind:dirty={rangeSteppedState.dirty}
            bind:valid={rangeSteppedState.valid}
            bind:value={rangeSteppedState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Tick every 20</span>
        {@render validationState(rangeSteppedState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Tick every 20"
            step={10}
            ticks={[0, 20, 40, 60, 80, 100]}
            bind:touched={rangeSteppedState.touched}
            bind:dirty={rangeSteppedState.dirty}
            bind:valid={rangeSteppedState.valid}
            bind:value={rangeSteppedState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>

      <div class="column content">
        <span class="label">Tick Interval</span>
        {@render validationState(rangeArrayState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Tick Interval"
            step={10}
            ticks
            bind:touched={rangeArrayState.touched}
            bind:dirty={rangeArrayState.dirty}
            bind:valid={rangeArrayState.valid}
            bind:value={rangeArrayState.value}
            {...options}
          />
        </SphereBackdrop>
      </div>
    </div>

    {#snippet beforeRange()}
      <NeoButton
        rounded
        aria-label="Increment range"
        glass={options.glass}
        disabled={options.disabled}
        readonly={options.readonly}
        skeleton={options.skeleton}
        text
        onclick={() => rangeState.ref.stepUp()}
      >
        {#snippet icon()}
          <IconMinus style="min-width: 1rem" />
        {/snippet}
      </NeoButton>
    {/snippet}
    {#snippet afterRange()}
      <NeoButton
        rounded
        aria-label="Decrement range"
        glass={options.glass}
        disabled={options.disabled}
        readonly={options.readonly}
        skeleton={options.skeleton}
        text
        onclick={() => rangeState.ref.stepDown()}
      >
        {#snippet icon()}
          <IconAdd style="min-width: 1rem" />
        {/snippet}
      </NeoButton>
    {/snippet}

    <div class="row">
      <div class="column content">
        <span class="label">Prefix/suffix</span>
        {@render validationState(rangeState, true)}
        <SphereBackdrop glass={options.glass}>
          <NeoRange
            label="Interval"
            bind:ref={rangeState.ref}
            bind:touched={rangeState.touched}
            bind:dirty={rangeState.dirty}
            bind:valid={rangeState.valid}
            bind:value={rangeState.value}
            before={beforeRange}
            after={afterRange}
            {...options}
          />
        </SphereBackdrop>
      </div>
    </div>
  </NeoForm>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);

    :global(> .neo-form > .neo-fieldset) {
      width: 100%;
    }

    &.content {
      flex: 1 0 20%;
      max-width: min(25%, 50rem);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    width: 100%;
    margin: 2rem 0;
  }

  @media (width < 1500px) {
    .column.content {
      flex: 1 0 40%;
      max-width: min(100%, 50rem);
    }
  }

  @media (width < 600px) {
    .column.content {
      flex: 0 1 80%;
    }
  }
</style>
