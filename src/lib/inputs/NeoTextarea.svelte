<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import type { EventHandler, FocusEventHandler, FormEventHandler, MouseEventHandler } from 'svelte/elements';

  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoAffix from '~/inputs/NeoAffix.svelte';
  import NeoLabel from '~/inputs/NeoLabel.svelte';
  import NeoValidation from '~/inputs/NeoValidation.svelte';
  import {
    type NeoInputContext,
    NeoInputLabelPosition,
    type NeoInputMethods,
    type NeoInputState,
    type NeoTextareaHTMLElement,
    type NeoTextareaProps,
  } from '~/inputs/neo-input.model.js';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
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
    after,
    message,
    error,

    // States
    id = label ? `neo-textarea-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    readonly,
    disabled,
    loading,
    clearable,
    dirtyOnInput,
    dirtyOnBlur,
    validateOnInput,
    validateOnBlur,
    position = NeoInputLabelPosition.Inside,
    autoResize = true,

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
    afterProps,
    afterTag = afterProps?.onclick ? 'button' : 'span',
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
  let validationMessage: string | undefined = $state(ref?.validationMessage);

  const filter = $derived(computeGlassFilter(elevation, glass));
  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const validate: NeoInputMethods<HTMLTextAreaElement>['validate'] = (
    update: { dirty?: boolean; valid?: boolean } = { dirty: true, valid: true },
  ) => {
    if (update.dirty) dirty = value !== initial;
    if (!update.valid) return { touched, dirty, valid, value, initial };
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
    return { touched, dirty, valid, value };
  };

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerProps?.onmouseenter?.(e);
  };

  const onMouseLeave: MouseEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerProps?.onmouseleave?.(e);
  };

  const onFocus: FocusEventHandler<HTMLTextAreaElement> = e => {
    focused = true;
    touched = true;
    onfocus?.(e);
  };

  const onBlur: FocusEventHandler<HTMLTextAreaElement> = e => {
    focused = false;
    validate({ dirty: dirtyOnBlur, valid: validateOnBlur });
    onblur?.(e);
  };

  const onInput: FormEventHandler<HTMLTextAreaElement> = e => {
    touched = true;
    validate({ dirty: dirtyOnInput, valid: validateOnInput });
    oninput?.(e);
  };

  const onChange: FormEventHandler<HTMLTextAreaElement> = e => {
    validate();
    onchange?.(e);
  };

  const onInvalid: EventHandler<Event, HTMLTextAreaElement> = e => {
    valid = false;
    validationMessage = ref?.validationMessage;
    e.preventDefault();
    oninvalid?.(e);
  };

  /**
   * Change the state of the input
   * @param state
   */
  export const mark: NeoInputMethods<HTMLTextAreaElement>['mark'] = (state: NeoInputState<HTMLTextAreaElement>) => {
    if (state.touched !== undefined) touched = state.touched;
    if (state.valid !== undefined) valid = state.valid;
    if (state.dirty === undefined) return onmark?.({ touched, dirty, valid });
    dirty = state.dirty;
    if (!dirty) initial = value;
    return onmark?.({ touched, dirty, valid, value });
  };

  const focus = () => {
    if (focused) return;
    ref?.focus();
  };

  /**
   * Clear the input state
   */
  export const clear: NeoInputMethods<HTMLTextAreaElement>['clear'] = (
    state?: NeoInputState<HTMLTextAreaElement>,
    event?: InputEvent | SvelteEvent<InputEvent>,
  ) => {
    if (event) ref?.dispatchEvent(event);
    value = rest?.defaultValue ?? '';
    focus();
    setTimeout(() => (state ? mark({ touched: false, dirty: false, ...state }) : validate()));
    onclear?.({ touched, dirty, valid, value, initial }, event);
    if (event) return ref?.dispatchEvent(event);
    const _event: InputEventInit = { bubbles: true, cancelable: false, data: value as InputEventInit['data'], inputType: 'clear' };
    oninput?.(new InputEvent('input', _event) as SvelteEvent<InputEvent, HTMLTextAreaElement>);
  };

  /**
   * Change the value of the input
   */
  export const change: NeoInputMethods<HTMLTextAreaElement>['change'] = (_value: HTMLInputElement['value'], event?: InputEvent) => {
    if (event) ref?.dispatchEvent(event);
    value = _value;
    focus();
    return validate();
  };

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, { mark, clear, change, validate });
  });

  const affix = $derived(clearable || loading !== undefined || validation);
  const hasValue = $derived(value !== undefined && (typeof value === 'string' ? !!value.length : value !== null));
  const close = $derived(clearable && (focused || hovered) && hasValue && !disabled && !readonly);
  const isFloating = $derived(floating && !focused && !hasValue && !disabled && !readonly);

  let labelHeight = $state<string>();
  let labelWidth = $state<string>();

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
    if (position !== NeoInputLabelPosition.Left && position !== NeoInputLabelPosition.Right) return;
    labelWidth = `${labelRef?.clientWidth ?? 0}px`;
  });

  const rows = $derived.by(() => {
    if (typeof autoResize === 'boolean' || !autoResize) return after ? 3 : undefined;
    if (after) return Math.max(3, autoResize.min ?? 0);
    return autoResize.min;
  });

  const max = $derived.by(() => {
    if (!ref) return;
    if (typeof autoResize === 'boolean' || !autoResize) return;
    if (!autoResize.max) return;

    const lineHeight = Number.parseInt(getComputedStyle(ref).lineHeight, 10);
    if (!lineHeight || Number.isNaN(lineHeight)) return;
    return autoResize.max * lineHeight;
  });

  const resize = () => {
    if (!autoResize || !ref) return;

    const isScrolled = ref.scrollHeight && ref.scrollHeight > ref.clientHeight;
    const hasMin = typeof autoResize !== 'boolean' && autoResize.min;
    if (!isScrolled && !hasMin) return;

    ref.style.height = '1px';
    const { scrollHeight } = ref;

    if (!scrollHeight) ref.style.height = '';
    else if (max) ref.style.height = `${Math.min(max, scrollHeight)}px`;
    else ref.style.height = `${scrollHeight}px`;
  };

  $effect(() => {
    // eslint-disable-next-line no-unused-expressions -- used to trigger resize textarea on value change
    value;
    resize();
  });

  const errorMessage = $derived.by(() => {
    if (valid || valid === undefined) return;
    if (error) return error;
    if (!validation) return;
    return error ?? validationMessage;
  });

  const showMessage = $derived(message || errorMessage || error || validation);
  const messageId = $derived(showMessage ? (messageProps?.id ?? `neo-textarea-message-${crypto.randomUUID()}`) : undefined);

  const context = $derived<NeoInputContext<NeoTextareaHTMLElement>>({
    // Ref
    ref,

    // Methods
    mark,
    clear,
    change,
    validate,

    // State
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

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#snippet suffix()}
  <!--  Affix (loafing, clear, placeholder) -->
  {#if affix}
    <NeoAffix {loading} {close} {skeleton} valid={validation ? valid : undefined} closeProps={{ onclick: () => clear() }} onclick={() => focus()} />
  {/if}

  <!--  Suffix  -->
  {#if after}
    <svelte:element this={afterTag} class:neo-textarea-after={true} {disabled} {readonly} {...afterProps}>
      {@render after(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet textarea()}
  <textarea
    {id}
    {disabled}
    {readonly}
    aria-invalid={valid === undefined ? undefined : !valid}
    aria-describedby={messageId}
    bind:this={ref}
    bind:value
    class:neo-textarea={true}
    class:neo-affix={affix || after}
    {rows}
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

{#snippet labelGroup()}
  {#if typeof label === 'string'}
    {label}
  {:else if label}
    {@render label(context)}
  {/if}
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
      <NeoLabel
        {id}
        bind:ref={labelRef}
        containerProps={{
          class: [
            affix || after ? 'neo-affix' : undefined,
            first ? 'neo-first' : undefined,
            rounded ? 'neo-rounded' : undefined,
            isFloating ? 'neo-floating' : undefined,
          ]
            .filter(Boolean)
            .join(' '),
          onclick: focus,
        }}
        label={labelGroup}
        required={rest.required}
        {disabled}
        {...labelProps}
      >
        {@render textarea()}
      </NeoLabel>
    {:else}
      {@render textarea()}
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
    {@render textareaGroup()}
  </NeoValidation>
{:else}
  {@render textareaGroup()}
{/if}

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-textarea-group,
  .neo-textarea,
  .neo-textarea-after {
    display: inline-flex;
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
    min-width: 100%;
    max-width: 100%;
    min-height: fit-content;
    padding: 0.75rem 0.95rem;
    color: inherit;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-textarea-border-radius, var(--neo-border-radius));
    outline: none;

    &.neo-affix {
      padding: 0.75rem 2.25rem 0.75rem 0.95rem;
    }

    &-after {
      position: absolute;
      right: 0.125rem;
      bottom: 0.125rem;
      align-items: center;
      margin: 0.25rem;
      padding: 0.5rem;
      color: var(--neo-textarea-after-color, inherit);
      background-color: var(--neo-textarea-after-bg-color, transparent);
      border: none;
      border-radius: var(--neo-textarea-after-border-radius, var(--neo-border-radius));

      &:is(button, a) {
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
      resize: none;
    }
  }

  .neo-textarea-group {
    position: relative;
    min-width: min-content;
    margin: var(--neo-shadow-margin, 0.625rem);
    color: var(--neo-textarea-text-color, inherit);
    background-color: var(--neo-textarea-bg-color, inherit);
    border: var(--neo-border-width, 1px) var(--neo-textarea-border-color, transparent) solid;
    border-radius: var(--neo-textarea-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-textarea-box-shadow, var(--neo-box-shadow-flat));
    cursor: text;

    &.neo-readonly {
      cursor: initial;
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
      border-color: var(--neo-textarea-border-color, var(--neo-border-color));
    }

    &:focus-within,
    &.neo-hover:hover {
      box-shadow: var(--neo-textarea-hover-shadow, var(--neo-box-shadow-flat));
    }

    &.neo-disabled {
      box-shadow: var(--neo-box-shadow-flat) !important;
      opacity: var(--neo-textarea-opacity-disabled, var(--neo-opacity-disabled));

      &:not(.neo-borderless) {
        border-color: var(--neo-input-border-color-disabled, var(--neo-border-color-disabled)) !important;
      }
    }

    :global(.neo-affix-container) {
      position: absolute;
      top: 0.125rem;
      right: 0.125rem;
      margin: 0.25rem;
      padding: 0.5rem;
      border: none;
      border-radius: var(--neo-textarea-affix-border-radius, var(--neo-border-radius));
    }

    :global(.neo-label-container) {
      width: 100%;

      :global(.neo-label) {
        --neo-label-padding: 0 1rem;
        --neo-label-margin: 0;
        --neo-label-color: var(--neo-textarea-label-color, inherit);

        min-height: var(--neo-textarea-label-height);
        transition:
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

    :global(.neo-label-container.neo-first .neo-label) {
      transition: none;
    }

    :global(.neo-label-container.neo-affix .neo-label) {
      padding-right: 3.25rem; // 2.5rem + 0.75rem
    }

    :global(.neo-label-container.neo-floating) {
      :global(.neo-label) {
        --neo-label-color: var(--neo-textarea-floating-label-color, var(--neo-text-color-disabled));
        --neo-label-required-color: var(--neo-input-required-color, var(--neo-color-error-50));

        translate: 0 calc(50% + 0.7rem - var(--neo-textarea-label-height) / 2);
      }

      :global(.neo-input) {
        color: var(--neo-input-floating-text-color, transparent);
      }

      :global(::placeholder) {
        opacity: 0;
      }
    }

    &.neo-rounded {
      border-radius: var(--neo-textarea-border-radius, var(--neo-border-radius-lg));

      :global(.neo-affix-container) {
        right: 0.365rem;
      }

      .neo-textarea {
        --neo-scrollbar-button-height: 0.75rem;

        padding: 0.75rem 1rem;
        border-radius: var(--neo-border-radius-lg, 2rem);

        &.neo-affix {
          padding: 0.75rem 2.75rem 0.75rem 1.2rem;
        }

        &-after {
          right: 0.365rem;
        }
      }

      :global(.neo-label-container .neo-label) {
        padding: 0 1.25rem;
      }

      :global(.neo-label-container.neo-affix .neo-label) {
        padding-right: 3.5rem; // 2.5rem + 1rem
      }
    }

    &[data-position='left'] {
      --neo-textarea-margin-left: calc(var(--neo-shadow-margin, 0.625rem) + var(--neo-textarea-label-width, auto));

      margin-left: var(--neo-textarea-margin-left);

      :global(.neo-label-container .neo-label) {
        position: absolute;
        top: 0.75rem;
        left: calc(0% - var(--neo-textarea-margin-left));
      }

      :global(.neo-label-container.neo-affix:not(.neo-floating) .neo-label) {
        left: calc(2.5rem - var(--neo-textarea-margin-left));
      }

      :global(.neo-label-container.neo-affix:not(.neo-floating).neo-rounded .neo-label) {
        left: calc(2.25rem - var(--neo-textarea-margin-left));
      }

      :global(.neo-label-container.neo-floating .neo-label) {
        left: 0;
      }
    }

    &[data-position='right'] {
      --neo-textarea-margin-right: calc(var(--shadow-margin, 0.625rem) + var(--neo-textarea-label-width, auto));

      margin-right: var(--neo-textarea-margin-right);

      :global(.neo-label-container .neo-label) {
        position: absolute;
        top: 0.75rem;
        right: calc(0.25rem - var(--neo-textarea-margin-right));
      }

      :global(.neo-label-container:not(.neo-floating).neo-rounded .neo-label) {
        right: calc(0% - var(--neo-textarea-margin-right));
      }

      :global(.neo-label-container.neo-floating .neo-label) {
        right: calc(100% - var(--neo-textarea-label-width));
      }

      :global(.neo-label-container.neo-floating.neo-rounded .neo-label) {
        right: calc(100% - 0.5rem - var(--neo-textarea-label-width));
      }
    }

    &[data-position='inside'] {
      :global(.neo-label-container .neo-textarea) {
        padding-top: 0.25rem;
      }

      :global(.neo-label-container .neo-label) {
        padding: 0.75rem 1rem 0.1875rem;
        line-height: var(--neo-line-height-xs, 1rem);
      }

      :global(.neo-label-container.neo-rounded .neo-label) {
        padding: 0.75rem 1rem 0.1875rem 1.25rem;
      }

      :global(.neo-label-container:not(.neo-floating) .neo-label) {
        font-size: var(--neo-font-size-sm, 0.875rem);
      }
    }

    &[data-position='top'][data-position='top'] {
      --neo-textarea-margin-top: calc(var(--neo-shadow-margin, 0.625rem) + var(--neo-textarea-label-height, var(--neo-line-height)));

      margin-top: var(--neo-textarea-margin-top);

      :global(.neo-label-container .neo-label) {
        position: absolute;
        top: calc(0% - var(--neo-textarea-margin-top));
      }
    }

    &[data-position='top'] :global(.neo-label-container.neo-floating .neo-label),
    &[data-position='left'] :global(.neo-label-container.neo-floating .neo-label),
    &[data-position='right'] :global(.neo-label-container.neo-floating .neo-label) {
      top: 0;
    }

    &.neo-glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-textarea-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-textarea-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-textarea-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));
    }

    &.neo-validation {
      &[data-valid='false'] {
        --neo-textarea-label-color: var(--neo-textarea-label-color-error, var(--neo-color-error));
        --neo-textarea-floating-label-color: var(--neo-textarea-floating-label-color-error, var(--neo-color-error-50));
        --neo-label-disabled-color: var(--neo-input-floating-label-color-error, var(--neo-color-error-50));
      }

      &[data-valid='true'] {
        --neo-textarea-label-color: var(--neo-textarea-label-color-success, var(--neo-color-success));
        --neo-textarea-floating-label-color: var(--neo-textarea-floating-label-color-success, var(--neo-color-success-50));
        --neo-label-disabled-color: var(--neo-input-floating-label-color-success, var(--neo-color-success-50));
      }
    }

    &.neo-start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.neo-borderless) {
          border-color: var(--neo-textarea-border-color, var(--neo-border-color));
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

    .neo-textarea {
      @include mixin.scrollbar;
    }
  }
</style>
