<script lang="ts">
  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoTextarea elevation={-3} hover={4} rounded label="Idle" data-testid="target-idle" />
      <NeoTextarea elevation={-3} hover={4} rounded label="Hover me" data-testid="target" />
      <NeoTextarea elevation={-3} hover={4} rounded disabled label="Off" value="disabled" data-testid="target-disabled" />
    </div>
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

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: flex-start;
  }
</style>
