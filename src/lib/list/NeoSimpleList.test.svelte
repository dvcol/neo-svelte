<script lang="ts">
  import type { NeoSimpleListProps } from '~/list/neo-simple-list.model.js';

  import NeoSimpleList from '~/list/NeoSimpleList.svelte';

  type SimpleListInstance = ReturnType<typeof NeoSimpleList>;

  type HarnessProps = Partial<NeoSimpleListProps> & {
    instance?: SimpleListInstance;
    onInstance?: (instance: SimpleListInstance | undefined) => void;
  };

  let {
    ref = $bindable<HTMLElement | undefined>(undefined),
    instance = $bindable<SimpleListInstance | undefined>(undefined),
    onInstance,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onInstance?.(instance);
  });
</script>

<NeoSimpleList bind:this={instance} bind:ref {...rest} />
