<script lang="ts">
  import type { NeoColorPickerSelectorProps } from '~/inputs/neo-color-picker.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(),

    // Styles
    rounded,
    height,

    // Other props
    ...rest
  }: NeoColorPickerSelectorProps = $props();
  /* eslint-enable prefer-const */
</script>

<input class:neo-color-picker={true} class:neo-rounded={rounded} bind:this={ref} bind:value type="color" style:height {...rest} />

<style lang="scss">
  .neo-color-picker {
    box-sizing: border-box;
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
