<script lang="ts">
  import type { NeoCheckboxButtonProps } from '~/buttons/neo-checkbox-button.model.js';

  import IconCheckbox from '~/icons/IconCheckbox.svelte';
  import { coerce, computeShadowElevation, DefaultShadowShallowElevation, DefaultShallowMinMaxElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // State
    checked = $bindable(false),
    indeterminate = $bindable(false),
    touched = $bindable(false),
    disabled,

    // Styles
    start,
    glass,
    rounded,
    skeleton = false,

    // Other props
    ...rest
  }: NeoCheckboxButtonProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? DefaultShadowShallowElevation));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass }, DefaultShallowMinMaxElevation));
  const checkedShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation));

  const onclick = () => {
    if (disabled) return;
    checked = !checked;
    indeterminate = false;
    touched = true;
  };
</script>

<button
  class="neo-checkbox-button"
  role="checkbox"
  aria-checked={indeterminate ? 'mixed' : checked}
  class:neo-checked={checked || indeterminate}
  class:neo-rounded={rounded}
  class:neo-start={start}
  class:neo-glass={glass}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-flat={!elevation}
  class:neo-inset={elevation <= 0}
  style:--neo-checkbox-box-shadow={boxShadow}
  style:--neo-checkbox-checked-shadow={checkedShadow}
  {onclick}
  {...rest}
>
  {@render children?.()}
  <IconCheckbox circle={rounded} indeterminate={!!indeterminate} checked={!!checked} enter={touched} />
</button>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-checkbox {
    &-button {
      box-sizing: border-box;
      min-width: fit-content;
      margin: 0 0 0.125rem;
      padding: 0.125rem;
      color: inherit;
      font: inherit;
      text-decoration: none;
      background-color: color-mix(in srgb, transparent, currentcolor 1%);
      border: var(--neo-checkbox-border-width, var(--neo-border-width, 1px)) var(--neo-checkbox-border-color, transparent) solid;
      border-radius: var(--neo-border-radius-xs);
      outline: none;
      box-shadow: var(--neo-checkbox-box-shadow, var(--neo-box-shadow-raised-2));
      cursor: pointer;
      transition:
        color 0.3s ease,
        box-shadow 0.3s ease,
        border-radius 0.3s ease,
        border-color 0.3s ease,
        background-color 0.3s ease;

      :global(> svg) {
        display: block;
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
      }

      &.neo-disabled,
      &.neo-flat {
        background-color: transparent;
        border-color: var(--neo-input-border-color, var(--neo-border-color));
      }

      &:focus-visible,
      &.neo-checked {
        box-shadow: var(--neo-checkbox-checked-shadow, var(--neo-box-shadow-pressed-2));
      }

      &.neo-inset:focus-visible {
        border-color: var(--neo-checkbox-border-color-focused, var(--neo-border-color-focused));
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
        box-shadow: var(--neo-box-shadow-flat);
        cursor: not-allowed;
        opacity: var(--neo-checkbox-opacity-disabled, var(--neo-opacity-disabled));
      }

      &.neo-rounded {
        border-radius: 50%;
      }

      &.neo-glass {
        background-color: var(--neo-checkbox-bg-color, var(--neo-glass-background-color));
        border-color: var(--neo-checkbox-border-color, transparent);
        backdrop-filter: var(--neo-checkbox-glass-blur, var(--neo-blur-2) var(--neo-saturate-2));

        &.neo-flat {
          border-color: var(--neo-checkbox-border-color, var(--neo-glass-border-color-flat));
        }
      }

      &.neo-start {
        @starting-style {
          box-shadow: var(--neo-box-shadow-flat);
        }
      }

      &.neo-skeleton {
        box-shadow: var(--neo-box-shadow-flat);
        pointer-events: none;

        @include mixin.skeleton;
      }
    }
  }
</style>
