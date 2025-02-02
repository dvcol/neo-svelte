<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { fade } from 'svelte/transition';

  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoRadioProps } from '~/inputs/neo-radio.model.js';

  import NeoRadioButton from '~/buttons/NeoRadioButton.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { coerce, DefaultShadowShallowElevation } from '~/utils/shadow.utils.js';
  import { enterTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,

    // State
    type = 'radio',
    id = label ? `neo-radio-${getUUID()}` : undefined,
    ref = $bindable(),
    group = $bindable(),
    checked = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    disabled,
    required,
    loading,

    // Styles
    start,
    glass,
    rounded = true,
    skeleton,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    containerRef = $bindable(),
    labelRef = $bindable(),
    labelProps,
    buttonProps,
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoRadioProps = $props();
  /* eslint-enable prefer-const */

  const elevation = $derived(coerce(rest?.elevation ?? DefaultShadowShallowElevation));

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

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

<svelte:element
  this={containerTag}
  bind:this={containerRef}
  class:neo-radio-container={true}
  class:neo-rounded={rounded}
  class:neo-flat={!elevation}
  {...containerProps}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  <NeoRadioButton {checked} {touched} {rounded} {start} {glass} {disabled} {skeleton} {elevation} onclick={() => ref?.click()} {...buttonProps}>
    <span class="neo-radio-input">
      <NeoBaseInput
        aria-invalid={valid === undefined ? undefined : !valid}
        {id}
        bind:ref
        bind:initial
        bind:group
        bind:checked
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
  </NeoRadioButton>
  <NeoLabel bind:ref={labelRef} for={id} {label} {disabled} {required} {...labelProps} />
  {#if loading !== undefined}
    <span class="neo-radio-suffix">
      {#if loading}
        <span class="neo-radio-loading" out:fade={enterTransitionProps}>
          <IconCircleLoading size="1rem" />
        </span>
      {/if}
    </span>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-radio {
    &-container {
      --neo-label-margin: 0 0 0 0.75rem;
      --neo-label-padding: 0;

      display: inline-flex;
      align-items: center;
      width: fit-content;
      margin: 0;
      padding: calc(0.375rem + var(--neo-radio-border-width, var(--neo-border-width, 1px))) 0.5rem 0.375rem;
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

    &-suffix {
      width: 1rem;
      height: 1rem;
      margin-bottom: 0.125rem;
      margin-left: 0.5rem;
    }
  }
</style>
