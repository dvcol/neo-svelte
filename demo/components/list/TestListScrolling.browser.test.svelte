<script lang="ts">
  import NeoList from '~/list/NeoList.svelte';

  type Item = { id: number; value: number; label: string };

  type Props = {
    items: Item[];
    virtual?: boolean;
    itemHeight?: number;
    onScrollingChange?: (value: boolean) => void;
  };

  const {
    items,
    virtual = false,
    itemHeight,
    onScrollingChange,
  }: Props = $props();

  let scrolling = $state(false);
  $effect(() => {
    onScrollingChange?.(scrolling);
  });
</script>

<div class="frame" data-testid="frame">
  <NeoList
    {items}
    {virtual}
    {itemHeight}
    bind:scrolling
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
