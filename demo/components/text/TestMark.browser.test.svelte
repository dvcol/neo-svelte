<script lang="ts">
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoMark from '~/text/NeoMark.svelte';

  const cells = [
    { value: 'The quick brown fox', filter: 'quick' },
    { value: 'The quick brown fox jumps over the lazy dog', filter: 'fox' },
    { value: 'foo bar baz foo bar baz', filter: 'bar' },
    { value: 'No match in this string', filter: 'xyz' },
    { value: 'Multiple matches: cat, cat, cat', filter: 'cat' },
    { value: 'Case-Insensitive Match', filter: 'match' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#each cells as cell, i (i)}
      <div class="cell">
        <NeoMark value={cell.value} filter={cell.filter} />
      </div>
    {/each}
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
    grid-template-columns: 1fr;
    gap: 1rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
    font-family: sans-serif;
  }

  .cell {
    padding: 1rem;
    background: var(--neo-background-color);
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }
</style>
