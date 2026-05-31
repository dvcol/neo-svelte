<script lang="ts">
  /*
    Snapshots three combinations the existing `:not()` chains in
    NeoButtonGroup.svelte were guarding:

    1. flat + non-borderless — :218 chain. Guards the flat-on-focus-visible
       hover propagation pattern.
    2. vertical orientation — :333 (`&:not(.neo-vertical) :global(.neo-divider)`).
       Vertical layout swaps divider orientation.
    3. children with disabled — :281/:282 chains. Propagation guard for
       child :disabled state.
  */
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="grid">
      <div data-cell="flat-only">
        <span class="cell-label">flat (not borderless)</span>
        <NeoButtonGroup rounded elevation={0}>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
        </NeoButtonGroup>
      </div>
      <div data-cell="vertical">
        <span class="cell-label">vertical</span>
        <NeoButtonGroup rounded elevation={2} vertical>
          <NeoButton>One</NeoButton>
          <NeoButton>Two</NeoButton>
          <NeoButton>Three</NeoButton>
        </NeoButtonGroup>
      </div>
      <div data-cell="children-disabled">
        <span class="cell-label">child disabled</span>
        <NeoButtonGroup rounded elevation={2}>
          <NeoButton>Active</NeoButton>
          <NeoButton disabled>Off</NeoButton>
        </NeoButtonGroup>
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
    grid-template-columns: repeat(3, minmax(14rem, 1fr));
    gap: 1.5rem;
  }

  .cell-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
