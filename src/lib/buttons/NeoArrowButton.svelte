<script lang="ts">
  import type { NeoArrowButtonProps } from '~/buttons/neo-arrow-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import { IconArrowDirection } from '~/icons/icon.model.js';
  import IconArrow from '~/icons/IconArrow.svelte';

  let {
    // State
    direction = IconArrowDirection.Right,

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
  <IconArrow {direction} expanded={(checked || hovered || focused) && !disabled && !readonly} {...arrowProps} />
{/snippet}

<NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {reverse} {disabled} {readonly} {...rest} />
