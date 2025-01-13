<svelte:options customElement="neo-button-group" />

<script lang="ts">
  import NeoButtonGroup from './NeoButtonGroup.svelte';

  import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Bindings
    ref = $bindable(),

    // Other props
    ...rest
  }: NeoButtonGroupProps = $props();
  /* eslint-enable prefer-const */
</script>

<NeoButtonGroup bind:ref {...rest}>
  <slot />
</NeoButtonGroup>
