<script lang="ts">
  import type { NeoArrowButtonProps } from '~/buttons/neo-arrow-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { NeoIconArrowDirection } from '~/icons/neo-icon.model.js';
  import NeoIconArrow from '~/icons/NeoIconArrow.svelte';

  let {
    // State
    direction = NeoIconArrowDirection.Right,

    // Button props
    ref = $bindable(),
    checked = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    disabled,
    readonly,

    // Other Props
    arrowProps,
    ...rest
  }: NeoArrowButtonProps = $props();

  const reverse = $derived(direction === 'right');
</script>

{#snippet icon()}
  <NeoIconArrow {direction} expanded={(checked || hovered || focused) && !disabled && !readonly} {...arrowProps} />
{/snippet}

<NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {reverse} {disabled} {readonly} {...rest} />
