<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoRadioProps } from '~/inputs/neo-radio.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconRadio from '~/icons/IconRadio.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { computeShadowElevation } from '~/utils/shadow.utils.js';
  import { enterTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,

    // State
    type = 'radio',
    id = label ? `neo-radio-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    group = $bindable(),
    checked = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    disabled,
    required,
    loading,

    // Styles
    start,
    glass,
    rounded = true,
    skeleton,

    elevation = 2,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    containerRef = $bindable(),
    labelRef = $bindable(),
    labelProps,
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoRadioProps = $props();
  /* eslint-enable prefer-const */

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  const boxShadow = $derived(computeShadowElevation(elevation, { glass }, { max: 2, min: -2 }));
  const checkedShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, { max: 2, min: -2 }));
</script>

<svelte:element
  this={containerTag}
  bind:this={containerRef}
  class:neo-radio-container={true}
  class:neo-rounded={rounded}
  class:neo-flat={!elevation}
  {...containerProps}
>
  <button
    class="neo-radio-button"
    role="radio"
    aria-checked={checked}
    class:neo-checked={checked}
    class:neo-rounded={rounded}
    class:neo-start={start}
    class:neo-glass={glass}
    class:neo-disabled={disabled}
    class:neo-skeleton={skeleton}
    class:neo-flat={!elevation}
    class:neo-inset={elevation <= 0}
    style:--neo-radio-box-shadow={boxShadow}
    style:--neo-radio-checked-shadow={checkedShadow}
    onclick={() => ref?.click()}
  >
    <span class="neo-radio-input">
      <NeoBaseInput
        aria-invalid={valid === undefined ? undefined : !valid}
        {id}
        bind:ref
        bind:initial
        bind:group
        bind:checked
        bind:valid
        bind:dirty
        bind:touched
        bind:focused
        bind:validationMessage
        {type}
        {disabled}
        {required}
        {...rest}
        hidden
        aria-hidden
        tabindex={-1}
      />
    </span>
    {#if checked}
      <IconRadio circle={rounded} scale={rounded ? 0.75 : 0.9} checked />
    {:else}
      <IconRadio circle={rounded} scale={rounded ? 0.75 : 0.9} />
    {/if}
  </button>
  <NeoLabel bind:ref={labelRef} for={id} {label} {disabled} {required} {...labelProps} />
  {#if loading !== undefined}
    <span class="neo-radio-suffix">
      {#if loading}
        <span class="neo-radio-loading" out:fade={enterTransitionProps}>
          <IconCircleLoading size="1rem" />
        </span>
      {/if}
    </span>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-radio {
    &-container {
      --neo-label-margin: 0 0 0 0.75rem;
      --neo-label-padding: 0;

      display: inline-flex;
      align-items: center;
      width: fit-content;
      margin: 0;
      padding: calc(0.375rem + var(--neo-radio-border-width, var(--neo-border-width, 1px))) 0.5rem 0.375rem;
      border-radius: var(--neo-border-radius);
      transition:
        box-shadow 0.3s ease,
        border-radius 0.3s ease;

      &.neo-rounded {
        border-radius: var(--neo-border-radius-lg);
      }

      &.neo-flat {
        --neo-label-margin: 0 0 0 0.625rem;
      }
    }

    &-input {
      display: none;
    }

    &-button {
      box-sizing: border-box;
      min-width: fit-content;
      margin: 0 0 0.125rem;
      padding: 0;
      color: inherit;
      text-decoration: none;
      background-color: color-mix(in srgb, transparent, currentcolor 1%);
      border: var(--neo-radio-border-width, var(--neo-border-width, 1px)) var(--neo-radio-border-color, transparent) solid;
      border-radius: var(--neo-border-radius-xs);
      outline: none;
      box-shadow: var(--neo-radio-box-shadow, var(--neo-box-shadow-raised-2));
      cursor: pointer;
      transition:
        color 0.3s ease,
        box-shadow 0.3s ease,
        border-radius 0.3s ease,
        border-color 0.3s ease,
        background-color 0.3s ease;

      &.neo-disabled,
      &.neo-flat {
        background-color: transparent;
        border-color: var(--neo-input-border-color, var(--neo-border-color));
      }

      &:focus-visible,
      &.neo-checked {
        box-shadow: var(--neo-radio-checked-shadow, var(--neo-box-shadow-pressed-2));
      }

      &.neo-inset:focus-visible {
        border-color: var(--neo-checkbox-border-color-focused, var(--neo-border-color-focused));
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
        box-shadow: var(--neo-box-shadow-flat);
        cursor: not-allowed;
        opacity: var(--neo-card-opacity-disabled, var(--neo-opacity-disabled));
      }

      &.neo-rounded {
        border-radius: 50%;
      }

      &.neo-glass {
        @include mixin.glass;

        background-color: var(--neo-radio-bg-color, var(--neo-glass-background-color));
        border-color: var(
          --neo-radio-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
        backdrop-filter: var(--neo-radio-glass-blur, var(--neo-blur-2) var(--neo-saturate-2));
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

    &-suffix {
      width: 1rem;
      height: 1rem;
      margin-bottom: 0.125rem;
      margin-left: 0.5rem;
    }
  }
</style>
