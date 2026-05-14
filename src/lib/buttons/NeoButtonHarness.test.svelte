<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';

  type HarnessProps = Partial<NeoButtonProps> & {
    bodyText?: string;
    body?: Snippet;
  };

  const { bodyText, body, ...rest }: HarnessProps = $props();
</script>

<NeoButton {...rest}>
  {#if body}
    {@render body()}
  {:else if bodyText !== undefined}
    <span data-testid="btn-body">{bodyText}</span>
  {/if}
</NeoButton>
