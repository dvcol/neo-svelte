<script lang="ts">
  import type { NeoListProps } from '~/list/neo-list.model.js';

  import NeoList from '~/list/NeoList.svelte';

  type Props = {
    items: NeoListProps['items'];
    virtual?: boolean;
    itemHeight?: number;
  };

  const {
    items,
    virtual = false,
    itemHeight,
  }: Props = $props();
</script>

<div class="frame" data-testid="frame">
  <NeoList
    {items}
    {virtual}
    {itemHeight}
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
