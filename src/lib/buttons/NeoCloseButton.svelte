<script lang="ts">
  import type { NeoCloseButtonProps } from '~/buttons/neo-close-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconClose from '~/icons/NeoIconClose.svelte';
  import { getColorVariable } from '~/utils/index.js';

  let {
    // Button props
    ref = $bindable(),
    checked = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),

    // States
    hoverColor,
    size,
    inline,

    // Other Props
    iconProps,
    ...rest
  }: NeoCloseButtonProps = $props();

  const iconSize = $derived.by(() => {
    switch (size) {
      case 'sm':
        return 0.6875;
      case 'md':
        return 0.75;
      case 'lg':
        return 1;
      default:
        return 0.875;
    }
  });
</script>

{#snippet icon()}
  <NeoIconClose size="{iconSize}rem" {...iconProps} />
{/snippet}

<div
  data-size={size}
  class="neo-close-button"
  class:neo-inline={inline}
  style:--neo-close-color={getColorVariable(hoverColor)}
>
  <NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {...rest} />
</div>

<style lang="scss">
  .neo-close-button {
    display: contents;

    --neo-btn-text-color-hover: oklch(from var(--neo-close-color) l c h / 75%);
    --neo-btn-text-color-active: var(--neo-close-color, rgb(255 0 0));

   &.neo-inline :global(.neo-button) {
      margin-block: auto;
    }

    &[data-size='md'],
    &[data-size='sm'] {
      --neo-btn-padding-empty: var(--neo-btn-close-padding, var(--neo-gap-3xs, 0.3125rem));
      --neo-btn-padding: var(--neo-btn-close-padding, var(--neo-gap-3xs, 0.3125rem));
      --neo-btn-margin: var(--neo-btn-close-margin, var(--neo-gap-3xs, 0.3125rem));
    }

    > :global(.neo-button) {
      :global(.neo-icon) {
        transition: rotate 0.3s ease-out;
      }

      &:focus,
      &:hover {
        :global(.neo-icon) {
          transition: rotate 0.4s ease;
          rotate: 90deg;
        }
      }
    }
  }
</style>
