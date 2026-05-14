<script lang="ts">
  import type { Snippet } from 'svelte';

  const { label = 'lazy', children }: { label?: string; children?: Snippet } = $props();
</script>

<div data-testid="lazy-target" data-label={label}>
  target:{label}
  {#if children}
    <span data-testid="lazy-target-children">{@render children()}</span>
  {/if}
</div>
