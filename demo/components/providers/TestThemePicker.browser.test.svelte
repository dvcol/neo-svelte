<script lang="ts">
  import NeoThemePicker from '~/providers/NeoThemePicker.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <span class="label">default</span>
      <NeoThemePicker />
    </div>
    <div class="cell">
      <span class="label">rounded</span>
      <NeoThemePicker rounded />
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
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .label {
    color: var(--neo-text-color-secondary);
    font-size: 0.75rem;
  }
</style>
