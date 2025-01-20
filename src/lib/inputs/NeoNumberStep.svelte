<script lang="ts">
  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
  import type { NeoNumberStepProps } from '~/inputs/neo-number-step.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeButtonShadows, DefaultShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    iconPlus,
    iconMinus,

    // State
    defaultValue = 0,
    ref = $bindable(),
    value = $bindable(defaultValue),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    focusin = $bindable(false),
    type = 'number',
    placeholder = '0',
    center = !label,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Events
    onStepUp,
    onStepDown,

    // Other props
    wrapperRef = $bindable(),
    labelRef = $bindable(),
    buttonProps,
    groupProps,
    containerRef = $bindable(),
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoNumberStepProps = $props();
  /* eslint-enable prefer-const */

  const increment = (e: MouseEvent) => {
    if (!ref || ref?.disabled) return;
    ref.stepUp();
    ref.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: ref?.valueAsNumber?.toString(),
        inputType: 'stepUp',
      }),
    );
    onStepUp?.(e, ref.valueAsNumber, ref.step);
  };

  const decrement = (e: MouseEvent) => {
    if (!ref || ref?.disabled) return;
    ref.stepDown();
    ref.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: ref?.valueAsNumber?.toString(),
        inputType: 'stepDown',
      }),
    );
    onStepDown?.(e, ref.valueAsNumber, ref.step);
  };

  const elevation = $derived(rest?.elevation ?? DefaultShadowElevation);
  const text = $derived(elevation >= 0 || !rest.pressed);
  const style = $derived(computeButtonShadows(elevation, text));
  const buttonsProps = $derived<NeoButtonProps>({
    skeleton: rest.skeleton,
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...buttonProps,
  });

  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    containerProps?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      ref?.validate?.();
      containerProps?.onfocusout?.(e);
    }, 0);
  };

  const affix = $derived(rest.clearable || rest.loading !== undefined || rest.validation);

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

{#snippet before()}
  <NeoButton aria-label="Decrement number" title="Decrement number" onclick={decrement} {...buttonsProps}>
    {#snippet icon()}
      {#if iconMinus}
        {@render iconMinus()}
      {:else}
        <IconMinus size="1.25rem" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet after()}
  <NeoButton aria-label="Increment number" title="Increment number" onclick={increment} {...buttonsProps}>
    {#snippet icon()}
      {#if iconPlus}
        {@render iconPlus()}
      {:else}
        <IconAdd size="1.25rem" />
      {/if}
    {/snippet}
  </NeoButton>
{/snippet}

<svelte:element
  this={containerTag}
  class:neo-number-step={true}
  class:neo-label={label}
  class:neo-center={center}
  class:neo-affix={affix}
  out:outFn={outProps}
  in:inFn={inProps}
  {...containerProps}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  <NeoInput
    bind:ref
    bind:containerRef
    bind:wrapperRef
    bind:labelRef
    bind:value
    bind:valid
    bind:dirty
    bind:touched
    bind:hovered
    bind:focused
    bind:focusin
    {type}
    {placeholder}
    {before}
    {after}
    {label}
    {defaultValue}
    containerProps={groupProps}
    {...rest}
  />
</svelte:element>

<style lang="scss">
  .neo-number-step {
    :global(.neo-input[type='number']) {
      /* Hide arrows -Firefox */
      appearance: textfield;

      /* Hide arrows - Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        margin: 0;
        appearance: none;
      }
    }

    &.neo-center {
      :global(.neo-input) {
        text-align: center;
      }

      &.neo-affix {
        :global(.neo-input-before) {
          margin-right: 1.75rem;
        }
      }
    }
  }
</style>
