<script lang="ts">
  import { toStyle } from '@dvcol/common-utils/common/class';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade } from 'svelte/transition';

  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoFormContextField } from '~/form/neo-form-context.svelte.js';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';

  import type { NeoSwitchProps } from '~/inputs/neo-switch.model.js';

  import NeoSwitchButton from '~/buttons/NeoSwitchButton.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { coerce, DefaultShadowShallowElevation } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    message,
    error,
    on,
    off,
    handle,

    // State
    type = 'checkbox',
    id = `neo-switch-${getUUID()}`,
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
    register,

    // Shadow
    elevation: _elevation = DefaultShadowShallowElevation,

    // Styles
    start,
    glass,
    color,
    tinted,
    rounded = true,
    skeleton = false,

    // Size
    flex: _flex,
    width: _width,
    height: _height,

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
    validationRef = $bindable(),
    validationProps,
    ...rest
  }: NeoSwitchProps = $props();
  /* eslint-enable prefer-const */

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const labelId = $derived(label ? `neo-switch-label-${getUUID()}` : undefined);
  const elevation = $derived(coerce(_elevation));

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  let visible = $state(false);
  let messageId = $state(`neo-switch-message-${getUUID()}`);
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

  const inputForm = $derived<NeoFormContextField>({
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type: 'switch',
    state: { valid, dirty, touched, value: checked, initial },
  });

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

  const flex = $derived(visible ? undefined : _flex);
  const width = $derived(visible ? undefined : toSize(_width));
  const height = $derived(visible ? undefined : toSize(_height));
</script>

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
  style={toStyle('--neo-validation-padding: 0', validationProps?.style)}
>
  <svelte:element
    this={containerTag}
    bind:this={containerRef}
    class:neo-switch-container={true}
    class:neo-flat={!elevation}
    style:flex
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
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
      class={['neo-switch-input', rest.class]}
    />
    <NeoSwitchButton
      aria-labelledby={labelId}
      {handle}
      {off}
      {on}
      {indeterminate}
      {checked}
      {rounded}
      {start}
      {glass}
      {color}
      {tinted}
      {disabled}
      {skeleton}
      {elevation}
      valid={validation ? valid : undefined}
      onclick={() => ref?.click()}
      {...buttonProps}
    />
    <NeoLabel bind:ref={labelRef} id={labelId} for={id} {label} {disabled} {required} {...labelProps} />
    {#if loading !== undefined}
      <span class="neo-switch-suffix">
        {#if loading}
          <span class="neo-switch-loading" out:fade={quickDurationProps}>
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

      &:hover {
        :global(> .neo-switch-button) {
          color: var(--neo-switch-color-hover, oklch(from var(--neo-switch-color, currentcolor) calc(l - 0.1) c h));
        }

        :global(> .neo-switch-button.neo-flat) {
          border-color: var(--neo-switch-border-color-hover, var(--neo-border-color-highlight));
        }

        :global(> .neo-switch-button.neo-valid:not(.neo-disabled, .neo-flat)) {
          --neo-switch-checked-background: color-mix(in srgb, transparent, var(--neo-switch-valid-color, var(--neo-color-success)) 50%);
        }

        :global(> .neo-switch-button.neo-invalid:not(.neo-disabled, .neo-flat)) {
          --neo-switch-checked-background: color-mix(in srgb, transparent, var(--neo-switch-invalid-color, var(--neo-color-error)) 50%);
        }
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
