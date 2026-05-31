<script lang="ts">
  /*
    State-isolated grid for NeoTextarea: idle, hovered, focused, focus-within
    (programmatic), pressed, disabled.
  */
  import { onMount } from 'svelte';

  import NeoTextarea from '~/inputs/common/NeoTextarea.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  let stage: HTMLElement | undefined = $state();

  onMount(() => {
    const focusWithinCell = stage?.querySelector<HTMLElement>('[data-cell="focus-within"] textarea');
    focusWithinCell?.focus({ preventScroll: true });
  });
</script>

<NeoThemeProvider>
  <div bind:this={stage} class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">idle</span>
      <div data-cell="idle"><NeoTextarea label="Idle" value="text" /></div>

      <span class="cell-label">hovered</span>
      <div data-cell="hovered"><NeoTextarea label="Hovered" value="text" hovered /></div>

      <span class="cell-label">focused</span>
      <div data-cell="focused"><NeoTextarea label="Focused" value="text" focused /></div>
    </section>
    <section class="row">
      <span class="cell-label">focus-within</span>
      <div data-cell="focus-within"><NeoTextarea label="Focus-within" value="text" /></div>

      <span class="cell-label">pressed</span>
      <div data-cell="pressed"><NeoTextarea label="Pressed" value="text" pressed /></div>

      <span class="cell-label">disabled</span>
      <div data-cell="disabled"><NeoTextarea label="Disabled" value="text" disabled /></div>
    </section>
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
    gap: 1.5rem;
    align-items: stretch;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: 6rem 14rem 6rem 14rem 6rem 14rem;
    gap: 0.75rem 1rem;
    align-items: start;
  }

  .cell-label {
    padding-top: 0.5rem;
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
