<script lang="ts">
  import type { NeoCheckboxButtonProps } from '~/buttons/neo-checkbox-button.model.js';

  import IconCheckbox from '~/icons/IconCheckbox.svelte';
  import { getColorVariable } from '~/utils/colors.utils.js';
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
    color,
    tinted,
    rounded,
    skeleton = false,

    // Other props
    ..._rest
  }: NeoCheckboxButtonProps = $props();
  /* eslint-enable prefer-const */

  const { elevation: _elevation = DefaultShadowShallowElevation, ...rest } = $derived(_rest);

  const elevation = $derived(coerce(_elevation));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, active: glass }, DefaultShallowMinMaxElevation));
  const checkedShadow = $derived(
    computeShadowElevation(-Math.abs(elevation), { glass, active: glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation),
  );

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
  class:neo-tinted={tinted}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-flat={!elevation}
  class:neo-inset={elevation <= 0}
  style:--neo-checkbox-color={getColorVariable(color)}
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
      color: var(--neo-checkbox-color, inherit);
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
        box-shadow 0.3s ease-out,
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

      &:hover {
        color: var(--neo-checkbox-color-hover, var(--neo-text-color-highlight));
      }

      &.neo-flat:hover {
        border-color: var(--neo-checkbox-border-color-hover, var(--neo-border-color-highlight));
      }

      &:focus-visible {
        outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
        outline-offset: var(--neo-outline-offset-width, -1px);
      }

      &:hover:not(.neo-disabled, .neo-flat),
      &:focus-visible,
      &.neo-checked {
        box-shadow: var(--neo-checkbox-checked-shadow, var(--neo-box-shadow-pressed-2));
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
        --neo-background-color-tinted: var(--neo-glass-background-color-tinted);

        background-color: var(--neo-checkbox-bg-color, var(--neo-glass-background-color));
        border-color: var(--neo-checkbox-border-color, transparent);
        backdrop-filter: var(--neo-checkbox-glass-blur, var(--neo-blur-2) var(--neo-saturate-2));

        &.neo-flat {
          border-color: var(--neo-checkbox-border-color, var(--neo-glass-border-color-flat));

          &:hover {
            border-color: var(--neo-checkbox-border-color-hover, var(--neo-border-color-flat-highlight));
          }
        }

        &:not(.neo-flat, .neo-inset) {
          border-color: var(
            --neo-input-border-color,
            var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
              var(--neo-glass-left-border-color)
          );
        }
      }

      &.neo-start {
        @starting-style {
          box-shadow: var(--neo-box-shadow-flat);
        }
      }

      &.neo-tinted {
        background-color: var(--neo-input-bg-color, var(--neo-background-color-tinted));
      }

      &.neo-skeleton {
        box-shadow: var(--neo-box-shadow-flat);
        pointer-events: none;

        @include mixin.skeleton;
      }
    }
  }
</style>
