<script lang="ts">
  import { onMount } from 'svelte';

  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  /*
    State-isolated grid: one NeoInput per visual state we care about. Each cell
    forces the state via either a bindable (hovered/focused), a static prop
    (pressed/disabled), or a programmatic `.focus()` call (focus-within) after
    mount. Snapshots pin that the cascade renders each state correctly *in
    isolation*, separate from the variant matrix.
  */

  let stage: HTMLElement | undefined = $state();

  onMount(() => {
    // Force focus on the input that should display :focus-within state.
    const focusWithinCell = stage?.querySelector<HTMLElement>('[data-cell="focus-within"] .neo-input');
    focusWithinCell?.focus({ preventScroll: true });
  });
</script>

<NeoThemeProvider>
  <div bind:this={stage} class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">idle</span>
      <div data-cell="idle"><NeoInput label="Idle" value="value" /></div>

      <span class="cell-label">hovered</span>
      <div data-cell="hovered"><NeoInput label="Hovered" value="value" hovered /></div>

      <span class="cell-label">focused</span>
      <div data-cell="focused"><NeoInput label="Focused" value="value" focused /></div>
    </section>

    <section class="row">
      <span class="cell-label">focus-within</span>
      <div data-cell="focus-within"><NeoInput label="Focus-within" value="value" /></div>

      <span class="cell-label">pressed</span>
      <div data-cell="pressed"><NeoInput label="Pressed" value="value" pressed /></div>

      <span class="cell-label">disabled</span>
      <div data-cell="disabled"><NeoInput label="Disabled" value="value" disabled /></div>
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
    align-items: center;
  }

  .cell-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
