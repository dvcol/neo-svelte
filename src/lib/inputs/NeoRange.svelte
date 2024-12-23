<script lang="ts">
  import { flip, useFloating } from '@skeletonlabs/floating-ui-svelte';
  import { fade } from 'svelte/transition';

  import type { MouseEventHandler } from 'svelte/elements';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { toStyle } from '~/utils/props.utils.js';
  import { computeShadowElevation } from '~/utils/shadow.utils.js';
  import { enterDefaultTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    message,
    error,

    // State
    type = 'range',
    id = label ? `neo-range-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    value = $bindable(0),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    hovered = $bindable(false),
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
    containerTag = 'div',
    containerProps,
    wrapperTag = 'div',
    wrapperProps,
    ...rest
  } = $props();
  /* eslint-enable prefer-const */

  let initial = $state(value);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  let visible = $state(false);
  let messageId = $state(`neo-range-message-${crypto.randomUUID()}`);
  const context = $derived<NeoInputContext<NeoInputHTMLElement>>({
    // Ref
    ref,

    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,

    // State
    value,
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

  const show = $derived(focused || hovered);
  const floating = useFloating({
    placement: 'bottom',
    middleware: [flip()],
  });

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerProps?.onmouseenter?.(e);
  };

  const onMouseLeave: MouseEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerProps?.onmouseleave?.(e);
  };

  $effect(() => {
    if (value > -1) floating.update();
  });
</script>

<input type="range" bind:value />

<NeoInputValidation
  tag={wrapperTag}
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
  <svelte:element
    this={containerTag}
    role="none"
    class:neo-range-container={true}
    {...containerProps}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
  >
    {#if show}
      <span class="neo-range-value" bind:this={floating.elements.floating} style={floating.floatingStyles} transition:fade>
        {value}
      </span>
    {/if}
    <button
      class="neo-range-button"
      class:neo-rounded={rounded}
      class:neo-start={start}
      class:neo-glass={glass}
      class:neo-disabled={disabled}
      class:neo-skeleton={skeleton}
      class:neo-flat={!elevation}
      class:neo-valid={validation && valid}
      class:neo-invalid={validation && !valid}
      style:--neo-range-box-shadow={boxShadow}
      style:--neo-range-progress={`${value || 0}%`}
      onclick={() => ref?.click()}
    >
      <span class="neo-range-input">
        <NeoBaseInput
          aria-invalid={valid === undefined ? undefined : !valid}
          aria-describedby={visible ? messageId : undefined}
          {id}
          bind:ref
          bind:initial
          bind:value
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
      <span class="neo-range-rail">
        <span class="neo-range-toggle-before">
          <!--   Toggle before   -->
        </span>
        <span bind:this={floating.elements.reference} class="neo-range-toggle">
          <!--   Toggle handle   -->
        </span>
        <span class="neo-range-toggle-after">
          <!--   Toggle after   -->
        </span>
      </span>
    </button>
    <NeoLabel bind:ref={labelRef} for={id} {label} {disabled} {required} {...labelProps} />
    {#if loading !== undefined}
      <span class="neo-range-suffix">
        {#if loading}
          <span class="neo-range-loading" out:fade={enterDefaultTransition}>
            <IconCircleLoading width="1rem" height="1rem" />
          </span>
        {/if}
      </span>
    {/if}
  </svelte:element>
</NeoInputValidation>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-range {
    &-container {
      --neo-range-min-width: calc(var(--neo-range-height) / 2);
      --neo-range-height: var(--neo-line-height-sm, 1.25rem);
      --neo-range-spacing: 0.125rem;

      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-width: calc(var(--neo-range-height) * 12);
      margin: 0;
      padding: calc(0.375rem + var(--neo-range-border-width, var(--neo-border-width, 1px))) 0.5rem 0.375rem;
    }

    &-input {
      display: none;
    }

    &-rail {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      margin-right: calc(var(--neo-range-min-width) - var(--neo-range-spacing));
      margin-left: var(--neo-range-min-width);
      background-color: var(--neo-range-rail-background, transparent);
      border-radius: var(--neo-switch-border-radius, var(--neo-border-radius-sm));
      transition: background-color 0.3s ease;
    }

    &-toggle {
      z-index: var(--neo-z-index-in-front, 1);
      display: inline-flex;
      align-self: center;
      box-sizing: border-box;
      height: 100%;
      margin-right: calc(0% - var(--neo-range-height) / 2);
      margin-left: calc(0% - var(--neo-range-height) / 2);
      background: var(--neo-range-toggle-background, var(--neo-background-color));
      border-radius: var(--neo-border-radius-sm);
      box-shadow: var(--neo-range-toggle-box-shadow, var(--neo-box-shadow-convex-2));
      transition:
        right 0.3s ease,
        scale 0.3s ease;
      aspect-ratio: 1 / 1;

      &-before,
      &-after {
        display: inline-flex;
        box-sizing: border-box;
        height: calc(100% - var(--neo-range-spacing) * 2);
        margin: var(--neo-range-spacing);
        border-radius: var(--neo-border-radius-xs);
      }

      &-before {
        width: calc(var(--neo-range-min-width) - var(--neo-range-spacing) + var(--neo-range-progress, 0%));
        margin-right: 0;
        margin-left: calc(var(--neo-range-spacing) - var(--neo-range-min-width));
        background-color: var(--neo-switch-checked-background, color-mix(in srgb, transparent, currentcolor 30%));
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      &-after {
        flex: 1 1 auto;
        margin-right: calc(var(--neo-range-spacing) - var(--neo-range-min-width));
        margin-left: 0;
        background-color: var(--neo-switch-rail-background, color-mix(in srgb, transparent, currentcolor 1%));
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }

    &-button {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-width: calc(var(--neo-range-height) * 1.8);
      height: var(--neo-range-height);
      margin: 0;
      padding: 0;
      overflow: hidden;
      color: inherit;
      text-decoration: none;
      background: transparent;
      border: var(--neo-range-border-width, var(--neo-border-width, 1px)) var(--neo-range-border-color, transparent) solid;
      border-radius: var(--neo-range-border-radius, var(--neo-border-radius));
      outline: none;
      box-shadow: var(--neo-range-box-shadow, var(--neo-box-shadow-pressed-2));
      cursor: pointer;
      transition:
        color 0.3s ease,
        box-shadow 0.3s ease,
        border-radius 0.3s ease,
        border-color 0.3s ease;

      &.neo-rounded {
        border-radius: var(--neo-border-radius-lg);

        .neo-range-toggle {
          border-radius: 50%;

          &-before,
          &-after {
            border-radius: var(--neo-border-radius-lg);
          }
        }
      }

      &.neo-valid {
        --neo-range-rail-background: color-mix(in srgb, transparent, var(--neo-range-valid-color, var(--neo-color-success)) 30%);
      }

      &.neo-invalid {
        --neo-range-rail-background: color-mix(in srgb, transparent, var(--neo-range-invalid-color, var(--neo-color-error)) 30%);
      }

      &.neo-disabled {
        color: var(--neo-text-color-disabled);
        box-shadow: var(--neo-box-shadow-flat);
        cursor: not-allowed;
        opacity: var(--neo-card-opacity-disabled, var(--neo-opacity-disabled));
      }

      &.neo-disabled,
      &.neo-flat {
        --neo-range-min-width: calc(var(--neo-range-height) / 2 - 2px);

        border-color: var(--neo-input-border-color, var(--neo-border-color));

        .neo-range-rail {
          margin-right: calc(var(--neo-range-min-width) + var(--neo-range-spacing));
          margin-left: var(--neo-range-min-width);
        }

        .neo-range-toggle {
          background-color: var(--neo-input-border-color, currentcolor);
          box-shadow: var(--neo-box-shadow-flat);

          &-after,
          &-before {
            height: 100%;
            border-radius: inherit;
          }

          &-before {
            width: calc(var(--neo-range-min-width) + var(--neo-range-spacing) + var(--neo-range-progress, 0%));
            margin-left: calc(0% - var(--neo-range-min-width));
          }
        }
      }

      &:focus-visible {
        border-color: var(--neo-radio-border-color-focused, var(--neo-border-color-focused));
      }

      &.neo-glass {
        @include mixin.glass;

        background-color: var(--neo-range-bg-color, var(--neo-glass-background-color));
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
