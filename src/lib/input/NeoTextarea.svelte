<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';
  import { fade } from 'svelte/transition';

  import IconAlert from '~/icons/IconAlert.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconConfirm from '~/icons/IconConfirm.svelte';
  import NeoValidation from '~/input/NeoValidation.svelte';
  import {
    type NeoInputContext,
    NeoInputLabelPosition,
    type NeoInputMethods,
    type NeoInputState,
    type NeoTextareaProps,
  } from '~/input/neo-input.model.js';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeGlassFilter, computeHoverShadowElevation, computeShadowElevation } from '~/utils/shadow.utils.js';
  import { enterDefaultTransition, leaveDefaultTransition } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
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
    containerProps,
    containerTag = 'div',
    wrapperProps,
    wrapperTag = 'div',
    messageProps,
    messageTag = 'div',
    ...rest
  }: NeoTextareaProps = $props();
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
  const messageId = $derived(showMessage ? (messageProps?.id ?? `neo-textarea-message-${crypto.randomUUID()}`) : undefined);

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

{#snippet after()}
  <!--  Affix (loafing, clear, placeholder) -->
  {#if affix}
    <span class="neo-textarea-affix" role="none" onclick={focus}>
      {#if loading}
        <span out:fade={enterDefaultTransition}>
          <IconCircleLoading width="1.1875rem" height="1.1875rem" />
        </span>
      {:else if close}
        <button class="neo-textarea-clear" aria-label="clear" in:fade out:fade={enterDefaultTransition} onclick={() => clear()}>
          <IconClear width="1.1875rem" height="1.1875rem" />
        </button>
      {:else}
        <span class="neo-textarea-affix-validation" in:fade={leaveDefaultTransition}>
          {#if validation && valid === false}
            <IconAlert width="1.1875rem" height="1.1875rem" />
          {:else if validation && valid === true && touched}
            <IconConfirm width="1.1875rem" height="1.1875rem" />
          {/if}
        </span>
      {/if}
    </span>
  {/if}
{/snippet}

{#snippet textarea()}
  <textarea
    {id}
    aria-invalid={valid === undefined ? undefined : !valid}
    aria-describedby={messageId}
    bind:this={ref}
    bind:value
    class:neo-textarea={true}
    class:affix
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  >
  </textarea>
{/snippet}

{#snippet textareaGroup()}
  <svelte:element
    this={containerTag}
    role="none"
    data-position={position}
    data-touched={touched}
    data-dirty={dirty}
    data-valid={valid}
    class:neo-textarea-group={true}
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
    style:--neo-textarea-glass-blur={filter}
    style:--neo-textarea-box-shadow={boxShadow}
    style:--neo-textarea-hover-shadow={hoverShadow}
    style:--neo-textarea-label-height={labelHeight}
    style:--neo-textarea-label-width={labelWidth}
    out:outFn={outProps}
    in:inFn={inProps}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
    {...containerProps}
  >
    {#if label}
      <div class="neo-textarea-label-container" class:floating={isFloating} role="none" onclick={focus}>
        <label bind:this={labelRef} for={id} class:neo-textarea-label={true} class:first class:rounded class:required={rest.required} {...labelProps}>
          {#if typeof label === 'string'}
            {label}
          {:else}
            {@render label()}
          {/if}
        </label>
        {@render textarea()}
      </div>
    {:else}
      {@render textarea()}
    {/if}
    {@render after()}
  </svelte:element>
{/snippet}

{#if showMessage}
  <NeoValidation
    tag={wrapperTag}
    error={errorMessage}
    {context}
    {message}
    {messageId}
    {messageTag}
    {messageProps}
    in={inAction}
    out={outAction}
    transiton={transitionAction}
    {...wrapperProps}
  >
    {@render textareaGroup()}
  </NeoValidation>
{:else}
  {@render textareaGroup()}
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-textarea-group,
  .neo-textarea,
  .neo-textarea-clear,
  .neo-textarea-affix {
    display: flex;
    box-sizing: border-box;
    font: inherit;
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

  .neo-textarea {
    flex: 1 1 auto;
    align-self: center;
    min-width: fit-content;
    max-width: 100%;
    min-height: fit-content;
    padding: 0.75rem;
    color: inherit;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-textarea-border-radius, var(--neo-border-radius));
    outline: none;

    &.affix {
      padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    }

    &-affix {
      position: absolute;
      top: 0.125rem;
      right: 0.125rem;
      display: inline-grid;
      grid-template-areas: 'affix';
      align-items: center;
      min-width: 2.75rem;
      min-height: calc(var(--neo-line-height) + 1rem);
      padding: 0.75rem;
      border: none;
      border-left: var(--neo-border-width, 1px) var(--neo-textarea-affix-border-color, transparent) solid;

      > * {
        grid-area: affix;
      }

      &-validation {
        width: 100%;
        height: 100%;
      }
    }

    &::placeholder {
      color: var(--neo-textarea-placeholder-color, var(--neo-text-color-disabled));
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

  %neo-textarea-button {
    cursor: pointer;

    &:focus-visible {
      color: var(--neo-textarea-focus-color, var(--neo-text-color-focused));
    }

    &:hover {
      color: var(--neo-textarea-hover-color, var(--neo-text-color-hover));
    }

    &:active {
      color: var(--neo-textarea-active-color, var(--neo-text-color-hover-active));
      scale: 0.9;
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
      scale: 1;
    }
  }

  .neo-textarea-clear {
    @extend %neo-textarea-button;

    align-items: center;
    justify-content: center;
    color: var(--neo-textarea-clear-color, inherit);
    background-color: var(--neo-background-color-darker);
    border: none;
    border-radius: 50%;
    aspect-ratio: 1;

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

  .neo-textarea-label-container {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    width: 100%;

    .neo-textarea-label {
      display: flex;
      min-height: var(--neo-textarea-label-height);
      padding: 0 0.75rem;
      overflow: hidden;
      color: var(--neo-textarea-label-color, inherit);
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
        color: var(--neo-textarea-required-color, var(--neo-color-error-75));
        font-size: var(--neo-font-size);
        content: '*';
      }
    }

    &.floating {
      .neo-textarea-label {
        color: var(--neo-textarea-floating-label-color, var(--neo-text-color-disabled));
        translate: 0 calc(50% + 0.7rem - var(--neo-textarea-label-height) / 2);

        &.required::after {
          color: var(--neo-textarea-required-color, var(--neo-color-error-50));
        }
      }

      ::placeholder {
        opacity: 0;
      }
    }
  }

  .neo-textarea-group {
    position: relative;
    margin: var(--neo-shadow-margin, 0.6rem);
    color: var(--neo-textarea-text-color, inherit);
    background-color: var(--neo-textarea-bg-color, inherit);
    border: var(--neo-border-width, 1px) var(--neo-textarea-border-color, transparent) solid;
    border-radius: var(--neo-textarea-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-textarea-box-shadow, var(--neo-box-shadow-flat));
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
      border-color: var(--neo-textarea-border-color, var(--neo-border-color));
    }

    &:focus-within,
    &.hover:hover {
      box-shadow: var(--neo-textarea-hover-shadow, var(--neo-box-shadow-flat));
    }

    &.disabled {
      box-shadow: var(--neo-box-shadow-flat) !important;
      opacity: var(--neo-textarea-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.borderless) {
        border-color: var(--neo-btn-border-color-disabled, var(--neo-border-color-disabled)) !important;
      }

      .neo-textarea-label {
        color: unset;
      }
    }

    &.rounded {
      border-radius: var(--neo-border-radius-lg, 2rem);

      .neo-textarea {
        padding: 0.75rem 1rem;
        border-radius: var(--neo-border-radius-lg, 2rem);

        &.affix {
          padding: 0.75rem 2.75rem 0.75rem 1rem;
        }

        &-affix {
          right: 0.365rem;
        }
      }

      .neo-textarea-label-container {
        padding-left: 0.5rem;

        .neo-textarea-label {
          padding: 0 1rem;
        }
      }
    }

    &[data-position='top'] {
      --neo-textarea-margin-top: calc(var(--neo-shadow-margin, 0.6rem) + var(--neo-textarea-label-height, var(--neo-line-height)));

      margin-top: var(--neo-textarea-margin-top);

      .neo-textarea-label-container .neo-textarea-label {
        position: absolute;
        top: calc(0% - var(--neo-textarea-margin-top));
      }
    }

    &[data-position='left'] {
      --neo-textarea-margin-left: calc(var(--neo-shadow-margin, 0.6rem) + var(--neo-textarea-label-width, auto));

      margin-left: var(--neo-textarea-margin-left);

      .neo-textarea-label-container .neo-textarea-label {
        position: absolute;
        top: 0.75rem;
        left: calc(0% - var(--neo-textarea-margin-left));
      }
    }

    &[data-position='right'] {
      --neo-textarea-margin-right: calc(var(--shadow-margin, 0.6rem) + var(--neo-textarea-label-width, auto));

      margin-right: var(--neo-textarea-margin-right);

      .neo-textarea-label-container .neo-textarea-label {
        position: absolute;
        top: 0.75rem;
        right: calc(0% - var(--neo-textarea-margin-right));
      }
    }

    &[data-position='inside'] .neo-textarea-label-container {
      .neo-textarea {
        padding: 0 1rem 0.5rem;
      }

      .neo-textarea-label {
        padding: 0.75rem 1rem 0.2rem;
        line-height: var(--neo-line-height-xs, 1rem);
      }

      &:not(.floating) .neo-textarea-label {
        font-size: var(--neo-font-size-sm, 0.875rem);
      }
    }

    &[data-position='top'] .neo-textarea-label-container.floating .neo-textarea-label,
    &[data-position='left'] .neo-textarea-label-container.floating .neo-textarea-label,
    &[data-position='right'] .neo-textarea-label-container.floating .neo-textarea-label {
      top: 0;
    }

    &[data-position='left'] .neo-textarea-label-container.floating .neo-textarea-label {
      left: 0.5rem;
    }

    &[data-position='right'] .neo-textarea-label-container.floating .neo-textarea-label {
      right: calc(100% - var(--neo-textarea-label-width) - 0.5rem);
    }

    &.glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);

      background-color: var(--neo-textarea-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-textarea-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-textarea-glass-blur, var(--neo-blur-4) var(--neo-saturate-2));
    }

    &.validation {
      &[data-valid='false'] {
        --neo-textarea-label-color: var(--neo-textarea-label-color-error, var(--neo-color-error));
        --neo-textarea-floating-label-color: var(--neo-textarea-floating-label-color-error, var(--neo-color-error-50));

        .neo-textarea-affix-validation {
          color: var(--neo-textarea-validation-color-error, var(--neo-color-error));
        }
      }

      &[data-valid='true'] {
        --neo-textarea-label-color: var(--neo-textarea-label-color-success, var(--neo-color-success));
        --neo-textarea-floating-label-color: var(--neo-textarea-floating-label-color-success, var(--neo-color-success-50));

        .neo-textarea-affix-validation {
          color: var(--neo-textarea-validation-color-success, var(--neo-color-success));
        }
      }
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless) {
          border-color: var(--neo-textarea-border-color, var(--neo-border-color));
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
</style>
