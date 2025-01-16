<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { fade } from 'svelte/transition';

  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';
  import type { NeoCheckboxProps } from '~/inputs/neo-checkbox.model.js';

  import IconCheckbox from '~/icons/IconCheckbox.svelte';
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
    id = label ? `neo-checkbox-${crypto.randomUUID()}` : undefined,
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
    rounded,
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
  }: NeoCheckboxProps = $props();
  /* eslint-enable prefer-const */

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  let visible = $state(false);
  let messageId = $state(`neo-checkbox-message-${crypto.randomUUID()}`);
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

  const boxShadow = $derived(computeShadowElevation(elevation, { glass }, { max: 2, min: -2 }));
  const checkedShadow = $derived(computeShadowElevation(-Math.abs(elevation), { glass, pressed: elevation > 0 }, { max: 2, min: -2 }));

  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    focused = true;
    containerProps?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      focused = false;
      containerProps?.onfocusout?.(e);
    }, 0);
  };
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
  <svelte:element
    this={containerTag}
    bind:this={containerRef}
    class:neo-checkbox-container={true}
    class:neo-rounded={rounded}
    class:neo-flat={!elevation}
    {...containerProps}
    onfocusin={onFocusIn}
    onfocusout={onFocusOut}
  >
    <button
      class="neo-checkbox-button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      class:neo-checked={checked || indeterminate}
      class:neo-rounded={rounded}
      class:neo-start={start}
      class:neo-glass={glass}
      class:neo-disabled={disabled}
      class:neo-skeleton={skeleton}
      class:neo-flat={!elevation}
      class:neo-inset={elevation <= 0}
      style:--neo-checkbox-box-shadow={boxShadow}
      style:--neo-checkbox-checked-shadow={checkedShadow}
      onclick={() => ref?.click()}
    >
      <span class="neo-checkbox-input">
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
      {#if indeterminate}
        <IconCheckbox circle={rounded} indeterminate />
      {:else if checked}
        <IconCheckbox circle={rounded} checked />
      {:else}
        <IconCheckbox circle={rounded} enter={touched} />
      {/if}
    </button>
    <NeoLabel bind:ref={labelRef} for={id} {label} {disabled} {required} {...labelProps} />
    {#if loading !== undefined}
      <span class="neo-checkbox-suffix">
        {#if loading}
          <span class="neo-checkbox-loading" out:fade={enterTransitionProps}>
            <IconCircleLoading size="1rem" />
          </span>
        {/if}
      </span>
    {/if}
  </svelte:element>
</NeoInputValidation>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-checkbox {
    &-container {
      --neo-label-margin: 0 0 0 0.75rem;
      --neo-label-padding: 0;

      display: inline-flex;
      align-items: center;
      width: fit-content;
      margin: 0;
      padding: calc(0.375rem + var(--neo-checkbox-border-width, var(--neo-border-width, 1px))) 0.5rem 0.375rem;
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
      padding: 0.125rem;
      color: inherit;
      text-decoration: none;
      background-color: color-mix(in srgb, transparent, currentcolor 1%);
      border: var(--neo-checkbox-border-width, var(--neo-border-width, 1px)) var(--neo-checkbox-border-color, transparent) solid;
      border-radius: var(--neo-border-radius-xs);
      outline: none;
      box-shadow: var(--neo-checkbox-box-shadow, var(--neo-box-shadow-raised-2));
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
        box-shadow: var(--neo-checkbox-checked-shadow, var(--neo-box-shadow-pressed-2));
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

        background-color: var(--neo-checkbox-bg-color, var(--neo-glass-background-color));
        border-color: var(
          --neo-checkbox-border-color,
          var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color)
            var(--neo-glass-left-border-color)
        );
        backdrop-filter: var(--neo-checkbox-glass-blur, var(--neo-blur-2) var(--neo-saturate-2));
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
