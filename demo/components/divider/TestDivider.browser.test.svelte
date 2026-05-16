<script lang="ts">
  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <section class="block" data-block="horizontal">
      <span class="row-label">flat</span>
      <NeoDivider elevation={0} />
      <span class="row-label">raised-2</span>
      <NeoDivider elevation={2} />
      <span class="row-label">inset-2</span>
      <NeoDivider elevation={-2} />
      <span class="row-label">raised-4</span>
      <NeoDivider elevation={4} />
      <span class="row-label">glass</span>
      <NeoDivider elevation={2} glass />
      <span class="row-label">sharp</span>
      <NeoDivider elevation={2} rounded={false} />
    </section>

    <section class="block" data-block="vertical">
      <span>before</span>
      <NeoDivider vertical elevation={2} height="2rem" />
      <span>after</span>
      <NeoDivider vertical elevation={-2} height="2rem" />
      <span>more</span>
      <NeoDivider vertical elevation={4} height="2rem" />
      <span>end</span>
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
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }

  .block[data-block="horizontal"] {
    display: grid;
    grid-template-columns: 6rem 24rem;
    gap: 0.75rem 1rem;
    align-items: center;
  }

  .block[data-block="vertical"] {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  .row-label {
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
