<script lang="ts">
  import type { FormEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import type { NeoColorPickerProps } from '~/inputs/neo-color-picker.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconPaint from '~/icons/IconPaint.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { HexColorRegexString } from '~/utils/regex.utils.js';
  import { computeButtonShadows, getDefaultElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    placeholder = 'Pick a color',
    pattern = HexColorRegexString,
    minlength = 7,
    maxlength = 7,

    // Other props
    containerRef = $bindable(),
    wrapperRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    pickerRef = $bindable(),
    pickerProps,
    ...rest
  }: NeoColorPickerProps = $props();
  /* eslint-enable prefer-const */

  const onclick: NeoButtonProps['onclick'] = e => {
    pickerRef?.focus?.();
    pickerRef?.click?.();
    pickerRef?.showPicker?.();
    buttonProps?.onclick?.(e);
  };

  const elevation = $derived(rest?.elevation ?? getDefaultElevation(rest?.pressed));
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const afterProps = $derived<NeoButtonProps>({
    'aria-label': 'Toggle picker',
    title: 'Toggle picker',
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
    onclick,
  });

  const oninput: FormEventHandler<HTMLInputElement> = e => {
    ref?.dispatchEvent(new InputEvent(e.type, e));
    pickerProps?.oninput?.(e);
  };

  const onchange: FormEventHandler<HTMLInputElement> = e => {
    ref?.dispatchEvent(new InputEvent(e.type, e));
    pickerProps?.onchange?.(e);
  };
</script>

{#snippet before()}
  <input
    class:neo-color-picker={true}
    class:neo-rounded={rest.rounded}
    class:neo-label={rest.label}
    bind:this={pickerRef}
    bind:value
    type="color"
    {oninput}
    {onchange}
    {...pickerProps}
  />
{/snippet}

{#snippet after()}
  <NeoButton {...afterProps}>
    {#snippet icon()}
      <IconPaint size="1.25rem" scale="var(--neo-input-icon-scale, 1.125)" />
    {/snippet}
  </NeoButton>
{/snippet}

<NeoInput
  bind:ref
  bind:containerRef
  bind:wrapperRef
  bind:labelRef
  bind:value
  bind:valid
  bind:dirty
  bind:touched
  bind:hovered
  bind:focused
  type="text"
  {placeholder}
  {before}
  {after}
  {pattern}
  {minlength}
  {maxlength}
  {...rest}
/>

<style lang="scss">
  .neo-color-picker {
    box-sizing: border-box;
    min-width: 3rem;
    height: 100%;
    min-height: 2.25rem;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--neo-border-radius-xs);
    transition: border-radius 0.3s ease;
    appearance: none;
    aspect-ratio: 4/3;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch-wrapper,
    &::-webkit-color-swatch {
      border: none;
    }

    &::-webkit-color-swatch-wrapper,
    &::-webkit-color-swatch,
    &::-moz-color-swatch {
      border-radius: var(--neo-border-radius-xs);
    }

    &.neo-rounded {
      border-radius: var(--neo-border-radius-lg);

      &::-webkit-color-swatch-wrapper,
      &::-webkit-color-swatch,
      &::-moz-color-swatch {
        border-radius: var(--neo-border-radius-lg);
      }
    }
  }
</style>
