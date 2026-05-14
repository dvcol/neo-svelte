<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';

  import NeoSkeletonContainer from '~/skeletons/NeoSkeletonContainer.svelte';

  interface HarnessProps extends Omit<NeoSkeletonContainerProps, 'children' | 'content'> {
    skeletonText?: string;
    contentText?: string;
  }

  const { skeletonText, contentText, ...rest }: HarnessProps = $props();
</script>

{#snippet skeletonSnip()}
  <span data-testid="skeleton-children">{skeletonText}</span>
{/snippet}
{#snippet contentSnip()}
  <span data-testid="skeleton-content">{contentText}</span>
{/snippet}

<NeoSkeletonContainer
  {...rest}
  content={contentText !== undefined ? (contentSnip as Snippet) : undefined}
>
  {#if skeletonText !== undefined}
    {@render skeletonSnip()}
  {/if}
</NeoSkeletonContainer>
