<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import type { PointerEventHandler } from 'svelte/elements';

  import type { NeoInputContext, NeoInputHTMLElement, NeoInputProps } from '~/inputs/common/neo-input.model.js';

  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { NeoInputLabelPosition } from '~/inputs/common/neo-input.model.js';

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
    children,

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
    afterRef = $bindable(),
    afterProps,
    afterTag = afterProps?.onclick ? 'button' : 'span',
    beforeRef = $bindable(),
    beforeProps,
    beforeTag = beforeProps?.onclick ? 'button' : 'span',
    containerRef = $bindable(),
    containerProps,
    containerTag = 'div',
    wrapperRef = $bindable(),
    wrapperProps,
    wrapperTag = 'div',
    messageProps,
    messageTag = 'div',
    ...rest
  }: NeoInputProps<NeoInputHTMLElement> = $props();
  /* eslint-enable prefer-const */

  const getValue = () => {
    if (rest?.type === 'file') return files;
    if (rest?.type === 'checkbox' || rest?.type === 'radio') return checked;
    return value;
  };

  let initial = $state(getValue());
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  const filter = $derived(computeGlassFilter(elevation, glass));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const onPointerEnter: PointerEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerProps?.onpointerenter?.(e);
  };

  const onPointerLeave: PointerEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerProps?.onpointerleave?.(e);
  };

  const typedValue = $derived(getValue());
  const hasValue = $derived.by(() => {
    if (rest?.type === 'file') return !!files?.length;
    if (rest?.type === 'checkbox' || rest?.type === 'radio') return checked !== undefined;
    if (typeof value === 'string') return !!value.length;
    return value !== undefined && value !== null;
  });

  const affix = $derived(clearable || loading !== undefined || validation);
  const close = $derived(clearable && (focused || hovered) && hasValue && !disabled && !readonly);
  const isFloating = $derived(floating && !focused && !hasValue && !disabled && !readonly);
  const inside = $derived(position === NeoInputLabelPosition.Inside && label);

  const onClear = () => {
    if (disabled || readonly) return;
    ref?.clear?.();
  };

  const onFocus = () => {
    if (focused || disabled || readonly) return;
    ref?.focus();
  };

  const onLabelClick = () => {
    if (disabled || readonly || rest.type !== 'select') return;
    ref?.showPicker?.();
  };

  let first = $state(true);
  // Skip enter transition on first render for floating label
  const waitForTick = async () => {
    if (!first) return;
    await wait();
    first = false;
  };

  let affixRef = $state<HTMLElement>();
  let affixWidth = $state<string>();
  let afterWidth = $state<string>();
  let beforeWidth = $state<string>();
  let labelWidth = $state<string>();
  let labelHeight = $state<string>();

  const updateRefs = () => {
    labelHeight = `${labelRef?.clientHeight ?? 0}px`;
    labelWidth = `${labelRef?.clientWidth ?? 0}px`;
    beforeWidth = `${beforeRef?.clientWidth ?? 0}px`;
    afterWidth = `${afterRef?.clientWidth ?? 0}px`;
    affixWidth = `${affixRef?.clientWidth ?? 0}px`;
  };

  $effect(() => {
    if (first) waitForTick();
    updateRefs();
  });

  let visible = $state(false);
  let messageId = $state(`neo-textarea-message-${crypto.randomUUID()}`);

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
    value: typedValue,
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
      class:neo-pressed={pressed}
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
      bind:ref={affixRef}
      class={[after ? 'neo-after' : undefined, rest.type === 'select' ? 'neo-select' : undefined]}
      {loading}
      {close}
      {disabled}
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
      bind:this={afterRef}
      class:neo-input-after={true}
      class:neo-inside={inside}
      class:neo-pressed={pressed}
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
    aria-invalid={valid === undefined ? undefined : !valid}
    aria-describedby={visible ? messageId : undefined}
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
  >
    {@render children?.(context)}
  </NeoBaseInput>
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
    bind:this={containerRef}
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
    class:neo-hovered={hovered}
    class:neo-floating={floating}
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
    style:--neo-input-after-width={afterWidth}
    style:--neo-input-affix-width={affixWidth}
    out:outFn={outProps}
    in:inFn={inProps}
    {...containerProps}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
  >
    {@render prefix()}
    {#if label}
      <NeoLabel
        for={id}
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
        onclick={onLabelClick}
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

<NeoInputValidation
  bind:ref={wrapperRef}
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
>
  {@render inputGroup()}
</NeoInputValidation>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-input-group,
  .neo-input-before,
  .neo-input-after {
    display: inline-flex;
    box-sizing: border-box;
    min-width: min-content;
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
      padding: var(--neo-input-before-padding, 0.75rem);
      color: var(--neo-input-before-color, inherit);
      background-color: var(--neo-input-before-bg-color, transparent);
      border: none;
      border-right: var(--neo-border-width, 1px) var(--neo-input-before-border-color, transparent) solid;
      border-radius: var(--neo-input-border-radius, var(--neo-border-radius)) 0 0 var(--neo-input-border-radius, var(--neo-border-radius));
    }

    &-after {
      padding: var(--neo-input-after-padding, 0.75rem);
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
        padding: 0 0.25rem;
      }

      :global(.neo-button) {
        --neo-btn-padding: 0.5rem 0.75rem;
        --neo-btn-margin: auto;
        --neo-btn-min-width: 2.375rem;
        --neo-btn-box-shadow-active-flat-toggle: var(--neo-box-shadow-inset-2);
        --neo-btn-bg-color: transparent;
        --neo-btn-backdrop-filter: none;
      }

      &.neo-inset :global(.neo-button) {
        --neo-btn-margin: auto 0;
        --neo-btn-padding-empty: 0.375rem;
      }

      &.neo-inset.neo-pressed :global(.neo-button) {
        --neo-input-icon-scale: 1;
      }

      &.neo-deep :global(.neo-button) {
        --neo-btn-margin: auto 0.25rem;
      }
    }

    &-group {
      position: relative;
      margin: var(--neo-shadow-margin, 0.625rem);
      padding: 0 0.1875rem;
      color: var(--neo-input-text-color, inherit);
      background-color: var(--neo-input-bg-color, inherit);
      border: var(--neo-input-border-width, var(--neo-border-width, 1px)) var(--neo-input-border-color, transparent) solid;
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

      &.neo-hover.neo-flat-hover.neo-hovered,
      &.neo-hover.neo-flat-hover:hover,
      &.neo-hover.neo-flat-hover:focus-within,
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
        border-color: var(--neo-input-border-color, var(--neo-border-color));
      }

      &:focus-within,
      &.neo-hover:hover,
      &.neo-hover.neo-hovered {
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

      :global(.neo-affix-container.neo-select) {
        margin-left: 0.5rem;
      }

      :global(.neo-affix-container.neo-select.neo-after) {
        margin-right: -0.375rem;
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
        --neo-input-margin-left: calc(var(--neo-shadow-margin, 0.625rem) * 2 + var(--neo-input-label-width, auto));

        margin-left: var(--neo-input-margin-left);

        :global(.neo-label-container .neo-label) {
          position: absolute;
          top: calc(50% - var(--neo-input-label-height) / 2);
          left: calc(0% - var(--neo-input-margin-left));
        }

        :global(.neo-label-container.neo-before .neo-label) {
          left: calc(0% - var(--neo-input-margin-left));
        }

        :global(.neo-label-container.neo-floating .neo-label) {
          left: calc(0.25rem + var(--neo-input-before-width));
        }
      }

      &[data-position='right'] {
        --neo-input-margin-right: calc(var(--neo-shadow-margin, 0.625rem) * 2 + var(--neo-input-label-width, auto));

        margin-right: var(--neo-input-margin-right);

        :global(.neo-label-container .neo-label) {
          position: absolute;
          top: calc(50% - var(--neo-input-label-height) / 2);
          right: calc(0% - var(--neo-input-margin-right));
        }

        :global(.neo-label-container.neo-before .neo-label) {
          right: calc(0% - var(--neo-input-margin-right));
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

        :global(.neo-label-container.neo-floating .neo-label) {
          translate: 0 calc(50% - ((0.75rem - 0.1875rem) / 2));
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

        &:not(.neo-floating) :global(.neo-label-container .neo-label) {
          left: 0;
          padding: var(--neo-label-padding, 0 1rem);
        }
      }

      &[data-position='top'],
      &[data-position='left'],
      &[data-position='right'] {
        :global(.neo-label-container.neo-floating .neo-label) {
          top: calc(50% - var(--neo-input-label-height) / 2);
        }

        &.neo-floating {
          --neo-input-min-width: var(--neo-input-label-width);
          --neo-input-min-height: var(--neo-input-label-height);
          --neo-label-max-width: calc(100% - var(--neo-input-after-width) - var(--neo-input-before-width) - var(--neo-input-affix-width));
        }
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
      }
    }
  }
</style>
