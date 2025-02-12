<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';
  import { getUUID } from '@dvcol/common-utils/common/string';

  import { tick } from 'svelte';

  import type { EventHandler, FocusEventHandler, FormEventHandler, PointerEventHandler } from 'svelte/elements';

  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import {
    type NeoInputContext,
    NeoInputLabelPosition,
    type NeoInputMethods,
    type NeoInputState,
    type NeoInputValue,
    type NeoTextareaHTMLElement,
    type NeoTextareaProps,
  } from '~/inputs/common/neo-input.model.js';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    getDefaultElevation,
    getDefaultHoverElevation,
    isShadowFlat,
    type ShadowElevation,
  } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    after,
    message,
    error,
    children,

    // States
    id = label ? `neo-textarea-${getUUID()}` : undefined,
    ref = $bindable(),

    value = $bindable(),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    readonly,
    disabled,
    loading,
    clearable,
    nullable = true,

    dirtyOnInput,
    dirtyOnBlur,
    validateOnInput,
    validateOnBlur,
    position = NeoInputLabelPosition.Inside,

    // Size
    width: _width,
    height: _height,
    autoResize = true,
    fitContent,

    // Styles
    borderless,
    pressed,
    rounded,
    glass,
    color,
    tinted,
    start,
    floating = true,
    skeleton = false,
    scrollbar = true,
    validation,
    validationIcon,

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
    afterRef = $bindable(),
    afterProps,
    affixRef = $bindable(),
    affixProps,
    containerRef = $bindable(),
    containerProps,
    wrapperRef = $bindable(),
    wrapperProps,
    messageProps,
    ..._rest
  }: NeoTextareaProps = $props();
  /* eslint-enable prefer-const */

  const { tag: afterTag = 'span', ...afterRest } = $derived(afterProps ?? {});
  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const { elevation: _elevation, hover: _hover, blur: _blur, ...rest } = $derived(_rest);

  const elevation = $derived(coerce(_elevation ?? getDefaultElevation(pressed)));
  const hover = $derived(coerce(_hover ?? getDefaultHoverElevation(pressed)));
  const hoverElevation = $derived(elevation + hover);

  const blur = $derived(coerce<ShadowElevation>(_blur ?? elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  let initial = $state(value);
  let validationMessage: string | undefined = $state(ref?.validationMessage);

  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    focusin = true;
    containerRest?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      focusin = false;
      containerRest?.onfocusout?.(e);
    }, 0);
  };

  const showAffixValidation = $derived(validation && validationIcon);
  const showInputValidation = $derived(validation === true || (validation === 'success' && valid) || (validation === 'error' && !valid));
  const affix = $derived(clearable || loading !== undefined || showAffixValidation);
  const hasValue = $derived(value !== undefined && (typeof value === 'string' ? !!value.length : value !== null));
  const close = $derived(clearable && (focusin || focused || hovered) && hasValue);
  const isFloating = $derived(floating && !hasValue && (!focused || disabled || readonly));

  const validate: NeoInputMethods<HTMLTextAreaElement>['validate'] = (
    update: { dirty?: boolean; valid?: boolean } = { dirty: true, valid: true },
  ) => {
    if (update.dirty) dirty = value !== initial;
    if (!update.valid) return { touched, dirty, valid, value, initial };
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
    return { touched, dirty, valid, value };
  };

  const onPointerEnter: PointerEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerRest?.onpointerenter?.(e);
  };

  const onPointerLeave: PointerEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerRest?.onpointerleave?.(e);
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

  const fallback = () => {
    if (nullable) return value;
    if (hasValue) return value;
    value = rest?.defaultValue ?? '';
    return value;
  };

  const onChange: FormEventHandler<HTMLTextAreaElement> = e => {
    touched = true;
    validate();
    fallback();
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
  export const clear: NeoInputMethods<HTMLTextAreaElement>['clear'] = async (
    state?: NeoInputState<HTMLTextAreaElement>,
    event?: InputEvent | SvelteEvent<InputEvent>,
  ) => {
    value = nullable ? '' : (rest?.defaultValue ?? '');
    await tick();
    focus();
    if (state) mark({ touched: false, dirty: false, ...state });
    else validate();
    onclear?.({ touched, dirty, valid, value, initial }, event);
    if (event) return ref?.dispatchEvent(event);
    const _event: InputEventInit = { bubbles: true, cancelable: false, data: value as InputEventInit['data'], inputType: 'clear' };
    oninput?.(new InputEvent('input', _event) as SvelteEvent<InputEvent, HTMLTextAreaElement>);
  };

  /**
   * Change the value of the input
   */
  export const change: NeoInputMethods<HTMLTextAreaElement>['change'] = async (_value: NeoInputValue<HTMLTextAreaElement>, event?: InputEvent) => {
    value = _value;
    focus();
    await tick();
    if (event) ref?.dispatchEvent(event);
    return validate();
  };

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, { mark, clear, change, validate });
  });

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

  let visible = $state(false);
  let messageId = $state(`neo-textarea-message-${getUUID()}`);

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
    initial,
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
    color,
    tinted,
    start,
    skeleton,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));
</script>

{#snippet suffix()}
  <!--  Affix (loafing, clear, placeholder) -->
  {#if affix}
    <NeoAffix
      bind:ref={affixRef}
      role="none"
      {loading}
      {close}
      {disabled}
      {readonly}
      {skeleton}
      valid={showAffixValidation ? valid : undefined}
      onclick={() => focus()}
      {...affixProps}
      closeProps={{ onclick: () => clear(), ...affixProps?.closeProps }}
    />
  {/if}

  <!--  Suffix  -->
  {#if after}
    <svelte:element this={afterTag} bind:this={afterRef} class:neo-textarea-after={true} {disabled} {readonly} {...afterRest}>
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
    aria-describedby={visible ? messageId : undefined}
    bind:this={ref}
    bind:value
    class:neo-textarea={true}
    class:neo-scroll={scrollbar}
    class:neo-affix={affix || after}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
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
    bind:this={containerRef}
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
    class:neo-tinted={tinted}
    class:neo-hover={hover}
    class:neo-hovered={hovered}
    class:neo-floating={floating}
    class:neo-start={start}
    class:neo-skeleton={skeleton}
    class:neo-validation={showInputValidation}
    class:neo-disabled={disabled}
    class:neo-raised={elevation > 3 || hoverElevation > 3}
    class:neo-inset={elevation < 0}
    class:neo-inset-hover={hoverElevation < 0}
    class:neo-deep={elevation < -3 || hoverElevation < -3}
    class:neo-flat={!elevation}
    class:neo-hover-flat={hoverFlat}
    class:neo-flat-hover={flatHover}
    style:--neo-textarea-text-color={getColorVariable(color)}
    style:--neo-textarea-glass-blur={filter}
    style:--neo-textarea-box-shadow={boxShadow}
    style:--neo-textarea-box-shadow-hover={hoverShadow}
    style:--neo-textarea-label-height={labelHeight}
    style:--neo-textarea-label-width={labelWidth}
    out:outFn={outProps}
    in:inFn={inProps}
    {...containerRest}
    onpointerenter={onPointerEnter}
    onpointerleave={onPointerLeave}
    onfocusin={onFocusIn}
    onfocusout={onFocusOut}
  >
    {#if label}
      <NeoLabel
        for={id}
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
    {@render children?.(context)}
  </svelte:element>
{/snippet}

<NeoInputValidation
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
  {messageProps}
  in={inAction}
  out={outAction}
  transition={transitionAction}
  {...wrapperProps}
>
  {@render textareaGroup()}
</NeoInputValidation>

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
    width: 100%;
    min-width: fit-content;
    max-width: 100%;
    min-height: fit-content;
    padding: 0.75rem 0.95rem;
    overflow: auto;
    color: var(--neo-textarea-text-color, inherit);
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-textarea-border-radius, var(--neo-border-radius));
    outline: none;

    &.neo-fit-content {
      field-sizing: content;
    }

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
          outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
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

      &:has(:global(.neo-button:only-child)) {
        padding: 0;
      }

      :global(.neo-button) {
        --neo-btn-padding-empty: 0.4375rem;
        --neo-btn-margin: auto;
        --neo-btn-bg-color: transparent;
        --neo-btn-backdrop-filter: none;
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

    &:focus-visible {
      outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
    }

    &.neo-readonly {
      cursor: initial;
    }

    &.neo-borderless {
      border-color: transparent !important;
    }

    &.neo-deep.neo-pressed,
    &.neo-raised {
      margin: var(--neo-shadow-margin-lg, 1.125rem);
    }

    &.neo-deep {
      padding: 0.25rem;
    }

    &.neo-hover.neo-flat-hover.neo-hovered,
    &.neo-hover.neo-flat-hover:hover,
    &.neo-hover.neo-flat-hover:focus-within,
    &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered .neo-hover-flat:focus-within) {
      border-color: var(--neo-textarea-border-color, var(--neo-border-color));

      &:focus-visible,
      &:hover {
        border-color: var(--neo-textarea-border-color-hover, var(--neo-border-color-highlight));
      }
    }

    &:focus-within,
    &.neo-hover:hover,
    &.neo-hover.neo-hovered {
      box-shadow: var(--neo-textarea-box-shadow-hover, var(--neo-box-shadow-flat));
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
        --neo-label-color: var(--neo-input-floating-label-color, var(--neo-text-color-secondary));
        --neo-label-color-hover: var(--neo-input-floating-label-color, var(--neo-text-color-secondary-hover));
        --neo-label-required-color: var(--neo-input-required-color, var(--neo-color-error-50));

        translate: 0 calc(50% + 0.75rem - var(--neo-textarea-label-height) / 2);
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
      --neo-textarea-margin-right: calc(var(--neo-shadow-margin, 0.625rem) + var(--neo-textarea-label-width, auto));

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
      --neo-background-color-tinted: var(--neo-glass-background-color-tinted);
      --neo-skeleton-color: var(--neo-glass-skeleton-color);
      --neo-border-color: var(--neo-glass-border-color);

      background-color: var(--neo-textarea-bg-color, var(--neo-glass-background-color));
      backdrop-filter: var(--neo-textarea-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

      &.neo-inset-hover:hover,
      &.neo-inset {
        border-color: var(--neo-textarea-border-color, transparent);
      }

      &:not(.neo-inset, .neo-inset-hover:hover, .neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
        border-color: var(
          --neo-textarea-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
      }

      &.neo-hover.neo-flat-hover.neo-hovered,
      &.neo-hover.neo-flat-hover:hover,
      &.neo-hover.neo-flat-hover:focus-within,
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered .neo-hover-flat:focus-within) {
        border-color: var(--neo-textarea-border-color, var(--neo-glass-border-color-flat));

        &:focus-visible,
        &:hover {
          border-color: var(--neo-textarea-color-hover, var(--neo-border-color-flat-highlight));
        }
      }
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

    &.neo-tinted {
      background-color: var(--neo-textarea-bg-color, var(--neo-background-color-tinted));
    }

    &.neo-skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;
    }

    .neo-textarea.neo-scroll {
      @include mixin.fade-scroll($fade-height: 0.5rem);
      @include mixin.scrollbar;
    }
  }
</style>
