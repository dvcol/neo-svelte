<script lang="ts">
  import type { NeoTooltipContext, NeoTooltipToggle } from '~/floating/tooltips/neo-tooltip.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoPopConfirm from '~/floating/tooltips/NeoPopConfirm.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = {
    placement?: string;
    closable?: boolean;
    rounded?: boolean;
    open?: boolean;
    unmountOnClose?: boolean;
  };

  let {
    placement = 'bottom',
    closable = true,
    rounded = false,
    open = $bindable(false),
    unmountOnClose = false,
  }: Props = $props();
</script>

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    <NeoPopConfirm
      {rounded}
      {closable}
      bind:open
      header="Confirm"
      tooltip="Are you sure?"
      tooltipProps={{ placement, openOnHover: false, openOnFocus: false, unmountOnClose }}
    >
      {#snippet children(_: NeoTooltipContext, toggle: NeoTooltipToggle)}
        <NeoButton class="trigger" text {rounded} onclick={() => toggle()}>Click me</NeoButton>
      {/snippet}
    </NeoPopConfirm>
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
