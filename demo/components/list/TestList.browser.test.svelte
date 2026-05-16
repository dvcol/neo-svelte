<script lang="ts">
  import NeoList from '~/list/NeoList.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const sections = [
    {
      id: 'fruit',
      label: 'Fruit',
      items: [
        { id: 'a', value: 'apple', label: 'Apple', description: 'Red' },
        { id: 'b', value: 'banana', label: 'Banana', description: 'Yellow' },
        { id: 'c', value: 'cherry', label: 'Cherry', description: 'Red' },
      ],
    },
    {
      id: 'veg',
      label: 'Vegetables',
      divider: true,
      items: [
        { id: 'd', value: 'carrot', label: 'Carrot', description: 'Orange' },
        { id: 'e', value: 'eggplant', label: 'Eggplant', description: 'Purple', disabled: true },
        { id: 'f', value: 'fennel', label: 'Fennel', description: 'Green' },
      ],
    },
  ];

  const flat = [
    { id: '1', value: '1', label: 'Alpha', description: 'first item' },
    { id: '2', value: '2', label: 'Beta', description: 'second item' },
    { id: '3', value: '3', label: 'Gamma', description: 'third item' },
    { id: '4', value: '4', label: 'Delta', description: 'fourth item' },
    { id: '5', value: '5', label: 'Epsilon', description: 'fifth item' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="grid">
      <div class="column">
        <span class="cell-label">sectioned + select + divider</span>
        <NeoList items={sections} select rounded width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">multi-select (preselected)</span>
        <NeoList items={flat} select multiple selected={[{ index: 0 }, { index: 2 }]} rounded width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">tinted</span>
        <NeoList items={flat} select rounded tinted color="var(--neo-color-primary)" width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">glass</span>
        <NeoList items={flat} select rounded glass width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">disabled list</span>
        <NeoList items={flat} select disabled rounded width="20rem" height="18rem" />
      </div>

      <div class="column">
        <span class="cell-label">empty</span>
        <NeoList items={[]} rounded width="20rem" height="18rem" />
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
