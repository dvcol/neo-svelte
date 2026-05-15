<script lang="ts">
  import type { Snippet } from 'svelte';

  import NeoPortalTarget from '~/floating/portal/NeoPortalTarget.svelte';

  const { children }: { children?: Snippet } = $props();
</script>

<div data-testid="portal-target-host">
  <NeoPortalTarget>
    {#if children}
      {@render children()}
    {:else}
      <span data-testid="portal-target-body">target body</span>
    {/if}
  </NeoPortalTarget>
</div>
