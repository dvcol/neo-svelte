<script lang="ts">
  import type { NeoColorPickerSelectorProps } from '~/inputs/neo-color-picker.model.js';

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

</script>

<input class:neo-color-picker={true} class:neo-rounded={rounded} bind:this={ref} bind:value type="color" style:height {...rest} />

<style lang="scss">
  .neo-color-picker {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border: var(--neo-color-picker-border-width, 0) solid var(--neo-color-picker-border-color, transparent);
    border-radius: var(--neo-border-radius-xs);
    cursor: pointer;
    transition: border-radius 0.3s ease;
    appearance: none;
    aspect-ratio: 4/3;

    &:disabled {
      cursor: not-allowed;
    }

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
