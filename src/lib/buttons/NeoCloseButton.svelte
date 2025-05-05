<script lang="ts">
  import type { NeoIconButtonProps } from '~/buttons/neo-icon-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoIconClose from '~/icons/NeoIconClose.svelte';

  let {
    // Button props
    ref = $bindable(),
    checked = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),

    // Other Props
    iconProps,
    ...rest
  }: NeoIconButtonProps = $props();

</script>

{#snippet icon()}
  <NeoIconClose size="0.875rem" {...iconProps} />
{/snippet}

<div class="neo-close-button">
  <NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {...rest} />
</div>

<style lang="scss">
  .neo-close-button {
    display: contents;

    --neo-btn-text-color-hover: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
    --neo-btn-text-color-active: var(--neo-close-color, rgb(255 0 0));

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
