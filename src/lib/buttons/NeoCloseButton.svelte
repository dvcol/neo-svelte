<script lang="ts">
  import type { NeoIconButtonProps } from '~/buttons/neo-icon-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconClose from '~/icons/IconClose.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
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
  /* eslint-enable prefer-const */
</script>

{#snippet icon()}
  <IconClose size="0.875rem" {...iconProps} />
{/snippet}

<div class="neo-close-button">
  <NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {...rest} />
</div>

<style lang="scss">
  .neo-close-button {
    display: contents;

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
