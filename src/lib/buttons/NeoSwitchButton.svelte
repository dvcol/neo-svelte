<script lang="ts">
  import type { NeoSwitchButtonProps } from '~/buttons/neo-switch-button.model.js';

  import { coerce, computeShadowElevation, DefaultShadowShallowElevation, DefaultShallowMinMaxElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,

    // State
    checked = $bindable(false),
    indeterminate = $bindable(false),
    valid,
    disabled,

    // Styles
    start,
    glass,
    rounded = true,
    skeleton,

    // Other props
    ...rest
  }: NeoSwitchButtonProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? DefaultShadowShallowElevation));
  const boxShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation));

  const onclick = () => {
    if (disabled) return;
    checked = !checked;
    indeterminate = false;
  };
</script>

<button
  role="switch"
  aria-checked={indeterminate ? 'mixed' : checked}
  class:neo-switch-button={true}
  class:neo-checked={checked || indeterminate}
  class:neo-rounded={rounded}
  class:neo-start={start}
  class:neo-glass={glass}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-flat={!elevation}
  class:neo-valid={valid === true}
  class:neo-invalid={valid === false}
  style:--neo-switch-box-shadow={boxShadow}
  {onclick}
  {...rest}
>
  {@render children?.()}
  <span class="neo-switch-rail">
    <span class="neo-switch-toggle">
      <!--   Toggle handle   -->
    </span>
  </span>
</button>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-switch {
    &-rail {
      position: relative;
      display: inline-flex;
      width: 100%;
      height: calc(100% - var(--neo-switch-spacing) * 2);
      margin: var(--neo-switch-spacing);
      overflow: hidden;
      background-color: var(--neo-switch-rail-background, color-mix(in srgb, transparent, currentcolor 1%));
      border-radius: var(--neo-switch-border-radius, var(--neo-border-radius-sm));
      transition: background-color 0.3s ease;
    }

    &-toggle {
      position: absolute;
      left: 0;
      display: inline-flex;
      box-sizing: border-box;
      height: calc(100% - (var(--neo-switch-spacing) * 2));
      margin: var(--neo-switch-spacing);
      background: var(--neo-switch-toggle-background, var(--neo-background-color));
      border-radius: 50%;
      box-shadow: var(--neo-switch-toggle-box-shadow, var(--neo-box-shadow-convex-2));
      transition:
        left 0.3s ease,
        scale 0.3s ease;
      aspect-ratio: 1 / 1;
    }

    &-button {
      --neo-switch-height: var(--neo-line-height, 1.5rem);
      --neo-switch-toggle-width: 0.875rem;
      --neo-switch-spacing: 0.125rem;

      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      min-width: calc(var(--neo-switch-height) * 1.8);
      height: var(--neo-switch-height);
      margin: 0;
      padding: 0;
      color: inherit;
      text-decoration: none;
      background: transparent;
      border: var(--neo-switch-border-width, var(--neo-border-width, 1px)) var(--neo-switch-border-color, transparent) solid;
      border-radius: var(--neo-switch-border-radius, var(--neo-border-radius));
      outline: none;
      box-shadow: var(--neo-switch-box-shadow, var(--neo-box-shadow-pressed-2));
      cursor: pointer;
      transition:
        color 0.3s ease,
        box-shadow 0.3s ease,
        border-radius 0.3s ease,
        border-color 0.3s ease,
        background-color 0.3s ease;

      &.neo-rounded {
        border-radius: var(--neo-border-radius-lg);

        .neo-switch-rail {
          border-radius: var(--neo-border-radius-lg);
        }
      }

      &.neo-valid {
        --neo-switch-checked-background: color-mix(in srgb, transparent, var(--neo-switch-valid-color, var(--neo-color-success)) 30%);
      }

      &.neo-invalid {
        --neo-switch-checked-background: color-mix(in srgb, transparent, var(--neo-switch-invalid-color, var(--neo-color-error)) 30%);
      }

      &.neo-checked {
        .neo-switch-rail {
          background-color: var(--neo-switch-checked-background, color-mix(in srgb, transparent, currentcolor 30%));
        }

        .neo-switch-toggle {
          left: calc(100% - var(--neo-switch-toggle-width) - (var(--neo-switch-spacing) * 2));
        }
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
        box-shadow: var(--neo-box-shadow-flat);
        cursor: not-allowed;
        opacity: var(--neo-card-opacity-disabled, var(--neo-opacity-disabled));
      }

      &.neo-disabled,
      &.neo-flat {
        --neo-switch-toggle-spacing: 0.25rem;

        border-color: var(--neo-switch-border-color, var(--neo-border-color));

        .neo-switch-toggle {
          background-color: var(--neo-switch-border-color, currentcolor);
          box-shadow: var(--neo-box-shadow-flat);
        }

        .neo-switch-rail {
          background-color: transparent;
        }

        &.neo-checked {
          background-color: color-mix(in srgb, transparent, currentcolor 10%);

          &.neo-valid {
            background-color: color-mix(in srgb, transparent, var(--neo-switch-valid-color, var(--neo-green-light)) 20%);
          }

          &.neo-invalid {
            background-color: color-mix(in srgb, transparent, var(--neo-switch-invalid-color, var(--neo-color-error)) 20%);
          }
        }
      }

      &:focus-visible {
        border-color: var(--neo-radio-border-color-focused, var(--neo-border-color-focused));
      }

      &:active {
        .neo-switch-toggle {
          transform-origin: left center;
          scale: 1.2 1;
        }

        &.neo-checked .neo-switch-toggle {
          transform-origin: right center;
        }
      }

      &.neo-glass {
        background-color: var(--neo-switch-bg-color, var(--neo-glass-background-color));
        border-color: var(--neo-switch-border-color, transparent);
        backdrop-filter: var(--neo-switch-glass-blur, var(--neo-blur-2) var(--neo-saturate-2));

        &.neo-flat {
          border-color: var(--neo-switch-border-color, var(--neo-glass-border-color-flat));
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
