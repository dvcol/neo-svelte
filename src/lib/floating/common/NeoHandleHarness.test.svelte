<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoHandlePlacements, NeoHandleProps } from '~/floating/common/neo-handle.model.js';

  import NeoHandle from '~/floating/common/NeoHandle.svelte';

  type HarnessProps = Partial<NeoHandleProps> & {
    bodyText?: string;
    body?: Snippet;
    handleSnippet?: Snippet<[NeoHandlePlacements]>;
  };

  const { bodyText = 'body', body, handleSnippet, ...rest }: HarnessProps = $props();
</script>

<NeoHandle {...rest} handle={handleSnippet ?? rest.handle}>
  {#if body}
    {@render body()}
  {:else}
    <span data-testid="handle-body">{bodyText}</span>
  {/if}
</NeoHandle>
