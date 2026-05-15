<script lang="ts">
  import type { NeoCursorProps } from '~/cursor/neo-cursor.model.js';

  import NeoCursor from '~/cursor/NeoCursor.svelte';

  interface HarnessProps extends Omit<NeoCursorProps, 'children'> {
    childrenText?: string;
  }

  const { childrenText, ...rest }: HarnessProps = $props();
</script>

{#if childrenText !== undefined}
  <NeoCursor {...rest}>
    <span data-testid="cursor-children">{childrenText}</span>
  </NeoCursor>
{:else}
  <NeoCursor {...rest} />
{/if}
