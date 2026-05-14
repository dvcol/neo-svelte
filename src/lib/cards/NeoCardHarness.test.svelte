<script lang="ts">
  import type { Snippet } from 'svelte';

  import NeoCard from '~/cards/NeoCard.svelte';

  interface HarnessProps {
    contentText?: string;
    headerText?: string;
    footerText?: string;
    actionText?: string;
    mediaText?: string;
    [key: string]: unknown;
  }

  const {
    contentText,
    headerText,
    footerText,
    actionText,
    mediaText,
    ...rest
  }: HarnessProps = $props();
</script>

{#snippet headerSnip()}
  <span data-testid="card-header">{headerText}</span>
{/snippet}
{#snippet footerSnip()}
  <span data-testid="card-footer">{footerText}</span>
{/snippet}
{#snippet actionSnip()}
  <span data-testid="card-action">{actionText}</span>
{/snippet}
{#snippet mediaSnip()}
  <span data-testid="card-media">{mediaText}</span>
{/snippet}

<NeoCard
  {...rest}
  header={headerText !== undefined ? (headerSnip as Snippet) : undefined}
  footer={footerText !== undefined ? (footerSnip as Snippet) : undefined}
  action={actionText !== undefined ? (actionSnip as Snippet) : undefined}
  media={mediaText !== undefined ? (mediaSnip as Snippet) : undefined}
>
  <span data-testid="card-content">{contentText}</span>
</NeoCard>
