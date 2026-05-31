<script lang="ts">
  /*
    State-isolated grid for NeoAccordion: idle (all closed), expanded (first
    open), focused (first trigger focused), disabled (whole accordion).
  */
  import { onMount } from 'svelte';

  import NeoAccordion from '~/collapse/NeoAccordion.svelte';
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
      <div data-cell="idle">
        <span class="cell-label">idle</span>
        <NeoAccordion rounded elevation={1}>
          <NeoCollapse id="i1" label="One" />
          <NeoCollapse id="i2" label="Two" />
        </NeoAccordion>
      </div>

      <div data-cell="expanded">
        <span class="cell-label">expanded</span>
        <NeoAccordion rounded elevation={1}>
          <NeoCollapse id="e1" label="One" open unmountOnClose={false}>
            <p>Body content for expanded section.</p>
          </NeoCollapse>
          <NeoCollapse id="e2" label="Two" />
        </NeoAccordion>
      </div>

      <div data-cell="focused">
        <span class="cell-label">focused</span>
        <NeoAccordion rounded elevation={1}>
          <NeoCollapse id="f1" label="One" />
          <NeoCollapse id="f2" label="Two" />
        </NeoAccordion>
      </div>

      <div data-cell="disabled">
        <span class="cell-label">disabled</span>
        <NeoAccordion rounded elevation={1} disabled>
          <NeoCollapse id="d1" label="One" />
          <NeoCollapse id="d2" label="Two" />
        </NeoAccordion>
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
