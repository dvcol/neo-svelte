<script lang="ts">
  import type { NeoListContext, NeoListProps } from '~/list/neo-list.model.js';

  import NeoList from '~/list/NeoList.svelte';

  type ListInstance = ReturnType<typeof NeoList>;

  type HarnessProps = Partial<NeoListProps> & {
    instance?: ListInstance;
    onInstance?: (instance: ListInstance | undefined) => void;
    contextProbe?: boolean;
  };

  let {
    ref = $bindable<HTMLElement | undefined>(undefined),
    instance = $bindable<ListInstance | undefined>(undefined),
    onInstance,
    contextProbe = false,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

{#snippet contextAfter(context: NeoListContext)}
  {#key context}
    <output data-testid="list-context-selection">
      {#if Array.isArray(context.selected)}
        {context.selected.map(item => item.index).join(',') || 'none'}
      {:else}
        {context.selected?.index ?? 'none'}
      {/if}
    </output>
  {/key}
{/snippet}

<NeoList bind:this={instance} bind:ref {...rest} after={contextProbe ? contextAfter : rest.after} />
