<script lang="ts">
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoEllipsis from '~/text/NeoEllipsis.svelte';

  const long = 'The quick brown fox jumps over the lazy dog. '.repeat(20);
  const short = 'Short string';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <span class="label">single line, long</span>
      <NeoEllipsis value={long} lines={1} />
    </div>
    <div class="cell">
      <span class="label">2 lines, long</span>
      <NeoEllipsis value={long} lines={2} />
    </div>
    <div class="cell">
      <span class="label">3 lines, long</span>
      <NeoEllipsis value={long} lines={3} />
    </div>
    <div class="cell">
      <span class="label">single line, short (no truncation)</span>
      <NeoEllipsis value={short} lines={1} />
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
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
    font-family: sans-serif;
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }

  .cell :global(.neo-ellipsis) {
    width: 100%;
    max-width: 18rem;
  }

  .label {
    color: var(--neo-text-color-secondary);
    font-size: 0.75rem;
  }
</style>
