<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoConfirmProps } from '~/floating/common/neo-confirm.model.js';

  import NeoConfirm from '~/floating/common/NeoConfirm.svelte';

  type HarnessProps = Partial<NeoConfirmProps> & {
    bodyText?: string;
    headerText?: string;
    body?: Snippet;
  };

  const { bodyText = 'body', headerText, body, ...rest }: HarnessProps = $props();
</script>

{#snippet headerSnippet()}
  <span data-testid="confirm-header-content">{headerText}</span>
{/snippet}

<NeoConfirm {...rest} header={headerText ? headerSnippet : rest.header}>
  {#if body}
    {@render body()}
  {:else}
    <span data-testid="confirm-body">{bodyText}</span>
  {/if}
</NeoConfirm>
