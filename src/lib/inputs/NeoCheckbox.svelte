<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade } from 'svelte/transition';

  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';
  import type { NeoCheckboxProps } from '~/inputs/neo-checkbox.model.js';

  import NeoCheckboxButton from '~/buttons/NeoCheckboxButton.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { coerce, DefaultShadowShallowElevation } from '~/utils/shadow.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    message,
    error,

    // State
    type = 'checkbox',
    id = label ? `neo-checkbox-${getUUID()}` : undefined,
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
    color,
    tinted,
    rounded,
    skeleton = false,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    labelRef = $bindable(),
    labelProps,
    buttonProps,
    messageProps,
    containerRef = $bindable(),
    containerProps,
    wrapperRef = $bindable(),
    wrapperProps,
    ..._rest
  }: NeoCheckboxProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});
  const { elevation: _elevation = DefaultShadowShallowElevation, ...rest } = $derived(_rest);

  const elevation = $derived(coerce(_elevation));
  const labelId = $derived(label ? `neo-checkbox-label-${getUUID()}` : undefined);

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  let visible = $state(false);
  let messageId = $state(`neo-checkbox-message-${getUUID()}`);
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
    initial,
    touched,
    dirty,
    valid,
    readonly: rest.readonly,
    disabled,

    // Styles
    rounded,
    glass,
    color,
    tinted,
    start,
    skeleton,
    elevation,
  });

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
  style={toStyle('--neo-validation-padding: 0', wrapperProps?.style)}
>
  <svelte:element
    this={containerTag}
    bind:this={containerRef}
    class:neo-checkbox-container={true}
    class:neo-rounded={rounded}
    class:neo-flat={!elevation}
    {...containerRest}
    onfocusin={onFocusIn}
    onfocusout={onFocusOut}
  >
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
      hide
      hidden
      aria-hidden
      tabindex={-1}
      class={['neo-checkbox-input', rest.class]}
    />
    <NeoCheckboxButton
      aria-labelledby={labelId}
      {indeterminate}
      {checked}
      {touched}
      {rounded}
      {start}
      {glass}
      {color}
      {tinted}
      {disabled}
      {skeleton}
      {elevation}
      onclick={() => ref?.click()}
      {...buttonProps}
    />
    <NeoLabel bind:ref={labelRef} id={labelId} for={id} {label} {disabled} {required} {...labelProps} />
    {#if loading !== undefined}
      <span class="neo-checkbox-suffix">
        {#if loading}
          <span class="neo-checkbox-loading" out:fade={quickDurationProps}>
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

    &-suffix {
      width: 1rem;
      height: 1rem;
      margin-bottom: 0.125rem;
      margin-left: 0.5rem;
    }
  }
</style>
