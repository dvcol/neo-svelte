<script lang="ts">
  import NeoList from '~/list/NeoList.svelte';
  import NeoListSearch from '~/list/NeoListSearch.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const items = [
    { id: 'a', value: 'apple', label: 'Apple', description: 'Red' },
    { id: 'b', value: 'banana', label: 'Banana', description: 'Yellow' },
    { id: 'c', value: 'cherry', label: 'Cherry', description: 'Red' },
    { id: 'd', value: 'date', label: 'Date', description: 'Brown' },
    { id: 'e', value: 'elderberry', label: 'Elderberry', description: 'Purple' },
  ];

  const filteredOnly = [
    { id: 'b', value: 'banana', label: 'Banana', description: 'Yellow' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="grid">
      <div class="column">
        <span class="cell-label">populated</span>
        <NeoList {items} select rounded width="20rem" height="20rem">
          {#snippet before(context)}
            <NeoListSearch rounded {context} />
          {/snippet}
        </NeoList>
      </div>

      <div class="column">
        <span class="cell-label">filtered (single match)</span>
        <NeoList items={filteredOnly} select rounded width="20rem" height="20rem">
          {#snippet before(context)}
            <NeoListSearch rounded {context} />
          {/snippet}
        </NeoList>
      </div>

      <div class="column">
        <span class="cell-label">no results</span>
        <NeoList items={[]} rounded width="20rem" height="20rem">
          {#snippet before(context)}
            <NeoListSearch rounded {context} />
          {/snippet}
        </NeoList>
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
