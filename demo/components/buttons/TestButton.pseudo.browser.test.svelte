<script lang="ts">
  /*
    Pseudo-state grid harness for NeoButton. Renders three buttons in a row:

    - `target-idle`     — anchor, never receives user input
    - `target`          — the one driven by userEvent.hover / .focus / .tab
    - `target-disabled` — anchor for the disabled state visual

    Wide elevation/hover gap (elevation=-3 → hover=4) maximizes the box-shadow
    diff between the resting cascade and the :hover/:focus-visible cascade,
    so the screenshot diff against `pseudo-idle` is dominated by the cell that
    actually entered the pseudo state.

    `:active` is intentionally NOT covered here — vitest/browser's userEvent
    does not expose a way to hold a real mouse-down through screenshot
    capture, and NeoButton's `&.neo-pressed, &:active:not(...) { ... }`
    rule shares its body between the class branch and the pseudo branch.
    The existing `pressed={true}` cell in TestButton.states.browser.test.svelte
    pins the same cascade outcome.
  */
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoButton elevation={-3} hover={4} rounded data-testid="target-idle">Idle</NeoButton>
      <NeoButton elevation={-3} hover={4} rounded data-testid="target">Hover me</NeoButton>
      <NeoButton elevation={-3} hover={4} rounded disabled data-testid="target-disabled">Off</NeoButton>
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
    gap: 2rem;
    align-items: center;
  }
</style>
