<script lang="ts">
  /*
    Pseudo-state grid harness for NeoCard. NeoCard's :hover / :focus-within
    rules sit at NeoCard.svelte:354/463+ — `&:focus-within, &.neo-hover:hover`
    sets `box-shadow: var(--neo-card-box-shadow-hover, var(--neo-card-box-shadow))`.
    The wide elevation/hover gap (elevation=-3 hover=4) makes the diff visible.
  */
  import NeoCard from '~/cards/NeoCard.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <NeoCard elevation={-3} hover={4} rounded data-testid="target-idle" width={{ absolute: '10rem' }} height={{ absolute: '5rem' }}>
        <span>Idle</span>
      </NeoCard>
      <NeoCard elevation={-3} hover={4} rounded data-testid="target" width={{ absolute: '10rem' }} height={{ absolute: '5rem' }}>
        <span>Hover me</span>
      </NeoCard>
      <NeoCard elevation={-3} hover={4} rounded disabled data-testid="target-disabled" width={{ absolute: '10rem' }} height={{ absolute: '5rem' }}>
        <span>Off</span>
      </NeoCard>
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
