<script lang="ts">
  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import type { NeoNumberStepProps } from '~/inputs/neo-number-step.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconAdd from '~/icons/IconAdd.svelte';
  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { DefaultShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    type = 'number',

    // Events
    onStepUp,
    onStepDown,

    // Other props
    labelRef = $bindable(),
    beforeRef = $bindable(),
    numberTag = 'div',
    numberProps,
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
  const buttonProps = $derived<NeoButtonProps>({
    disabled: rest.disabled,
    rounded: rest.rounded,
    glass: rest.glass,
    start: rest.start,
    text: elevation >= 0 || !rest.pressed,
    ...rest?.buttonProps,
  });

  const affix = $derived(rest.clearable || rest.loading !== undefined || rest.validation);

  // TODO -- adjust raised to match pressed elevation
</script>

{#snippet before()}
  <NeoButton aria-label="Decrement number input" title="Decrement number input" onclick={decrement} {...buttonProps}>
    {#snippet icon()}
      <IconMinus width="1.25rem" height="1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

{#snippet after()}
  <NeoButton aria-label="Increment number input" title="Increment number input" onclick={increment} {...buttonProps}>
    {#snippet icon()}
      <IconAdd width="1.25rem" height="1.25rem" />
    {/snippet}
  </NeoButton>
{/snippet}

<svelte:element this={numberTag} class:neo-number-step={true} class:inset={elevation < -3} class:label={rest.label} class:affix {...numberProps}>
  <NeoInput bind:ref bind:labelRef bind:beforeRef bind:value bind:valid bind:dirty bind:touched {type} {before} {after} {...rest} />
</svelte:element>

<style lang="scss">
  .neo-number-step {
    :global(.neo-input) {
      /* Hide arrows - Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        margin: 0;
        appearance: none;
      }
    }

    /* Hide arrows -Firefox */
    :global(.neo-input[type='number']) {
      appearance: textfield;
    }

    :global(.neo-input-before),
    :global(.neo-input-after) {
      --neo-shadow-margin: auto;

      padding: 0 0.3rem !important;

      :global(.neo-button) {
        padding: 0.375rem;
      }
    }

    &:not(.label) {
      :global(.neo-input) {
        text-align: center;
      }

      &.affix {
        :global(.neo-input) {
          padding-left: 1.75rem;
        }
      }
    }

    &.inset {
      :global(.neo-input-before),
      :global(.neo-input-after) {
        --neo-shadow-margin: auto 0.25rem;
      }
    }
  }
</style>
