<script lang="ts">
  import type { NeoFormContextField } from '~/form/neo-form-context.svelte.js';
  import type { NeoInputContext, NeoInputHTMLElement } from '~/inputs/common/neo-input.model.js';
  import type { NeoCheckboxProps } from '~/inputs/neo-checkbox.model.js';

  import { toStyle } from '@dvcol/common-utils/common/class';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { focusin as focusing } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';
  import { fade } from 'svelte/transition';

  import NeoCheckboxButton from '~/buttons/NeoCheckboxButton.svelte';
  import NeoIconCircleLoading from '~/icons/NeoIconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoInputValidation from '~/inputs/common/NeoInputValidation.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { computeBorderRadius } from '~/utils/border.utils.js';
  import { coerce, DefaultShadowShallowElevation } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  let {
    // Snippets
    label,
    message,
    error,

    // State
    type = 'checkbox',
    id = `neo-checkbox-${getUUID()}`,
    ref = $bindable(),
    group = $bindable(),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    hovered = $bindable(false),
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
    rounded,
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
  }: NeoCheckboxProps = $props();

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

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

  const inputForm = $derived<NeoFormContextField>({
    id,
    ref,
    name: rest?.name,
    form: rest?.form,
    type,
    state: { valid, dirty, touched, value: checked, initial },
  });

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
    class:neo-checkbox-container={true}
    class:neo-rounded={rounded}
    class:neo-flat={!elevation}
    style:flex
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    style:--neo-checkbox-border-radius={computeBorderRadius(rounded)}
    use:focusing={{
      get focusin() {
        return focused;
      },
      set focusin(_value) {
        focused = _value;
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
            <NeoIconCircleLoading size="1rem" />
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
      border-radius: var(--neo-checkbox-border-radius, var(--neo-border-radius));
      transition:
        box-shadow 0.3s ease-out,
        border-radius 0.3s ease;

      &.neo-rounded {
        border-radius: var(--neo-checkbox-border-radius, var(--neo-border-radius-xxl));
      }

      &.neo-flat {
        --neo-label-margin: 0 0 0 0.625rem;
      }

      &:hover {
        :global(> .neo-checkbox-button) {
          color: var(--neo-checkbox-color-hover, oklch(from var(--neo-checkbox-color, currentcolor) calc(l - 0.1) c h));
        }

        :global(> .neo-checkbox-button.neo-flat) {
          border-color: var(--neo-checkbox-border-color-hover, var(--neo-border-color-highlight));
        }

        :global(> .neo-checkbox-button:not(.neo-disabled, .neo-flat)) {
          box-shadow: var(--neo-checkbox-checked-shadow, var(--neo-box-shadow-pressed-2));
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
