<script lang="ts">
  import type { NeoListProps } from '~/list/neo-list.model.js';

  import NeoList from '~/list/NeoList.svelte';

  type Item = { id: number; value: number; label: string };

  type Props = {
    items: Item[];
    virtual?: boolean;
    itemHeight?: number;
    inAction?: NeoListProps<Item>['in'];
    outAction?: NeoListProps<Item>['out'];
  };

  const {
    items,
    virtual = false,
    itemHeight,
    inAction,
    outAction,
  }: Props = $props();
</script>

<div class="frame" data-testid="frame">
  <NeoList
    {items}
    {virtual}
    {itemHeight}
    in={inAction}
    out={outAction}
    width="20rem"
    height="15rem"
  />
</div>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .frame {
    width: 20rem;
    height: 15rem;
  }
</style>
