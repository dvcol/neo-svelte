<script lang="ts">
  import type { NeoCollapseProps } from '~/collapse/neo-collapse.model.js';

  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type HarnessProps = Partial<NeoCollapseProps> & { bodyText?: string };

  let {
    open = $bindable(false),
    label = 'Collapse trigger',
    bodyText = 'Collapse content body',
    unmountOnClose = false,
    ...rest
  }: HarnessProps = $props();
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoCollapse bind:open {label} {unmountOnClose} {...rest}>
      <p data-testid="collapse-body">{bodyText}</p>
    </NeoCollapse>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }
</style>
