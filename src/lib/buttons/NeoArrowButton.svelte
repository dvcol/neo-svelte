<script lang="ts">
  import type { PointerEventHandler } from 'svelte/elements';

  import type { NeoArrowButtonProps } from '~/buttons/neo-arrow-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconArrow from '~/icons/IconArrow.svelte';
  import { IconArrowDirection } from '~/icons/icon.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // State
    hovered = $bindable(false),
    direction = IconArrowDirection.Right,

    // Button props
    checked = $bindable(false),
    disabled,
    readonly,

    // Events
    onpointerenter,
    onpointerleave,

    // Other Props
    arrowProps,
    ...rest
  }: NeoArrowButtonProps = $props();
  /* eslint-enable prefer-const */

  const reverse = $derived(direction === 'right');

  const onPointerEnter: PointerEventHandler<HTMLButtonElement> = e => {
    hovered = true;
    onpointerenter?.(e);
  };

  const onPointerLeave: PointerEventHandler<HTMLButtonElement> = e => {
    hovered = false;
    onpointerleave?.(e);
  };
</script>

{#snippet icon()}
  <IconArrow {direction} expanded={(checked || hovered) && !disabled && !readonly} {...arrowProps} />
{/snippet}

<NeoButton bind:checked {icon} {reverse} {disabled} {readonly} {...rest} onpointerenter={onPointerEnter} onpointerleave={onPointerLeave} />
