<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { fade } from 'svelte/transition';

  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';

  import type { NeoSwitchProps } from '~/inputs/neo-switch.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { computeShadowElevation } from '~/utils/shadow.utils.js';
  import { enterTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    message,
    error,

    // State
    type = 'checkbox',
    id = label ? `neo-switch-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    group = $bindable(),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    disabled,
    required,
    loading,
    validation,

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
    labelRef = $bindable(),
    labelProps,
    messageTag = 'div',
    messageProps,
    containerRef = $bindable(),
    containerTag = 'div',
    containerProps,
    wrapperRef = $bindable(),
    wrapperTag = 'div',
    wrapperProps,
    ...rest
  }: NeoSwitchProps = $props();
  /* eslint-enable prefer-const */

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  let visible = $state(false);
  let messageId = $state(`neo-switch-message-${crypto.randomUUID()}`);
  const context = $derived<NeoInputContext<NeoInputHTMLElement>>({
    // Ref
    ref,

    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,

    // State
    value: checked,
    touched,
    dirty,
    valid,
    readonly: rest.readonly,
    disabled,

    // Styles
    rounded,
    glass,
    start,
    skeleton,
  });

  const boxShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, { max: 2, min: -2 }));
</script>

<NeoInputValidation
  tag={wrapperTag}
  bind:ref={wrapperRef}
  bind:visible
  bind:messageId
  {valid}
  {validation}
  {validationMessage}
  {error}
  {rounded}
  {context}
  {message}
  {messageTag}
  {messageProps}
  in={inAction}
  out={outAction}
  transition={transitionAction}
  {...wrapperProps}
  style={toStyle('--neo-validation-padding: 0', wrapperProps?.style)}
>
  <svelte:element this={containerTag} bind:this={containerRef} class:neo-switch-container={true} class:neo-flat={!elevation} {...containerProps}>
    <button
      class="neo-switch-button"
      role="switch"
      aria-checked={indeterminate ? 'mixed' : checked}
      class:neo-checked={checked || indeterminate}
      class:neo-rounded={rounded}
      class:neo-start={start}
      class:neo-glass={glass}
      class:neo-disabled={disabled}
      class:neo-skeleton={skeleton}
      class:neo-flat={!elevation}
      class:neo-valid={validation && valid}
      class:neo-invalid={validation && !valid}
      style:--neo-switch-box-shadow={boxShadow}
      onclick={() => ref?.click()}
    >
      <span class="neo-switch-input">
        <NeoBaseInput
          aria-invalid={valid === undefined ? undefined : !valid}
          aria-describedby={visible ? messageId : undefined}
          {id}
          bind:ref
          bind:initial
          bind:group
          bind:checked
          bind:indeterminate
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
      <span class="neo-switch-rail">
        <span class="neo-switch-toggle">
          <!--   Toggle handle   -->
        </span>
      </span>
    </button>
    <NeoLabel bind:ref={labelRef} for={id} {label} {disabled} {required} {...labelProps} />
    {#if loading !== undefined}
      <span class="neo-switch-suffix">
        {#if loading}
          <span class="neo-switch-loading" out:fade={enterTransitionProps}>
            <IconCircleLoading size="1rem" />
          </span>
        {/if}
      </span>
    {/if}
  </svelte:element>
</NeoInputValidation>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-switch {
    &-container {
      --neo-switch-height: var(--neo-line-height, 1.5rem);
      --neo-switch-toggle-width: 0.875rem;
      --neo-switch-spacing: 0.125rem;
      --neo-label-margin: 0 0 0 0.75rem;
      --neo-label-padding: 0;

      display: inline-flex;
      align-items: center;
      width: fit-content;
      margin: 0;
      padding: calc(0.375rem + var(--neo-switch-border-width, var(--neo-border-width, 1px))) 0.5rem 0.375rem;

      &.neo-flat {
        --neo-label-margin: 0 0 0 0.625rem;
      }
    }

    &-input {
      display: none;
    }

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

        border-color: var(--neo-input-border-color, var(--neo-border-color));

        .neo-switch-toggle {
          background-color: var(--neo-input-border-color, currentcolor);
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
        @include mixin.glass;

        background-color: var(--neo-switch-bg-color, var(--neo-glass-background-color));
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
