<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';
  import { fade } from 'svelte/transition';

  import IconAlert from '~/icons/IconAlert.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconConfirm from '~/icons/IconConfirm.svelte';
  import {
    type NeoInputContext,
    NeoInputLabelPosition,
    type NeoInputMethods,
    type NeoInputProps,
    type NeoInputState,
  } from '~/input/neo-input.model.js';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeGlassFilter, computeHoverShadowElevation, computeShadowElevation } from '~/utils/shadow.utils.js';
  import { enterDefaultTransition, leaveDefaultTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    prefix,
    suffix,
    message,
    error,

    // States
    id = label ? `neo-input-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    loading,
    clearable,
    dirtyOnInput,
    validateOnInput,
    position = NeoInputLabelPosition.Inside,

    // Styles
    elevation = 3,
    hover = -1,
    borderless,
    rounded,
    glass,
    start,
    floating = true,
    skeleton,
    validation,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    oninput,
    onfocus,
    onblur,
    onmark,
    onclear,
    onchange,
    oninvalid,

    // Other props
    labelRef = $bindable(),
    labelProps,
    suffixProps,
    suffixTag = suffixProps?.onclick ? 'button' : 'span',
    prefixProps,
    prefixTag = prefixProps?.onclick ? 'button' : 'span',
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
  let validationMessage = $state('');

  const filter = $derived.by(() => computeGlassFilter(elevation, glass));
  const boxShadow = $derived.by(() => computeShadowElevation(elevation, glass));
  const hoverShadow = $derived.by(() => computeHoverShadowElevation(elevation, hover, glass) ?? boxShadow);

  const hoverFlat = $derived(boxShadow.endsWith('flat') && !hoverShadow.endsWith('flat'));
  const flatHover = $derived(hoverShadow.endsWith('flat') && !boxShadow.endsWith('flat'));

  let hovered = $state(false);
  const onMouseEnter = (e: MouseEvent) => {
    hovered = true;
    containerProps?.onmouseenter?.(e);
  };

  const onMouseLeave = (e: MouseEvent) => {
    hovered = false;
    containerProps?.onmouseleave?.(e);
  };

  let focused = $state(false);
  const onFocus = (e: FocusEvent) => {
    focused = true;
    touched = true;
    onfocus?.(e);
  };

  const onBlur = (e: FocusEvent) => {
    focused = false;
    onblur?.(e);
  };

  const checkValidity = (update: { dirty?: boolean; valid?: boolean } = { dirty: true, valid: true }) => {
    if (update.dirty) dirty = value !== initial;
    if (!update.valid) return;
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
  };

  const onInput = (e: InputEvent) => {
    checkValidity({ dirty: dirtyOnInput, valid: validateOnInput });
    oninput?.(e);
  };

  const onChange = (e: InputEvent) => {
    checkValidity();
    onchange?.(e);
  };

  const onInvalid = (e: InputEvent) => {
    valid = false;
    validationMessage = ref?.validationMessage;
    e.preventDefault();
    oninvalid?.(e);
  };

  /**
   * Change the state of the input
   * @param state
   */
  export const mark: NeoInputMethods['mark'] = (state: NeoInputState) => {
    if (state.touched !== undefined) touched = state.touched;
    if (state.valid !== undefined) valid = state.valid;
    if (state.dirty === undefined) return onmark?.({ touched, dirty, valid });
    dirty = state.dirty;
    if (!dirty) initial = value;
    return onmark?.({ touched, dirty, valid });
  };

  const focus = () => {
    if (focused) return;
    ref?.focus();
  };

  /**
   * Clear the input state
   */
  export const clear: NeoInputMethods['clear'] = (state?: NeoInputState) => {
    value = '';
    focus();
    if (!state) {
      setTimeout(() => checkValidity());
      return onclear?.({ touched, dirty, valid });
    }
    initial = value;
    setTimeout(() => mark({ touched: false, dirty: false, ...state }));
    return onclear?.({ touched, dirty, valid });
  };

  const affix = $derived(clearable || loading !== undefined || validation);
  const close = $derived(clearable && (focused || hovered) && value?.length && !rest?.disabled && !rest?.readonly);
  const isFloating = $derived(floating && !focused && !value?.length && !rest?.disabled && !rest?.readonly);

  let labelHeight = $state();
  let labelWidth = $state();

  let first = $state(true);
  // Skip enter transition on first render for floating label
  const waitForTick = async () => {
    if (!first) return;
    await wait();
    first = false;
  };

  $effect(() => {
    if (first) waitForTick();
    if (!labelRef) return;
    if (position === NeoInputLabelPosition.Inside && !floating) return;
    labelHeight = `${labelRef?.clientHeight ?? 0}px`;
    if (![NeoInputLabelPosition.Left, NeoInputLabelPosition.Right].includes(position)) return;
    labelWidth = `${labelRef?.clientWidth ?? 0}px`;
  });

  const errorMessage = $derived.by(() => {
    if (valid || valid === undefined) return;
    if (error) return error;
    if (!validation) return;
    return error ?? validationMessage;
  });

  const showMessage = $derived(message || errorMessage || error || validation);
  const messageId = $derived(showMessage ? (messageProps?.id ?? `neo-input-message-${crypto.randomUUID()}`) : undefined);

  const context: NeoInputContext = $derived({
    // Ref
    ref,

    // Methods
    mark,
    clear,

    // State
    touched,
    dirty,
    valid,

    // Styles
    elevation,
    hover,
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

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#snippet before()}
  {#if prefix}
    <svelte:element this={prefixTag} class:neo-input-prefix={true} disabled={rest?.disabled} {...prefixProps}>
      {@render prefix(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet after()}
  {#if affix}
    <span class="neo-input-affix" class:suffix role="none" onclick={focus}>
      {#if loading}
        <span out:fade={enterDefaultTransition}>
          <IconCircleLoading width="100%" height="100%" />
        </span>
      {:else if close}
        <button class="neo-input-clear" aria-label="clear" in:fade out:fade={enterDefaultTransition} onclick={() => clear()}>
          <IconClear width="100%" height="100%" />
        </button>
      {:else}
        <span class="neo-input-affix-validation" in:fade={leaveDefaultTransition}>
          {#if validation && valid === false}
            <IconAlert width="100%" height="100%" />
          {:else if validation && valid === true && touched}
            <IconConfirm width="100%" height="100%" />
          {/if}
        </span>
      {/if}
    </span>
  {/if}
  {#if suffix}
    <svelte:element this={suffixTag} class:neo-input-suffix={true} disabled={rest?.disabled} {...suffixProps}>
      {@render suffix(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet input()}
  <input
    {id}
    aria-invalid={valid === undefined ? undefined : !valid}
    aria-describedby={messageId}
    bind:this={ref}
    bind:value
    class:neo-input={true}
    class:suffix={suffix || affix}
    class:prefix
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    {...rest}
  />
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
    class:read-only={rest?.readonly}
    class:borderless
    class:rounded
    class:glass
    class:hover
    class:start
    class:skeleton
    class:validation
    class:disabled={rest?.disabled}
    class:raised={elevation > 3 || elevation + hover > 3}
    class:inset={elevation < -3 || elevation + hover < -3}
    class:flat={!elevation}
    class:hover-flat={hoverFlat}
    class:flat-hover={flatHover}
    style:--neo-input-glass-blur={filter}
    style:--neo-input-box-shadow={boxShadow}
    style:--neo-input-hover-shadow={hoverShadow}
    style:--neo-input-label-height={labelHeight}
    style:--neo-input-label-width={labelWidth}
    use:useFn={useProps}
    out:outFn={outProps}
    in:inFn={inProps}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
    {...containerProps}
  >
    {@render before()}
    {#if label}
      <div class="neo-input-label-container" class:prefix class:floating={isFloating} role="none" onclick={focus}>
        <label
          bind:this={labelRef}
          for={id}
          class:neo-input-label={true}
          class:first
          class:prefix
          class:rounded
          class:required={rest.required}
          {...labelProps}
        >
          {#if typeof label === 'string'}
            {label}
          {:else}
            {@render label()}
          {/if}
        </label>
        {@render input()}
      </div>
    {:else}
      {@render input()}
    {/if}
    {@render after()}
  </svelte:element>
{/snippet}

{#if showMessage}
  <svelte:element this={wrapperTag} class:neo-input-group-wrapper={true} out:outFn={outProps} in:inFn={inProps} {...wrapperProps}>
    {@render inputGroup()}
    <div class="neo-input-message" class:rounded>
      {#if errorMessage}
        <svelte:element
          this={messageTag}
          id={messageId}
          class:neo-input-error={true}
          in:fade={enterDefaultTransition}
          out:fade={leaveDefaultTransition}
          {...messageProps}
        >
          {#if typeof errorMessage === 'string'}{errorMessage}{:else}{@render errorMessage()}{/if}
        </svelte:element>
      {:else if message}
        <svelte:element
          this={messageTag}
          id={messageId}
          class:neo-input-description={true}
          in:fade={enterDefaultTransition}
          out:fade={leaveDefaultTransition}
          {...messageProps}
        >
          {#if typeof message === 'string'}{message}{:else}{@render message()}{/if}
        </svelte:element>
      {/if}
    </div>
  </svelte:element>
{:else}
  {@render inputGroup()}
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-input-group,
  .neo-input,
  .neo-input-clear,
  .neo-input-affix,
  .neo-input-prefix,
  .neo-input-suffix {
    display: flex;
    box-sizing: border-box;
    text-decoration: none;
    outline: none;
    transition:
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
    flex: 1 1 auto;
    align-self: center;
    padding: 0.75rem;
    color: inherit;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    outline: none;

    &-prefix,
    &-suffix,
    &-affix {
      align-items: center;
    }

    &-prefix {
      color: var(--neo-input-prefix-color, inherit);
      background-color: var(--neo-input-prefix-bg-color, transparent);
      border: none;
      border-right: var(--neo-border-width, 1px) var(--neo-input-prefix-border-color, transparent) solid;
      border-radius: var(--neo-input-border-radius, var(--neo-border-radius)) 0 0 var(--neo-input-border-radius, var(--neo-border-radius));
    }

    &.prefix {
      margin-left: -0.9rem;
    }

    &.suffix {
      margin-right: -0.9rem;
    }

    &-suffix {
      color: var(--neo-input-suffix-color, inherit);
      background-color: var(--neo-input-suffix-bg-color, transparent);
      border: none;
      border-left: var(--neo-border-width, 1px) var(--neo-input-suffix-border-color, transparent) solid;
      border-radius: 0 var(--neo-input-border-radius, var(--neo-border-radius)) var(--neo-input-border-radius, var(--neo-border-radius)) 0;
    }

    &-affix {
      display: inline-grid;
      grid-template-areas: 'affix';
      width: calc(var(--neo-line-height) + 1rem);
      min-height: calc(var(--neo-line-height) + 1rem);
      padding: 0.75rem;
      border: none;
      border-left: var(--neo-border-width, 1px) var(--neo-input-suffix-border-color, transparent) solid;

      > * {
        grid-area: affix;
      }

      &-validation {
        width: 100%;
        height: 100%;
      }

      &.suffix {
        width: calc(var(--neo-line-height) + 0.5rem);
        margin-right: -0.15rem;
        padding-right: 0;
      }
    }

    &::placeholder {
      color: var(--neo-input-placeholder-color, var(--neo-text-color-disabled));
      transition: opacity 0.3s ease;
    }

    &:read-only {
      cursor: initial;
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }
  }

  %neo-input-button {
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

  .neo-input-clear {
    @extend %neo-input-button;

    width: 1.25rem;
    height: 1.25rem;
    color: var(--neo-input-clear-color, inherit);
    background-color: var(--neo-background-color-darker);
    border: none;
    border-radius: 50%;

    &:focus-visible {
      color: var(--neo-close-color-focused, rgb(255 0 0 / 75%));
      background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
    }

    &:hover {
      color: var(--neo-color-warning, rgb(255 0 0 / 75%));
      background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }
  }

  .neo-input-prefix,
  .neo-input-suffix {
    padding: 0.75rem;

    &:is(button, a) {
      @extend %neo-input-button;
    }
  }

  .neo-input-label-container {
    flex: 1 1 auto;

    .neo-input-label {
      display: flex;
      min-height: var(--neo-input-label-height);
      padding: 0 0.75rem;
      overflow: hidden;
      color: var(--neo-input-label-color, inherit);
      text-wrap: stable;
      text-overflow: ellipsis;
      cursor: inherit;
      transition:
        padding 0.3s ease,
        color 0.3s ease,
        font-size 0.3s ease,
        line-height 0.3s ease,
        top 0.3s ease,
        left 0.3s ease,
        right 0.3s ease,
        translate 0.3s ease;

      &.first {
        transition: none;
      }

      &.required::after {
        margin-left: 0.1rem;
        color: var(--neo-input-required-color, var(--neo-color-error-75));
        font-size: var(--neo-font-size);
        content: '*';
      }
    }

    &.floating {
      .neo-input-label {
        color: var(--neo-input-floating-label-color, var(--neo-text-color-disabled));
        translate: 0 calc(50% + 0.75rem - var(--neo-input-label-height) / 2);

        &.required::after {
          color: var(--neo-input-required-color, var(--neo-color-error-50));
        }
      }

      ::placeholder {
        opacity: 0;
      }
    }
  }

  .neo-input-group {
    position: relative;
    margin: var(--neo-shadow-margin, 0.6rem);
    color: var(--neo-input-text-color, inherit);
    background-color: var(--neo-input-bg-color, inherit);
    border: var(--neo-border-width, 1px) var(--neo-input-border-color, transparent) solid;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-input-box-shadow, var(--neo-box-shadow-flat));
    cursor: text;

    &.read-only {
      cursor: initial;
    }

    &.borderless {
      border-color: transparent !important;
    }

    &.raised {
      margin: var(--neo-shadow-margin-lg, 1.125rem);
    }

    &.inset {
      padding: 0.25rem;
    }

    &.hover.flat-hover:hover,
    &.hover.flat-hover:focus-within,
    &.flat:not(.borderless, .hover-flat:hover, .hover-flat:focus-within) {
      border-color: var(--neo-input-border-color, var(--neo-border-color));
    }

    &:focus-within,
    &.hover:hover {
      box-shadow: var(--neo-input-hover-shadow, var(--neo-box-shadow-flat));
    }

    &.disabled {
      box-shadow: var(--neo-box-shadow-flat) !important;
      opacity: var(--neo-input-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.borderless) {
        border-color: var(--neo-btn-border-color-disabled, var(--neo-border-color-disabled)) !important;
      }

      .neo-input-label {
        color: unset;
      }
    }

    &.rounded {
      border-radius: var(--neo-border-radius-lg, 2rem);

      .neo-input {
        padding: 0.75rem 1rem;
        border-radius: var(--neo-border-radius-lg, 2rem);

        &.prefix {
          margin-left: -1.25rem;
        }

        &-prefix {
          padding: 0.75rem 0.75rem 0.75rem 1rem;
        }

        &.suffix {
          margin-right: -1.25rem;
        }

        &-suffix {
          padding: 0.75rem 1rem 0.75rem 0.75rem;
        }

        &-affix:not(.suffix) {
          width: calc(var(--neo-line-height) + 1.25rem);
          padding-right: 0.75rem;
        }
      }

      .neo-input-label-container {
        &:not(.prefix) {
          padding-left: 0.5rem;
        }

        .neo-input-label {
          padding: 0 1rem;
        }
      }
    }

    &[data-position='top'] {
      --neo-input-margin-top: calc(var(--neo-shadow-margin, 0.6rem) + var(--neo-input-label-height, var(--neo-line-height)));

      margin-top: var(--neo-input-margin-top);

      .neo-input-label-container .neo-input-label {
        position: absolute;
        top: calc(0% - var(--neo-input-margin-top));
      }
    }

    &[data-position='left'] {
      --neo-input-margin-left: calc(var(--neo-shadow-margin, 0.6rem) + var(--neo-input-label-width, auto));

      margin-left: var(--neo-input-margin-left);

      .neo-input-label-container .neo-input-label {
        position: absolute;
        top: calc(50% - var(--neo-input-label-height) / 2);
        left: calc(0% - var(--neo-input-margin-left));
      }
    }

    &[data-position='right'] {
      --neo-input-margin-right: calc(var(--shadow-margin, 0.6rem) + var(--neo-input-label-width, auto));

      margin-right: var(--neo-input-margin-right);

      .neo-input-label-container .neo-input-label {
        position: absolute;
        top: calc(50% - var(--neo-input-label-height) / 2);
        right: calc(0% - var(--neo-input-margin-right));
      }
    }

    &[data-position='inside'] .neo-input-label-container {
      .neo-input {
        padding: 0 1rem 0.5rem;
      }

      .neo-input-label {
        padding: 0.5rem 1rem 0.1rem;
        line-height: var(--neo-line-height-xs, 1rem);

        &.prefix {
          padding-left: 0.15rem;
        }
      }

      &:not(.floating) .neo-input-label {
        font-size: var(--neo-font-size-sm, 0.875rem);
      }
    }

    &[data-position='top'] .neo-input-label-container.floating .neo-input-label,
    &[data-position='left'] .neo-input-label-container.floating .neo-input-label,
    &[data-position='right'] .neo-input-label-container.floating .neo-input-label {
      top: calc(50% - 0.75rem - var(--neo-input-label-height) / 2);
    }

    &[data-position='left'] .neo-input-label-container.floating .neo-input-label {
      left: 0.5rem;
    }

    &[data-position='right'] .neo-input-label-container.floating .neo-input-label {
      right: calc(100% - var(--neo-input-label-width) - 0.5rem);
    }

    &.glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);

      background-color: var(--neo-input-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-input-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-input-glass-blur, var(--neo-blur-4) var(--neo-saturate-2));
    }

    &.validation {
      &[data-valid='false'] {
        .neo-input-affix-validation {
          color: var(--neo-input-validation-color-error, var(--neo-color-error));
        }

        --neo-input-label-color: var(--neo-input-label-color-error, var(--neo-color-error));
        --neo-input-floating-label-color: var(--neo-input-floating-label-color-error, var(--neo-color-error-50));
      }

      &[data-valid='true'] {
        .neo-input-affix-validation {
          color: var(--neo-input-validation-color-success, var(--neo-color-success));
        }

        --neo-input-label-color: var(--neo-input-label-color-success, var(--neo-color-success));
        --neo-input-floating-label-color: var(--neo-input-floating-label-color-success, var(--neo-color-success-50));
      }
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless) {
          border-color: var(--neo-input-border-color, var(--neo-border-color));
        }
      }
    }

    &.skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;

      &.glass {
        --neo-skeleton-color: var(--neo-glass-skeleton-color);
      }
    }
  }

  .neo-input-group-wrapper {
    .neo-input-message {
      min-height: var(--neo-line-height-sm, 1.25rem);
      margin: 0.25rem var(--neo-shadow-margin, 0.6rem) var(--neo-shadow-margin, 0.6rem);
      font-size: var(--neo-font-size-sm, 0.875rem);
      line-height: var(--neo-line-height-xs, 1rem);
      transition:
        color 0.3s ease,
        padding 0.3s ease,
        margin 0.3s ease;

      .neo-input-error {
        color: var(--neo-input-error-color, var(--neo-color-error));
      }

      .neo-input-error,
      .neo-input-description {
        padding: 0 0.75rem;
      }

      &.rounded {
        margin: 0.25rem var(--neo-shadow-margin-lg, 1.125rem) var(--neo-shadow-margin-lg, 1.125rem);

        .neo-input-error,
        .neo-input-description {
          padding: 0 1rem;
        }
      }
    }
  }
</style>
