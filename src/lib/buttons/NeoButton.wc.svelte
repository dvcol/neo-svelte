<svelte:options customElement="neo-button" />

<script lang="ts">
  import NeoButton from './NeoButton.svelte';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Bindings
    ref = $bindable(),
    checked = $bindable(false),

    // Other props
    ...rest
  }: NeoButtonProps = $props();
  /* eslint-enable prefer-const */
</script>

<NeoButton bind:ref bind:checked {...rest}>
  <slot />
</NeoButton>
