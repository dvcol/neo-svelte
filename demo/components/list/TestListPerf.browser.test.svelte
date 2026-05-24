<script lang="ts">
  import type { NeoListProps } from '~/list/neo-list.model.js';

  import NeoList from '~/list/NeoList.svelte';

  type Item = { id: string; label: string; value: number };

  type PerfMethods = {
    push: (item: Item) => void;
    pop: () => Item | undefined;
    size: () => number;
  };

  type Props = {
    initialItems: Item[];
    virtual?: boolean;
    methods?: PerfMethods;
  };

  let { initialItems, virtual = false, methods = $bindable() }: Props = $props();

  // svelte-ignore state_referenced_locally
  const items = $state<Item[]>([...initialItems]);

  methods = {
    push: (item) => {
      items.push(item);
    },
    pop: () => items.pop(),
    size: () => items.length,
  };

  const props = $derived<NeoListProps>({
    items,
    virtual,
    height: '20rem',
    width: '20rem',
  });
</script>

<div class="frame" data-testid="perf-frame">
  <NeoList aria-label="Perf list" {...props} />
</div>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .frame {
    display: block;
    width: 22rem;
    padding: 1rem;
  }
</style>
