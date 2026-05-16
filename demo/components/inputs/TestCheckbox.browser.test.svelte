<script lang="ts">
  import NeoCheckbox from '~/inputs/NeoCheckbox.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="grid">
      <NeoCheckbox label="Unchecked" checked={false} />
      <NeoCheckbox label="Checked" checked />
      <NeoCheckbox label="Indeterminate" indeterminate />

      <NeoCheckbox label="Disabled off" checked={false} disabled />
      <NeoCheckbox label="Disabled on" checked disabled />
      <NeoCheckbox label="Disabled mid" indeterminate disabled />

      <NeoCheckbox label="Glass" checked glass />
      <NeoCheckbox label="Tinted" checked tinted color="var(--neo-color-primary)" />
      <NeoCheckbox label="Rounded" checked rounded />

      <NeoCheckbox label="Valid" checked valid validation />
      <NeoCheckbox label="Invalid" checked={false} valid={false} validation />
      <NeoCheckbox label="Required" checked required />

      <!-- Demo-page variations: label-before via start, loading, skeleton,
           and indeterminate × invalid combo. -->
      <NeoCheckbox label="Label before" checked start />
      <NeoCheckbox label="Loading" checked loading />
      <NeoCheckbox label="Skeleton" skeleton />
      <NeoCheckbox label="Indeterminate invalid" indeterminate valid={false} validation />
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
    gap: 1.5rem 2rem;
    align-items: center;
  }
</style>
