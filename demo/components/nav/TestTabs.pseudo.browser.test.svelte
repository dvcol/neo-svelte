<script lang="ts">
  import NeoTab from '~/nav/NeoTab.svelte';
  import NeoTabs from '~/nav/NeoTabs.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoTabs active="alpha" line data-testid="target">
      <NeoTab tabId="alpha" value="Alpha">Alpha</NeoTab>
      <NeoTab tabId="beta" value="Beta" data-testid="target-tab">Beta</NeoTab>
      <NeoTab tabId="gamma" value="Gamma">Gamma</NeoTab>
    </NeoTabs>
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }
</style>
