<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { fade } from 'svelte/transition';

  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';

  import type { NeoSwitchProps } from '~/inputs/neo-switch.model.js';

  import NeoSwitchButton from '~/buttons/NeoSwitchButton.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
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
    focusin = $bindable(false),
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
    buttonProps,
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

  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    focusin = true;
    containerProps?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      focusin = false;
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
    class:neo-switch-container={true}
    class:neo-flat={!elevation}
    {...containerProps}
    onfocusin={onFocusIn}
    onfocusout={onFocusOut}
  >
    <NeoSwitchButton
      {indeterminate}
      {checked}
      {rounded}
      {start}
      {glass}
      {disabled}
      {skeleton}
      {elevation}
      valid={validation ? valid : undefined}
      onclick={() => ref?.click()}
      {...buttonProps}
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
    </NeoSwitchButton>
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

    &-suffix {
      width: 1rem;
      height: 1rem;
      margin-bottom: 0.125rem;
      margin-left: 0.5rem;
    }
  }
</style>
