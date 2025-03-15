<script lang="ts">
  import type { NeoArrowButtonProps } from '~/buttons/neo-arrow-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconArrow from '~/icons/IconArrow.svelte';
  import { IconArrowDirection } from '~/icons/icon.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
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
  /* eslint-enable prefer-const */

  const reverse = $derived(direction === 'right');
</script>

{#snippet icon()}
  <IconArrow {direction} expanded={(checked || hovered || focused) && !disabled && !readonly} {...arrowProps} />
{/snippet}

<NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {reverse} {disabled} {readonly} {...rest} />
