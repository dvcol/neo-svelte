<script lang="ts">
  import { resize } from '@dvcol/svelte-utils/resize';

  import type { NeoSwitchButtonContext, NeoSwitchButtonProps } from '~/buttons/neo-switch-button.model.js';

  import { coerce, computeShadowElevation, DefaultShadowShallowElevation, DefaultShallowMinMaxElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    handle,
    on,
    off,

    // State
    checked = $bindable(false),
    indeterminate = $bindable(false),
    valid,
    disabled,

    // Styles
    start,
    glass,
    rounded = true,
    skeleton = false,

    // Other props
    ...rest
  }: NeoSwitchButtonProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? DefaultShadowShallowElevation));
  const boxShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, DefaultShallowMinMaxElevation));

  const context = $derived<NeoSwitchButtonContext>({ checked, indeterminate, disabled });

  const onclick = () => {
    if (disabled) return;
    checked = !checked;
    indeterminate = false;
  };

  let toggleWidth = $state<string>();
  let toggleRef = $state<HTMLSpanElement>();
  const updateSize = () => {
    if (!toggleRef) return;
    const width = toggleRef?.getBoundingClientRect().width;
    if (!width) return;
    toggleWidth = `${width}px`;
  };

  $effect(updateSize);
</script>

{#snippet label(content: NeoSwitchButtonProps['on'])}
  {#if content && typeof content === 'function'}
    {@render content?.(context)}
  {:else if content}
    {content}
  {/if}
{/snippet}

<button
  role="switch"
  aria-checked={indeterminate ? 'mixed' : checked}
  class:neo-switch-button={true}
  class:neo-checked={checked}
  class:neo-indeterminate={indeterminate}
  class:neo-rounded={rounded}
  class:neo-start={start}
  class:neo-glass={glass}
  class:neo-disabled={disabled}
  class:neo-skeleton={skeleton}
  class:neo-flat={!elevation}
  class:neo-valid={valid === true}
  class:neo-invalid={valid === false}
  style:--neo-switch-box-shadow={boxShadow}
  style:--neo-switch-toggle-width={toggleWidth}
  use:resize={updateSize}
  {onclick}
  {...rest}
>
  {@render children?.()}
  <span class="neo-switch-rail">
    <span class="neo-switch-on" class:neo-visible={checked}>
      {@render label(on)}
    </span>
    <span class="neo-switch-toggle" bind:this={toggleRef}>
      <!--   Toggle handle   -->
      {@render label(handle)}
    </span>
    <span class="neo-switch-off" class:neo-visible={!checked}>
      {@render label(off)}
    </span>
  </span>
</button>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-switch {
    &-rail {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-width: calc(var(--neo-switch-toggle-width) * 2 + var(--neo-switch-spacing) * 4);
      height: calc(100% - var(--neo-switch-spacing) * 2);
      margin: var(--neo-switch-spacing);
      overflow: hidden;
      font-size: var(--neo-switch-font-size, var(--neo-font-size-xs, 0.75rem));
      background-color: var(--neo-switch-rail-background, color-mix(in srgb, transparent, currentcolor 1%));
      border-radius: var(--neo-switch-border-radius, var(--neo-border-radius-sm));
      transition: background-color 0.3s ease;
    }

    &-toggle {
      position: absolute;
      left: 0;
      z-index: var(--neo-switch-toggle-z-index, var(--neo-z-index-in-front, 1));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: calc(100% - (var(--neo-switch-spacing) * 2));
      margin: var(--neo-switch-spacing);
      background: var(--neo-switch-toggle-background, var(--neo-background-color));
      border-radius: 50%;
      box-shadow: var(--neo-switch-toggle-box-shadow, var(--neo-box-shadow-convex-2));
      backface-visibility: hidden;
      transition:
        left 0.3s ease,
        scale 0.3s ease 0.1s;
      aspect-ratio: 1 / 1;
    }

    &-on,
    &-off {
      margin: var(--neo-switch-spacing);
      opacity: 0;
      transition: opacity 0.3s ease;

      &.neo-visible {
        opacity: 1;
      }
    }

    &-on {
      margin-right: 0;
      transform-origin: left center;
    }

    &-off {
      margin-left: 0;
      transform-origin: right center;
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

      &.neo-indeterminate {
        .neo-switch-rail {
          background-color: var(--neo-switch-checked-background, color-mix(in srgb, transparent, currentcolor 10%));
        }

        .neo-switch-toggle {
          left: calc(50% - var(--neo-switch-toggle-width) / 2 - (var(--neo-switch-spacing)));
        }
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

        &.neo-indeterminate {
          background-color: color-mix(in srgb, transparent, currentcolor 5%);
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
