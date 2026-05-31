<script lang="ts">
  /*
    State-isolated grid for NeoCollapse: closed, open, focused (programmatic),
    disabled.
  */
  import { onMount } from 'svelte';

  import NeoCollapse from '~/collapse/NeoCollapse.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  let stage: HTMLElement | undefined = $state();

  onMount(() => {
    const focused = stage?.querySelector<HTMLElement>('[data-cell="focused"] .neo-collapse-trigger');
    focused?.focus({ preventScroll: true });
  });
</script>

<NeoThemeProvider>
  <div bind:this={stage} class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="closed">
        <span class="cell-label">closed</span>
        <NeoCollapse id="cl1" label="Closed" rounded elevation={1} unmountOnClose={false}>
          <p>Body</p>
        </NeoCollapse>
      </div>
      <div data-cell="open">
        <span class="cell-label">open</span>
        <NeoCollapse id="cl2" label="Open" open rounded elevation={1} unmountOnClose={false}>
          <p>Body content visible.</p>
        </NeoCollapse>
      </div>
      <div data-cell="focused">
        <span class="cell-label">focused</span>
        <NeoCollapse id="cl3" label="Focused" rounded elevation={1} unmountOnClose={false}>
          <p>Body</p>
        </NeoCollapse>
      </div>
      <div data-cell="disabled">
        <span class="cell-label">disabled</span>
        <NeoCollapse id="cl4" label="Disabled" rounded elevation={1} disabled unmountOnClose={false}>
          <p>Body</p>
        </NeoCollapse>
      </div>
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
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(20rem, 1fr));
    gap: 1.5rem;
  }

  .cell-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
