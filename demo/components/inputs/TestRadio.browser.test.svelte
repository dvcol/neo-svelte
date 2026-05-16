<script lang="ts">
  import NeoRadio from '~/inputs/NeoRadio.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="grid">
      <NeoRadio label="Unchecked" value="a" />
      <NeoRadio label="Checked" value="b" group="b" />
      <NeoRadio label="Disabled" value="c" disabled />

      <NeoRadio label="Disabled-on" value="d" group="d" disabled />
      <NeoRadio label="Glass" value="e" group="e" glass />
      <NeoRadio label="Tinted" value="f" group="f" tinted color="var(--neo-color-primary)" />

      <NeoRadio label="Sharp" value="g" group="g" rounded={false} />
      <NeoRadio label="Required" value="h" required />
      <NeoRadio label="Loading" value="i" group="i" loading />

      <!-- Demo-page variations: label-before, validation states, skeleton. -->
      <NeoRadio label="Label before" value="j" group="j" start />
      <NeoRadio label="Valid" value="k" group="k" valid validation />
      <NeoRadio label="Invalid" value="l" valid={false} validation />
      <NeoRadio label="Skeleton" value="m" skeleton />
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
