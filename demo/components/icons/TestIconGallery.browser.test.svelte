<script lang="ts">
  import * as Icons from '~/icons/index.js';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type IconCtor = typeof Icons.NeoIconAccount;

  const entries = Object.entries(Icons)
    .filter(([name, value]) => name.startsWith('NeoIcon') && typeof value === 'function')
    .sort(([a], [b]) => a.localeCompare(b)) as [string, IconCtor][];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#each entries as [name, Icon] (name)}
      <div class="cell" data-icon={name}>
        <div class="glyph">
          <Icon size="2rem" />
        </div>
        <span class="label">{name.replace('NeoIcon', '')}</span>
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

  :global(.neo-icon), :global(.neo-icon *), :global(svg), :global(svg *) {
    animation-play-state: paused !important;
  }

  .visual-stage {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 0.5rem;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 1rem;
    color: var(--neo-text-color);
    font-family: sans-serif;
    background: var(--neo-background-color);
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
    padding: 0.5rem 0.25rem;
    border: 1px solid var(--neo-border-color);
    border-radius: var(--neo-border-radius);
  }

  .glyph {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
  }

  .label {
    color: var(--neo-text-color-secondary);
    font-size: 0.625rem;
    text-align: center;
    overflow-wrap: anywhere;
  }
</style>
