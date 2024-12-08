<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import type { MouseEventHandler } from 'svelte/elements';

  import NeoAffix from '~/inputs/NeoAffix.svelte';
  import NeoBaseInput from '~/inputs/NeoBaseInput.svelte';
  import NeoLabel from '~/inputs/NeoLabel.svelte';
  import NeoValidation from '~/inputs/NeoValidation.svelte';
  import { type NeoInputContext, type NeoInputHTMLElement, NeoInputLabelPosition, type NeoInputProps } from '~/inputs/neo-input.model.js';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import {
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    getDefaultElevation,
    getDefaultHoverElevation,
    isShadowFlat,
  } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    before,
    after,
    message,
    error,

    // States
    id = label ? `neo-input-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    files = $bindable(), // type="file"
    value = $bindable(),
    group = $bindable(), // type="radio"
    checked = $bindable(), // type="checkbox"
    indeterminate = $bindable(), // type="checkbox"
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    disabled,
    readonly,

    loading,
    clearable,

    position = NeoInputLabelPosition.Inside,

    // Styles
    borderless,
    pressed,
    rounded,
    glass,
    start,
    floating = true,
    skeleton,
    validation,
    elevation = getDefaultElevation(pressed),
    hover = getDefaultHoverElevation(pressed),

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    labelRef = $bindable(),
    labelProps,
    afterProps,
    afterTag = afterProps?.onclick ? 'button' : 'span',
    beforeProps,
    beforeTag = beforeProps?.onclick ? 'button' : 'span',
    containerProps,
    containerTag = 'div',
    wrapperProps,
    wrapperTag = 'div',
    messageProps,
    messageTag = 'div',
    ...rest
  }: NeoInputProps = $props();
  /* eslint-enable prefer-const */

  let initial = $state(value);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  const filter = $derived(computeGlassFilter(elevation, glass));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerProps?.onmouseenter?.(e);
  };

  const onMouseLeave: MouseEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerProps?.onmouseleave?.(e);
  };

  const affix = $derived(clearable || loading !== undefined || validation);
  const hasValue = $derived(value !== undefined && (typeof value === 'string' ? !!value.length : value !== null));
  const close = $derived(clearable && (focused || hovered) && hasValue && !disabled && !readonly);
  const isFloating = $derived(floating && !focused && !hasValue && !disabled && !readonly);
  const inside = $derived(position === NeoInputLabelPosition.Inside && label);

  const onClear = () => {
    if (focused || disabled || readonly) return;
    ref?.clear?.();
  };
  const onFocus = () => {
    if (focused || disabled || readonly) return;
    ref?.focus();
  };

  let first = $state(true);
  // Skip enter transition on first render for floating label
  const waitForTick = async () => {
    if (!first) return;
    await wait();
    first = false;
  };

  let labelHeight = $state<string>();
  let labelWidth = $state<string>();

  let beforeRef = $state<HTMLElement>();
  let beforeWidth = $state<string>();

  $effect(() => {
    if (first) waitForTick();
    if (!labelRef) return;
    if (position === NeoInputLabelPosition.Inside && !floating) return;
    labelHeight = `${labelRef?.clientHeight ?? 0}px`;
    if (position !== NeoInputLabelPosition.Left && position !== NeoInputLabelPosition.Right) return;
    labelWidth = `${labelRef?.clientWidth ?? 0}px`;
    beforeWidth = `${beforeRef?.clientWidth ?? 0}px`;
  });

  const errorMessage = $derived.by(() => {
    if (valid || valid === undefined) return;
    if (error) return error;
    if (!validation) return;
    return error ?? validationMessage;
  });

  const showMessage = $derived(message || errorMessage || error || validation);
  const messageId = $derived(showMessage ? (messageProps?.id ?? `neo-input-message-${crypto.randomUUID()}`) : undefined);

  const context = $derived<NeoInputContext<NeoInputHTMLElement>>({
    // Ref
    ref,

    // Methods
    mark: ref?.mark,
    clear: ref?.clear,
    change: ref?.change,
    validate: ref?.validate,

    // State
    initial,
    value,
    touched,
    dirty,
    valid,
    readonly,
    disabled,

    // Styles
    elevation,
    hover,
    pressed,
    borderless,
    rounded,
    glass,
    start,
    skeleton,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

{#snippet prefix()}
  {#if before}
    <svelte:element
      this={beforeTag}
      bind:this={beforeRef}
      class:neo-input-before={true}
      class:neo-inside={inside}
      class:neo-inset={elevation < 0}
      class:neo-deep={elevation < -3}
      {disabled}
      {readonly}
      {...beforeProps}
    >
      {@render before(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet suffix()}
  <!--  Affix (loafing, clear, placeholder) -->
  {#if affix}
    <NeoAffix
      class={after ? 'neo-after' : undefined}
      {loading}
      {close}
      {skeleton}
      valid={validation ? valid : undefined}
      closeProps={{ onclick: onClear }}
      onclick={onFocus}
    />
  {/if}
  <!--  Suffix  -->
  {#if after}
    <svelte:element
      this={afterTag}
      class:neo-input-after={true}
      class:neo-inside={inside}
      class:neo-inset={elevation < 0}
      class:neo-deep={elevation < -3}
      {disabled}
      {readonly}
      {...afterProps}
    >
      {@render after(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet input()}
  <NeoBaseInput
    aria-describedby={messageId}
    bind:ref
    bind:files
    bind:initial
    bind:value
    bind:group
    bind:checked
    bind:indeterminate
    bind:valid
    bind:dirty
    bind:touched
    bind:focused
    bind:validationMessage
    {id}
    {disabled}
    {readonly}
    after={!!(after || affix)}
    before={!!before}
    {...rest}
  />
{/snippet}

{#snippet labelGroup()}
  {#if typeof label === 'string'}
    {label}
  {:else if label}
    {@render label(context)}
  {/if}
{/snippet}

{#snippet inputGroup()}
  <svelte:element
    this={containerTag}
    role="none"
    data-position={position}
    data-touched={touched}
    data-dirty={dirty}
    data-valid={valid}
    class:neo-input-group={true}
    class:neo-readonly={readonly}
    class:neo-pressed={pressed}
    class:neo-borderless={borderless}
    class:neo-rounded={rounded}
    class:neo-glass={glass}
    class:neo-hover={hover}
    class:neo-start={start}
    class:neo-skeleton={skeleton}
    class:neo-validation={validation}
    class:neo-disabled={disabled}
    class:neo-raised={elevation > 3 || elevation + hover > 3}
    class:neo-inset={elevation < -3 || elevation + hover < -3}
    class:neo-flat={!elevation}
    class:neo-hover-flat={hoverFlat}
    class:neo-flat-hover={flatHover}
    style:--neo-input-glass-blur={filter}
    style:--neo-input-box-shadow={boxShadow}
    style:--neo-input-hover-shadow={hoverShadow}
    style:--neo-input-label-height={labelHeight}
    style:--neo-input-label-width={labelWidth}
    style:--neo-input-before-width={beforeWidth}
    out:outFn={outProps}
    in:inFn={inProps}
    {...containerProps}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
  >
    {@render prefix()}
    {#if label}
      <NeoLabel
        {id}
        bind:ref={labelRef}
        containerProps={{
          class: [
            first ? 'neo-first' : undefined,
            before ? 'neo-before' : undefined,
            after ? 'neo-after' : undefined,
            rounded ? 'neo-rounded' : undefined,
            isFloating ? 'neo-floating' : undefined,
          ]
            .filter(Boolean)
            .join(' '),
          onclick: onFocus,
        }}
        label={labelGroup}
        required={rest.required}
        {disabled}
        {...labelProps}
      >
        {@render input()}
      </NeoLabel>
    {:else}
      {@render input()}
    {/if}
    {@render suffix()}
  </svelte:element>
{/snippet}

{#if showMessage}
  <NeoValidation
    tag={wrapperTag}
    error={errorMessage}
    {rounded}
    {context}
    {message}
    {messageId}
    {messageTag}
    {messageProps}
    in={inAction}
    out={outAction}
    transition={transitionAction}
    {...wrapperProps}
  >
    {@render inputGroup()}
  </NeoValidation>
{:else}
  {@render inputGroup()}
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-input-group,
  .neo-input-before,
  .neo-input-after {
    display: inline-flex;
    box-sizing: border-box;
    font: inherit;
    text-decoration: none;
    outline: none;
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      margin 0.3s ease,
      padding 0.3s ease,
      background-color 0.3s ease,
      backdrop-filter 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;
  }

  .neo-input {
    &-before {
      color: var(--neo-input-before-color, inherit);
      background-color: var(--neo-input-before-bg-color, transparent);
      border: none;
      border-right: var(--neo-border-width, 1px) var(--neo-input-before-border-color, transparent) solid;
      border-radius: var(--neo-input-border-radius, var(--neo-border-radius)) 0 0 var(--neo-input-border-radius, var(--neo-border-radius));
    }

    &-after {
      color: var(--neo-input-after-color, inherit);
      background-color: var(--neo-input-after-bg-color, transparent);
      border: none;
      border-left: var(--neo-border-width, 1px) var(--neo-input-after-border-color, transparent) solid;
      border-radius: 0 var(--neo-input-border-radius, var(--neo-border-radius)) var(--neo-input-border-radius, var(--neo-border-radius)) 0;
    }

    &-before,
    &-after {
      align-items: center;
      min-width: max-content;
      padding: 0.75rem;

      &:is(button, a) {
        cursor: pointer;

        &:focus-visible {
          color: var(--neo-input-focus-color, var(--neo-text-color-focused));
        }

        &:hover {
          color: var(--neo-input-hover-color, var(--neo-text-color-hover));
        }

        &:active {
          color: var(--neo-input-active-color, var(--neo-text-color-hover-active));
          scale: 0.9;
        }

        &:disabled {
          color: var(--neo-text-color-disabled);
          cursor: not-allowed;
          scale: 1;
        }
      }

      &:has(:global(.neo-button:only-child)):not(.neo-inside) {
        padding: 0 0.3rem;
      }

      :global(.neo-button) {
        --neo-btn-padding: 0.5rem 0.75rem;
        --neo-btn-margin: auto;
        --neo-btn-box-shadow-active-flat-toggle: var(--neo-box-shadow-inset-2);
        --neo-btn-bg-color: transparent;
        --neo-btn-backdrop-filter: none;
      }

      &.neo-inset :global(.neo-button) {
        --neo-btn-margin: auto 0;
      }

      &.neo-deep :global(.neo-button) {
        --neo-btn-margin: auto 0.25rem;
      }
    }

    &::placeholder {
      color: var(--neo-input-placeholder-color, var(--neo-text-color-disabled));
      transition: opacity 0.3s ease;
    }

    &:read-only {
      cursor: inherit;
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }

    &[type='password']:not(:placeholder-shown) {
      -webkit-text-stroke-width: 0.15em;
      letter-spacing: 0.2em;
    }

    &-group {
      position: relative;
      min-width: min-content;
      margin: var(--neo-shadow-margin, 0.625rem);
      padding: 0 0.1875rem;
      color: var(--neo-input-text-color, inherit);
      background-color: var(--neo-input-bg-color, inherit);
      border: var(--neo-border-width, 1px) var(--neo-input-border-color, transparent) solid;
      border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
      box-shadow: var(--neo-input-box-shadow, var(--neo-box-shadow-flat));
      cursor: var(--neo-input-cursor, text);

      &.neo-readonly {
        cursor: inherit;
      }

      &.neo-borderless {
        border-color: transparent !important;
      }

      &.neo-inset.neo-pressed,
      &.neo-raised {
        margin: var(--neo-shadow-margin-lg, 1.125rem);
      }

      &.neo-inset {
        padding: 0.25rem;
      }

      &.neo-hover.neo-flat-hover:hover,
      &.neo-hover.neo-flat-hover:focus-within,
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat:focus-within) {
        border-color: var(--neo-input-border-color, var(--neo-border-color));
      }

      &:focus-within,
      &.neo-hover:hover {
        box-shadow: var(--neo-input-hover-shadow, var(--neo-box-shadow-flat));
      }

      :global(.neo-label-container) {
        width: 100%;
        transition:
          opacity 0.3s ease,
          padding 0.3s ease,
          margin 0.3s ease;

        :global(.neo-label) {
          --neo-label-padding: 0 0.75rem;
          --neo-label-margin: 0;
          --neo-label-color: var(--neo-input-label-color, inherit);

          min-height: var(--neo-input-label-height);
          transition:
            opacity 0.3s ease,
            padding 0.3s ease,
            color 0.3s ease,
            font-size 0.3s ease,
            line-height 0.3s ease,
            top 0.3s ease,
            left 0.3s ease,
            right 0.3s ease,
            translate 0.3s ease;
        }
      }

      :global(.neo-label-container.neo-rounded:not(.neo-before)) {
        padding-left: 0.25rem;
      }

      :global(.neo-label-container.neo-first .neo-label) {
        transition: none;
      }

      :global(.neo-label-container.neo-before .neo-label) {
        padding-left: 0;
      }

      :global(.neo-label-container.neo-after .neo-label) {
        padding-right: 0;
      }

      :global(.neo-label-container.neo-floating) {
        :global(.neo-label) {
          --neo-label-color: var(--neo-input-floating-label-color, var(--neo-text-color-disabled));
          --neo-label-required-color: var(--neo-input-required-color, var(--neo-color-error-50));

          translate: 0 calc(50% + 0.7rem - var(--neo-input-label-height) / 2);
        }

        :global(.neo-input) {
          color: var(--neo-input-floating-text-color, transparent);
        }

        :global(::placeholder) {
          opacity: 0;
        }
      }

      &.neo-disabled {
        box-shadow: var(--neo-box-shadow-flat) !important;
        opacity: var(--neo-input-opacity-disabled, var(--neo-opacity-disabled));

        &:not(.neo-borderless) {
          border-color: var(--neo-input-border-color-disabled, var(--neo-border-color-disabled)) !important;
        }
      }

      :global(.neo-affix-container.neo-after) {
        min-width: 1.75rem;
        padding-right: 0;
        padding-left: 0.5rem;
      }

      &.neo-rounded {
        border-radius: var(--neo-input-border-radius-lg, var(--neo-border-radius-lg));

        :global(.neo-affix-container:not(.neo-after)) {
          margin-right: 0.25rem;
        }

        :global(.neo-label-container .neo-label) {
          padding: 0 1rem;
        }

        :global(.neo-label-container.neo-before .neo-label) {
          padding-left: 0;
        }

        :global(.neo-label-container.neo-after .neo-label) {
          padding-right: 0;
        }
      }

      &[data-position='left'] {
        --neo-input-margin-left: calc(var(--neo-shadow-margin, 0.625rem) + var(--neo-input-label-width, auto));

        margin-left: var(--neo-input-margin-left);

        :global(.neo-label-container .neo-label) {
          position: absolute;
          top: calc(50% - var(--neo-input-label-height) / 2);
          left: calc(0% - var(--neo-input-margin-left));
        }

        :global(.neo-label-container.neo-before .neo-label) {
          left: calc(0% - var(--neo-input-margin-left) - var(--neo-shadow-margin, 0.625rem));
        }

        :global(.neo-label-container.neo-floating .neo-label) {
          left: calc(0.25rem + var(--neo-input-before-width));
        }
      }

      &[data-position='right'] {
        --neo-input-margin-right: calc(var(--shadow-margin, 0.625rem) + var(--neo-input-label-width, auto));

        margin-right: var(--neo-input-margin-right);

        :global(.neo-label-container .neo-label) {
          position: absolute;
          top: calc(50% - var(--neo-input-label-height) / 2);
          right: calc(0% - var(--neo-input-margin-right));
        }

        :global(.neo-label-container.neo-before .neo-label) {
          right: calc(0% - var(--neo-input-margin-right) - var(--neo-shadow-margin, 0.625rem));
        }

        :global(.neo-label-container.neo-floating .neo-label) {
          right: calc(100% - var(--neo-input-label-width) - 0.25rem - var(--neo-input-before-width));
        }

        :global(.neo-label-container.neo-floating.neo-rounded:not(.neo-before) .neo-label) {
          right: calc(100% - var(--neo-input-label-width) - 0.75rem - var(--neo-input-before-width));
        }
      }

      &[data-position='inside'] {
        :global(.neo-label-container .neo-input) {
          padding: 0 1rem 0.5rem;
        }

        :global(.neo-label-container.neo-before .neo-input) {
          padding-left: 0;
        }

        :global(.neo-label-container.neo-after .neo-input) {
          padding-right: 0;
        }

        :global(.neo-label-container .neo-label) {
          padding: 0.75rem 1rem 0.1875rem;
          line-height: var(--neo-line-height-xs, 1rem);
        }

        :global(.neo-label-container.neo-before .neo-label) {
          padding-left: 0;
        }

        :global(.neo-label-container:not(.neo-floating) .neo-label) {
          font-size: var(--neo-font-size-sm, 0.875rem);
        }
      }

      &[data-position='top'][data-position='top'] {
        --neo-input-margin-top: calc(var(--neo-shadow-margin, 0.625rem) + var(--neo-input-label-height, var(--neo-line-height)));

        margin-top: var(--neo-input-margin-top);

        :global(.neo-label-container .neo-label) {
          position: absolute;
          top: calc(0% - var(--neo-input-margin-top));
        }
      }

      &[data-position='top'] :global(.neo-label-container.neo-floating .neo-label),
      &[data-position='left'] :global(.neo-label-container.neo-floating .neo-label),
      &[data-position='right'] :global(.neo-label-container.neo-floating .neo-label) {
        top: calc(50% - 0.75rem - var(--neo-input-label-height) / 2);
      }

      &.neo-glass {
        --neo-skeleton-color: var(--neo-glass-skeleton-color);
        --neo-border-color: var(--neo-glass-border-color);

        background-color: var(--neo-input-bg-color, var(--neo-glass-background-color));
        border-color: var(
          --neo-input-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
        backdrop-filter: var(--neo-input-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));
      }

      &.neo-validation {
        &[data-valid='false'] {
          --neo-input-label-color: var(--neo-input-label-color-error, var(--neo-color-error));
          --neo-input-floating-label-color: var(--neo-input-floating-label-color-error, var(--neo-color-error-50));
          --neo-label-disabled-color: var(--neo-input-floating-label-color-error, var(--neo-color-error-50));
        }

        &[data-valid='true'] {
          --neo-input-label-color: var(--neo-input-label-color-success, var(--neo-color-success));
          --neo-input-floating-label-color: var(--neo-input-floating-label-color-success, var(--neo-color-success-50));
          --neo-label-disabled-color: var(--neo-input-floating-label-color-success, var(--neo-color-success-50));
        }
      }

      &.neo-start {
        @starting-style {
          box-shadow: var(--neo-box-shadow-flat);

          &:not(.neo-borderless) {
            border-color: var(--neo-input-border-color, var(--neo-border-color));
          }
        }
      }

      &.neo-skeleton {
        box-shadow: var(--neo-box-shadow-flat);
        pointer-events: none;

        @include mixin.skeleton;

        &.neo-glass {
          --neo-skeleton-color: var(--neo-glass-skeleton-color);
        }
      }
    }
  }
</style>
