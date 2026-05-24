<script lang="ts">
  import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoMenu from '~/floating/menu/NeoMenu.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = {
    placement?: string;
    keepOpenOnSelect?: boolean;
    keepOpenOnHover?: boolean;
    rounded?: boolean;
    reverse?: boolean;
    nested?: number;
    open?: boolean;
    openOnHover?: boolean;
    unmountOnClose?: boolean;
  };

  let {
    placement = 'bottom-start',
    keepOpenOnSelect = false,
    keepOpenOnHover = false,
    rounded = false,
    reverse = false,
    nested = 1,
    open = $bindable(false),
    openOnHover = false,
    unmountOnClose = false,
  }: Props = $props();

  const baseItems: NeoMenuItem[] = [
    { value: 'Item 1' },
    { value: 'Item 2' },
    { value: 'Item 3' },
  ];

  const buildNestedItems = (depth: number): NeoMenuItem[] => {
    if (depth <= 0) return baseItems;
    const child = buildNestedItems(depth - 1);
    return [
      { value: 'Item 1' },
      { value: 'Item 2 (sub)', items: child, divider: true },
      { value: 'Item 3' },
      { value: 'Item 4' },
    ];
  };

  const items = $derived(buildNestedItems(nested));
</script>

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    <NeoMenu
      bind:open
      {items}
      {placement}
      {keepOpenOnSelect}
      {keepOpenOnHover}
      {openOnHover}
      {rounded}
      {reverse}
      {unmountOnClose}
    >
      <NeoButton class="trigger" elevation="0" toggle bind:checked={open} data-testid="trigger-button">Open Menu</NeoButton>
    </NeoMenu>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>
