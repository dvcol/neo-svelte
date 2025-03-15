<script lang="ts">
  import type { NeoIconButtonProps } from '~/buttons/neo-icon-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import IconCancel from '~/icons/IconCancel.svelte';

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
  <IconCancel {...iconProps} />
{/snippet}

<div class="neo-cancel-button">
  <NeoButton bind:ref bind:checked bind:hovered bind:focused {icon} {...rest} />
</div>

<style lang="scss">
  .neo-cancel-button {
    display: contents;

    > :global(.neo-button) {
      :global(.neo-icon) {
        transition: rotate 0.3s ease;
      }

      &:focus,
      &:hover {
        :global(.neo-icon) {
          transition: rotate 0.3s ease-in-out;
          rotate: -90deg;
        }
      }
    }
  }
</style>
