<script lang="ts">
  import NeoSimpleList from '~/list/NeoSimpleList.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const items = [
    { id: 'a', value: 'alpha', label: 'Alpha', description: 'first item' },
    { id: 'b', value: 'beta', label: 'Beta', description: 'second item' },
    { id: 'c', value: 'charlie', label: 'Charlie', description: 'third item', divider: true },
    { id: 'd', value: 'delta', label: 'Delta', description: 'fourth item' },
    { id: 'e', value: 'echo', label: 'Echo', description: 'fifth item', disabled: true },
    { id: 'f', value: 'foxtrot', label: 'Foxtrot', description: 'sixth item', readonly: true },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="grid">
      <div class="column">
        <span class="cell-label">items</span>
        <NeoSimpleList {items} rounded width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">loading</span>
        <NeoSimpleList items={[]} loading rounded width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">empty</span>
        <NeoSimpleList items={[]} rounded width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">tinted</span>
        <NeoSimpleList {items} rounded tinted color="var(--neo-color-primary)" width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">glass</span>
        <NeoSimpleList {items} rounded glass width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">flat (sharp)</span>
        <NeoSimpleList {items} elevation="0" width="20rem" height="18rem" />
      </div>
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
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 1.5rem;
    align-items: start;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cell-label {
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
