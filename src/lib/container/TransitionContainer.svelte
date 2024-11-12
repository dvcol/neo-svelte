<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children?: Snippet } = $props();
</script>

<div class="transition-container">
  {@render children?.()}
</div>

<style lang="scss">
  .transition-container {
    display: grid;
    grid-template-areas: 'transition';

    :global(> *) {
      grid-area: transition;
    }
  }
</style>
