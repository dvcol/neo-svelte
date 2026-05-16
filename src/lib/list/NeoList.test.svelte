<script lang="ts">
  import type { NeoListProps } from '~/list/neo-list.model.js';

  import NeoList from '~/list/NeoList.svelte';

  type ListInstance = ReturnType<typeof NeoList>;

  type HarnessProps = Partial<NeoListProps> & {
    instance?: ListInstance;
    onInstance?: (instance: ListInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLElement | undefined>(undefined),
    instance = $bindable<ListInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoList bind:this={instance} bind:ref {...rest} />
