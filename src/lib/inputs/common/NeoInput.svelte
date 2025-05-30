<script lang="ts">
  import type { NeoFormContextField } from '~/form/neo-form-context.svelte.js';
  import type { NeoInputContext, NeoInputHTMLElement, NeoInputProps } from '~/inputs/common/neo-input.model.js';

  import { wait } from '@dvcol/common-utils/common/promise';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { focusin as focusing } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';

  import { NeoInputLabelPlacement } from '~/inputs/common/neo-input.model.js';
  import NeoAffix from '~/inputs/common/NeoAffix.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import {
    coerce,
    computeGlassFilter,
    computeHoverShadowElevation,
    computeShadowElevation,
    getDefaultElevation,
    getDefaultHoverElevation,
    isShadowFlat,
    parseBlur,
  } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  let {
    // Snippets
    label,
    before,
    after,
    inner,
    message,
    error,
    children,

    // States
    id = `neo-input-${getUUID()}`,
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
    focusin = $bindable(false),
    disabled,
    readonly,

    loading,
    clearable,

    placement = NeoInputLabelPlacement.Inside,

    // Size
    flex: _flex,
    width: _width,
    height: _height,

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
    validation,
    validationIcon,
    register,

    // Shadow
    elevation: _elevation = getDefaultElevation(pressed),
    hover: _hover = getDefaultHoverElevation(pressed),
    blur: _blur,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    labelRef = $bindable(),
    labelProps,
    afterRef = $bindable(),
    afterProps,
    affixRef = $bindable(),
    affixProps,
    beforeRef = $bindable(),
    beforeProps,
    containerRef = $bindable(),
    containerProps,
    validationRef = $bindable(),
    validationProps,
    messageProps,
    ...rest
  }: NeoInputProps<NeoInputHTMLElement> = $props();

  const { tag: afterTag = 'span', ...afterRest } = $derived(afterProps ?? {});
  const { tag: beforeTag = 'span', ...beforeRest } = $derived(beforeProps ?? {});
  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const elevation = $derived(coerce(_elevation));
  const hover = $derived(coerce(_hover));
  const hoverElevation = $derived(elevation + hover);

  const blur = $derived(parseBlur(_blur, elevation));
  const filter = $derived(computeGlassFilter(blur, glass));

  const boxShadow = $derived(computeShadowElevation(elevation, { glass, pressed }));
  const hoverShadow = $derived(computeHoverShadowElevation(elevation, hover, { glass, pressed }) ?? boxShadow);

  const hoverFlat = $derived(isShadowFlat(boxShadow) && !isShadowFlat(hoverShadow));
  const flatHover = $derived(isShadowFlat(hoverShadow) && !isShadowFlat(boxShadow));

  const getValue = () => {
    if (rest?.type === 'file') return files;
    if (rest?.type === 'checkbox' || rest?.type === 'radio') return checked;
    return value;
  };

  let initial = $state(getValue());
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  const typedValue = $derived(getValue());
  const hasValue = $derived.by(() => {
    if (rest?.type === 'file') return !!files?.length;
    if (rest?.type === 'checkbox' || rest?.type === 'radio') return checked !== undefined;
    if (typeof value === 'string') return !!value.length;
    if (rest?.multiple && Array.isArray(value)) return !!value.length;
    return value !== undefined && value !== null;
  });

  const showAffixValidation = $derived(validation && validationIcon);
  const showInputValidation = $derived(validation === true || (validation === 'success' && valid) || (validation === 'error' && !valid));
  const affix = $derived(clearable || loading !== undefined || showAffixValidation);
  const close = $derived(clearable && (focusin || focused || hovered) && hasValue);
  const isFloating = $derived(floating && !hasValue && (!focused || disabled || readonly));
  const inside = $derived(placement === NeoInputLabelPlacement.Inside && label);

  const onClear = () => {
    if (disabled || readonly) return;
    ref?.clear?.();
  };

  const onFocus = () => {
    if (focused || disabled || readonly || rest?.hidden) return;
    ref?.focus();
  };

  const onLabelClick = () => {
    if (disabled || readonly || rest?.hidden || rest.type !== 'select') return;
    ref?.showPicker?.();
  };

  let first = $state(true);
  // Skip enter transition on first render for floating label
  const waitForTick = async () => {
    if (!first) return;
    await wait();
    first = false;
  };

  let affixWidth = $state<string>();
  let afterWidth = $state<string>();
  let beforeWidth = $state<string>();

  let labelContainerRef = $state<HTMLElement>();
  let labelContainerHeight = $state<string>();
  let labelHeight = $state<string>();
  let labelWidth = $state<string>();

  const updateRefs = () => {
    labelContainerHeight = `${labelContainerRef?.clientHeight ?? 0}px`;
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
  let messageId = $state(`neo-textarea-message-${getUUID()}`);

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
    color,
    tinted,
    start,
    skeleton,
  });

  const inputForm = $derived<NeoFormContextField>({
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type: rest.type,
    state: { valid, dirty, touched, value: typedValue, initial },
  });

  const flex = $derived(visible ? undefined : _flex);
  const width = $derived(visible ? undefined : toSize(_width));
  const height = $derived(visible ? undefined : toSize(_height));

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
      {...beforeRest}
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
      role="none"
      {loading}
      {close}
      {disabled}
      {readonly}
      {skeleton}
      valid={showAffixValidation ? valid : undefined}
      onclick={onFocus}
      {...affixProps}
      class={[
        after ? 'neo-after' : undefined,
        rest.type === 'select' ? 'neo-select' : undefined,
        rest.multiple ? 'neo-multiple' : undefined,
        affixProps?.class,
      ]}
      closeProps={{ onclick: onClear, ...affixProps?.closeProps }}
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
      {...afterRest}
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
  {#if typeof label === 'function'}
    {@render label(context)}
  {:else if label !== undefined}
    {label}
  {/if}
{/snippet}

{#snippet inputGroup()}
  <svelte:element
    this={containerTag}
    bind:this={containerRef}
    role="none"
    data-placement={placement}
    data-touched={touched}
    data-dirty={dirty}
    data-valid={valid}
    class:neo-input-group={true}
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
    style:flex
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    style:--neo-input-text-color={getColorVariable(color)}
    style:--neo-input-glass-blur={filter}
    style:--neo-input-box-shadow={boxShadow}
    style:--neo-input-box-shadow-hover={hoverShadow}
    style:--neo-input-label-container-height={labelContainerHeight}
    style:--neo-input-label-height={labelHeight}
    style:--neo-input-label-width={labelWidth}
    style:--neo-input-before-width={beforeWidth}
    style:--neo-input-after-width={afterWidth}
    style:--neo-input-affix-width={affixWidth}
    style:--neo-input-border-radius={computeBorderRadius(rounded)}
    out:outFn={outProps}
    in:inFn={inProps}
    use:focusing={{
      get focusin() {
        return focusin;
      },
      set focusin(_value) {
        focusin = _value;
      },
    }}
    use:hovering={{
      get hovered() {
        return hovered;
      },
      set hovered(_value) {
        hovered = _value;
      },
    }}
    {...containerRest}
  >
    {@render prefix()}
    {#if label}
      <NeoLabel
        for={id}
        bind:ref={labelRef}
        bind:containerRef={labelContainerRef}
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
    {@render inner?.(context)}
  </svelte:element>
{/snippet}

<NeoInputValidation
  bind:ref={validationRef}
  bind:visible
  bind:messageId
  input={inputForm}
  {register}
  {valid}
  {validation}
  {validationMessage}
  {error}
  {rounded}
  {context}
  {message}
  {messageProps}
  flex={_flex}
  width={_width}
  height={_height}
  in={inAction}
  out={outAction}
  transition={transitionAction}
  {...validationProps}
>
  {@render inputGroup()}
</NeoInputValidation>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-input-group,
  .neo-input-before,
  .neo-input-after {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    min-width: min-content;
    font: inherit;
    text-align: start;
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
    appearance: none;
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
          outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
        }

        &:hover {
          color: var(--neo-input-hover-color, var(--neo-text-color-hover));
        }

        &:active {
          color: var(--neo-input-active-color, var(--neo-text-color-hover-active));
          scale: 0.9;
        }

        &:disabled {
          color: var(--neo-input-disabled-color, var(--neo-text-color-disabled));
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
      background-clip: padding-box;
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
      &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
        border-color: var(--neo-input-border-color, var(--neo-border-color));

        &:focus-visible,
        &:hover {
          border-color: var(--neo-input-border-color-hover, var(--neo-border-color-highlight));
        }
      }

      &:focus-within,
      &.neo-hover:hover,
      &.neo-hover.neo-hovered {
        box-shadow: var(--neo-input-box-shadow-hover, var(--neo-box-shadow-flat));
      }

      &:focus-visible,
      &:has(:global(.neo-input:-webkit-autofill:focus)),
      &:has(:global(.neo-input:-webkit-autofill:active)) {
        outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      }

      :global(.neo-input:is(select) option) {
        padding: 0.375rem 0.5rem;
        color: var(--neo-input-text-color, inherit);
        background-color: transparent;
        background-clip: text;
        border-radius: var(--neo-input-option-border-radius, var(--neo-border-radius-sm));
        backface-visibility: hidden;
        cursor: pointer;
        transition:
          -webkit-text-fill-color 0.15s ease,
          color 0.15s ease,
          box-shadow 0.3s ease-out,
          scale 0.3s ease-out;
        will-change: scale, color;
        -webkit-text-fill-color: var(--neo-input-text-color, var(--neo-text-color));
        margin-inline: -0.5rem;
        margin-block: 0.375rem;
        scale: 1;
      }

      :global(.neo-input:is(select) option:disabled) {
        color: var(--neo-input-disabled-color, var(--neo-text-color-disabled));
        cursor: not-allowed;
      }

      :global(.neo-input:is(select) option:hover) {
        color: var(--neo-input-hover-color, var(--neo-text-color-hover));
      }

      :global(.neo-input:is(select) option:checked),
      :global(.neo-input:is(select) option:active) {
        -webkit-text-fill-color: var(--neo-input-active-color, var(--neo-input-text-color, var(--neo-text-color)));
        color: var(--neo-input-active-color, var(--neo-input-text-color, var(--neo-text-color)));
        box-shadow: var(--neo-box-shadow-inset-1);
        scale: var(--neo-input-scale-pressed, 0.98);
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

      :global(.neo-label-container.neo-floating:not(:has(.neo-input:-webkit-autofill))) {
        :global(.neo-label) {
          --neo-label-color: var(--neo-input-floating-label-color, var(--neo-text-color-secondary));
          --neo-label-color-hover: var(--neo-input-floating-label-color, var(--neo-text-color-secondary-hover));
          --neo-label-required-color: var(--neo-input-required-color, var(--neo-color-error-50));
        }

        :global(.neo-input) {
          color: var(--neo-input-floating-text-color, transparent);
          transition-timing-function: ease-in;
        }

        :global(::placeholder) {
          opacity: 0;
          transition-timing-function: ease-in;
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

      :global(.neo-affix-container.neo-select:not(.neo-multiple)) {
        margin-left: 0.5rem;
      }

      :global(.neo-affix-container.neo-select.neo-multiple) {
        margin-left: -0.5rem;
      }

      :global(.neo-affix-container.neo-select.neo-after) {
        margin-right: -0.375rem;
      }

      &.neo-rounded {
        border-radius: var(--neo-input-border-radius, var(--neo-border-radius-xxl));

        :global(.neo-input:is(select) option) {
          border-radius: var(--neo-input-option-border-radius, var(--neo-border-radius-md));
        }

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

      &[data-placement='left'] {
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

        :global(.neo-label-container.neo-floating:not(:has(.neo-input:-webkit-autofill)) .neo-label) {
          left: calc(0.25rem + var(--neo-input-before-width));
        }
      }

      &[data-placement='right'] {
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

        :global(.neo-label-container.neo-floating:not(:has(.neo-input:-webkit-autofill)) .neo-label) {
          right: calc(100% - var(--neo-input-label-width) - 0.25rem - var(--neo-input-before-width));
        }

        :global(.neo-label-container.neo-floating:not(:has(.neo-input:-webkit-autofill)).neo-rounded:not(.neo-before) .neo-label) {
          right: calc(100% - var(--neo-input-label-width) - 0.75rem - var(--neo-input-before-width));
        }
      }

      &[data-placement='inside'] {
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
          min-width: var(--neo-input-label-width);
          padding: 0.75rem 1rem 0.25rem;
          line-height: var(--neo-line-height-xs, 1rem);
        }

        :global(.neo-label-container.neo-before .neo-label) {
          padding-left: 0;
        }

        :global(.neo-label-container.neo-floating:not(:has(.neo-input:-webkit-autofill)) .neo-label) {
          translate: 0 calc((var(--neo-input-label-container-height) / 2) - 50% - 0.25rem);
        }

        :global(.neo-label-container:has(.neo-input:-webkit-autofill) .neo-label),
        :global(.neo-label-container:not(.neo-floating) .neo-label) {
          font-size: var(--neo-font-size-sm, 0.875rem);
        }
      }

      &[data-placement='top'][data-placement='top'] {
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

      &[data-placement='top'],
      &[data-placement='left'],
      &[data-placement='right'] {
        :global(.neo-label-container.neo-floating:not(:has(.neo-input:-webkit-autofill)) .neo-label) {
          top: calc(50% - var(--neo-input-label-height) / 2);
        }

        &.neo-floating {
          --neo-input-min-width: var(--neo-input-label-width);
          --neo-input-min-height: var(--neo-input-label-height);
          --neo-label-max-width: calc(100% - var(--neo-input-after-width) - var(--neo-input-before-width) - var(--neo-input-affix-width));
        }
      }

      &.neo-glass {
        --neo-background-color-tinted: var(--neo-glass-background-color-tinted);
        --neo-skeleton-color: var(--neo-glass-skeleton-color);
        --neo-border-color: var(--neo-glass-border-color);

        background-color: var(--neo-input-bg-color, var(--neo-glass-background-color));
        backdrop-filter: var(--neo-input-glass-blur, var(--neo-blur-3) var(--neo-saturate-2));

        &:not(.neo-inset, .neo-inset-hover:hover, .neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
          border-color: var(
            --neo-input-border-color,
            var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
              var(--neo-glass-left-border-color)
          );
        }

        &.neo-hover.neo-flat-hover.neo-hovered,
        &.neo-hover.neo-flat-hover:hover,
        &.neo-hover.neo-flat-hover:focus-within,
        &.neo-flat:not(.neo-borderless, .neo-hover-flat:hover, .neo-hover-flat.neo-hovered, .neo-hover-flat:focus-within) {
          border-color: var(--neo-input-border-color, var(--neo-glass-border-color-flat));

          &:focus-visible,
          &:hover {
            border-color: var(--neo-input-border-color-hover, var(--neo-glass-border-color-flat-highlight));
          }
        }
      }

      &.neo-validation {
        &[data-valid='false'] {
          --neo-input-label-color: var(--neo-input-label-color-error, var(--neo-color-error));
          --neo-label-color-hover: var(--neo-input-label-color-error-hover, var(--neo-color-error-highlight));
          --neo-input-floating-label-color: var(--neo-input-floating-label-color-error, var(--neo-color-error-50));
          --neo-label-disabled-color: var(--neo-input-floating-label-color-error, var(--neo-color-error-50));
          --neo-border-color: var(--neo-input-border-color-error, var(--neo-color-error));
        }

        &[data-valid='true'] {
          --neo-input-label-color: var(--neo-input-label-color-success, var(--neo-color-success));
          --neo-label-color-hover: var(--neo-input-label-color-success-hover, var(--neo-color-success-highlight));
          --neo-input-floating-label-color: var(--neo-input-floating-label-color-success, var(--neo-color-success-50));
          --neo-label-disabled-color: var(--neo-input-floating-label-color-success, var(--neo-color-success-50));
          --neo-border-color: var(--neo-input-border-color-success, var(--neo-color-success));
        }
      }

      &.neo-start {
        @starting-style {
          box-shadow: var(--neo-box-shadow-flat);
        }
      }

      &.neo-tinted {
        background-color: var(--neo-input-bg-color, var(--neo-background-color-tinted));
      }

      &.neo-skeleton {
        box-shadow: var(--neo-box-shadow-flat);
        pointer-events: none;

        @include mixin.skeleton;
      }
    }
  }
</style>
