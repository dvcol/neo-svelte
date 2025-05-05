<script lang="ts">
  import type { NeoRadioProps } from '~/inputs/neo-radio.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';
  import { focusin as focusing } from '@dvcol/svelte-utils/focusin';
  import { hovering } from '@dvcol/svelte-utils/hovering';
  import { fade } from 'svelte/transition';

  import NeoRadioButton from '~/buttons/NeoRadioButton.svelte';
  import NeoIconCircleLoading from '~/icons/NeoIconCircleLoading.svelte';
  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';
  import NeoLabel from '~/inputs/common/NeoLabel.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { coerce, DefaultShadowShallowElevation } from '~/utils/shadow.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  let {
    // Snippets
    label,

    // State
    type = 'radio',
    id = `neo-radio-${getUUID()}`,
    ref = $bindable(),
    group = $bindable(),
    checked = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    focused = $bindable(false),
    hovered = $bindable(false),
    disabled,
    required,
    loading,

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
    flex,
    width: _width,
    height: _height,

    // Actions
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    containerRef = $bindable(),
    labelRef = $bindable(),
    labelProps,
    buttonProps,
    containerProps,
    ...rest
  }: NeoRadioProps = $props();

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const elevation = $derived(coerce(_elevation));
  const labelId = $derived(label ? `neo-radio-label-${getUUID()}` : undefined);

  let initial = $state(checked);
  let validationMessage = $state<string>(ref?.validationMessage ?? '');

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

<svelte:element
  this={containerTag}
  bind:this={containerRef}
  class:neo-radio-container={true}
  class:neo-rounded={rounded}
  class:neo-flat={!elevation}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  out:outFn={outProps}
  in:inFn={inProps}
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
    hide
    hidden
    aria-hidden
    tabindex={-1}
    class={['neo-radio-input', rest.class]}
  />
  <NeoRadioButton
    aria-labelledby={labelId}
    {checked}
    {touched}
    {rounded}
    {start}
    {glass}
    {disabled}
    {skeleton}
    {elevation}
    {color}
    {tinted}
    onclick={() => ref?.click()}
    {...buttonProps}
  />
  <NeoLabel bind:ref={labelRef} id={labelId} for={id} {label} {disabled} {required} {...labelProps} />
  {#if loading !== undefined}
    <span class="neo-radio-suffix">
      {#if loading}
        <span class="neo-radio-loading" out:fade={quickDurationProps}>
          <NeoIconCircleLoading size="1rem" />
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
        box-shadow 0.3s ease-out,
        border-radius 0.3s ease;

      &.neo-rounded {
        border-radius: var(--neo-border-radius-xxl);
      }

      &.neo-flat {
        --neo-label-margin: 0 0 0 0.625rem;
      }

      &:hover {
        :global(> .neo-radio-button) {
          color: var(--neo-radio-color-hover, oklch(from var(--neo-radio-color, currentcolor) calc(l - 0.1) c h));
        }

        :global(> .neo-radio-button.neo-flat) {
          border-color: var(--neo-radio-border-color-hover, var(--neo-border-color-highlight));
        }

        :global(> .neo-radio-button:not(.neo-disabled, .neo-flat)) {
          box-shadow: var(--neo-radio-checked-shadow, var(--neo-box-shadow-pressed-2));
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
