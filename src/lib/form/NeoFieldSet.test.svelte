<script lang="ts">
  import type { Snippet } from 'svelte';

  import NeoFieldSet from '~/form/NeoFieldSet.svelte';

  interface HarnessProps {
    legendText?: string;
    legendString?: string;
    childrenText?: string;
    [key: string]: unknown;
  }

  const { legendText, legendString, childrenText, ...rest }: HarnessProps = $props();

// Resolve the legend prop:
  // 1. legendText  → render snippet legend
  // 2. legendString → pass plain string to NeoFieldSet (covers string branch of `typeof legend === 'function'`)
  // 3. neither     → no legend
</script>

{#snippet legendSnip()}
  <span data-testid="legend-snip">{legendText}</span>
{/snippet}

{#if legendText !== undefined}
  <NeoFieldSet {...rest} legend={legendSnip as Snippet}>
    <span data-testid="field-content">{childrenText}</span>
  </NeoFieldSet>
{:else if legendString !== undefined}
  <NeoFieldSet {...rest} legend={legendString}>
    <span data-testid="field-content">{childrenText}</span>
  </NeoFieldSet>
{:else}
  <NeoFieldSet {...rest}>
    <span data-testid="field-content">{childrenText}</span>
  </NeoFieldSet>
{/if}
