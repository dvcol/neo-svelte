<script lang="ts">
  import type { NeoBadgeProps } from '~/badge/neo-badge.model.js';

  import NeoBadge from '~/badge/NeoBadge.svelte';

  interface HarnessProps extends Omit<NeoBadgeProps, 'children' | 'value'> {
    childrenText?: string;
    value?: string;
  }

  const { childrenText, value, ...rest }: HarnessProps = $props();
</script>

{#if childrenText !== undefined}
  <NeoBadge {...rest} {value}>
    <span data-testid="badge-children">{childrenText}</span>
  </NeoBadge>
{:else}
  <NeoBadge {...rest} {value} />
{/if}
