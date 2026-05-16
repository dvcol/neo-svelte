<script lang="ts">
  import NeoNativeSelect from '~/inputs/NeoNativeSelect.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="row">
      <span class="cell-label">idle</span>
      <NeoNativeSelect label="Idle" {options} />

      <span class="cell-label">selected</span>
      <NeoNativeSelect label="Selected" value="banana" {options} />

      <span class="cell-label">disabled</span>
      <NeoNativeSelect label="Disabled" value="apple" {options} disabled />
    </section>

    <section class="row">
      <span class="cell-label">glass</span>
      <NeoNativeSelect label="Glass" value="apple" {options} glass />

      <span class="cell-label">tinted</span>
      <NeoNativeSelect label="Tinted" value="apple" {options} tinted color="var(--neo-color-primary)" />

      <span class="cell-label">rounded</span>
      <NeoNativeSelect label="Rounded" value="apple" {options} rounded />
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
    grid-template-columns: 5rem 14rem 5rem 14rem 5rem 14rem;
    gap: 0.75rem 1rem;
    align-items: center;
  }

  .cell-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
