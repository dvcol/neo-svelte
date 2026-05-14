<script lang="ts">
  import type { NeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

  import { onMount } from 'svelte';

  import { getNeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

  const { onContext }: { onContext: (ctx: NeoPortalContext | undefined) => void } = $props();

  const context = getNeoPortalContext();

  onMount(() => {
    onContext(context);
  });
</script>
