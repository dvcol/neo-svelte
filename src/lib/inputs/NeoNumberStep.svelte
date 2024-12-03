<script lang="ts">
  import type { FocusEventHandler } from 'svelte/elements';
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import type { NeoNumberStepProps } from '~/inputs/neo-number-step.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { DefaultShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(0),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    type = 'number',
    placeholder = '0',

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Events
    onStepUp,
    onStepDown,

    // Other props
    labelRef = $bindable(),
    beforeRef = $bindable(),
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
  const style = $derived.by(() => {
    if (text) return;
    return `
      --neo-btn-box-shadow: var(--neo-box-shadow-raised-${Math.min(Math.abs(elevation), 3)});
      --neo-btn-box-shadow-hover: var(--neo-box-shadow-raised-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-focus: var(--neo-box-shadow-raised-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-active: var(--neo-box-shadow-pressed-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      --neo-btn-box-shadow-focus-active: var(--neo-box-shadow-pressed-${Math.min(Math.max(Math.abs(elevation) - 1, 1), 2)});
      `;
  });
  const buttonProps = $derived<NeoButtonProps>({
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text,
    style,
    ...rest?.buttonProps,
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
  <NeoButton aria-label="Decrement number" title="Decrement number" onclick={decrement} {...buttonProps}>
    {#snippet icon()}
      <IconMinus width="1.25rem" height="1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet after()}
  <NeoButton aria-label="Increment number" title="Increment number" onclick={increment} {...buttonProps}>
    {#snippet icon()}
      <IconAdd width="1.25rem" height="1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

<svelte:element
  this={containerTag}
  class:neo-number-step={true}
  class:neo-label={rest.label}
  class:neo-affix={affix}
  out:outFn={outProps}
  in:inFn={inProps}
  {...containerProps}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  <NeoInput bind:ref bind:labelRef bind:beforeRef bind:value bind:valid bind:dirty bind:touched {type} {placeholder} {before} {after} {...rest} />
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

    &:not(.neo-label) {
      :global(.neo-input) {
        text-align: center;
      }

      &.neo-affix {
        :global(.neo-input) {
          padding-left: 1.75rem;
        }
      }
    }
  }
</style>
