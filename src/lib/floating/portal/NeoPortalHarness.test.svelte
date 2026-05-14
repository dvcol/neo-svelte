<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoPortalProps } from '~/floating/portal/neo-portal.model.js';

  import NeoPortal from '~/floating/portal/NeoPortal.svelte';

  type HarnessProps = Partial<NeoPortalProps> & {
    bodyText?: string;
    body?: Snippet;
  };

  const { bodyText = 'portal body', body, enabled = false, ...rest }: HarnessProps = $props();
</script>

<div data-testid="portal-host">
  <NeoPortal {enabled} {...rest}>
    {#if body}
      {@render body()}
    {:else}
      <span data-testid="portal-content">{bodyText}</span>
    {/if}
  </NeoPortal>
</div>
