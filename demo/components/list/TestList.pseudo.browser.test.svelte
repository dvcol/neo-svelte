<script lang="ts">
  import NeoList from '~/list/NeoList.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const items = [
    { id: 1, label: 'Alpha' },
    { id: 2, label: 'Beta' },
    { id: 3, label: 'Gamma' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="row">
      <div data-testid="target-idle">
        <NeoList elevation={-3} hover={4} rounded {items} />
      </div>
      <div data-testid="target">
        <NeoList elevation={-3} hover={4} rounded {items} />
      </div>
      <div data-testid="target-disabled">
        <NeoList elevation={-3} hover={4} rounded disabled {items} />
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
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(3, minmax(10rem, 1fr));
    gap: 1.5rem;
  }
</style>
