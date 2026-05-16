<script lang="ts">
  import NeoImage from '~/media/NeoImage.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  // 8x8 solid magenta PNG — visible, deterministic.
  const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGM449KBFTEMLQkA7BFmAdN1sbkAAAAASUVORK5CYII=';
  const FALLBACK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEklEQVR4nGOorTrEMLQkAGYDABnZAfJgmZjnAAAAAElFTkSuQmCC';
  const BROKEN = 'data:image/png;base64,not-a-real-png';

  const {
    src,
    alt = 'fixture',
    rounded = true,
    skeleton = false,
    fallback,
    variant = 'single',
  }: {
    src?: string;
    alt?: string;
    rounded?: boolean;
    skeleton?: boolean;
    fallback?: string;
    variant?: 'single' | 'matrix';
  } = $props();
</script>

<NeoThemeProvider>
  {#if variant === 'single'}
    <div class="visual-stage" data-testid="visual-stage">
      <div class="frame">
        <NeoImage {src} {alt} {rounded} {skeleton} {fallback} ratio="1" />
      </div>
    </div>
  {:else}
    <div class="visual-stage matrix" data-testid="visual-stage">
      <section class="grid">
        <div class="column">
          <span class="cell-label">loaded · 1:1 · rounded</span>
          <div class="frame"><NeoImage src={PNG} alt="loaded" rounded ratio="1" /></div>
        </div>
        <div class="column">
          <span class="cell-label">loaded · 16:9 · sharp</span>
          <div class="frame wide"><NeoImage src={PNG} alt="wide" rounded={false} ratio="16/9" fit="cover" /></div>
        </div>
        <div class="column">
          <span class="cell-label">loaded · 3:2 · glass skeleton</span>
          <div class="frame"><NeoImage src={PNG} alt="glass" rounded glass ratio="3/2" /></div>
        </div>

        <div class="column">
          <span class="cell-label">skeleton · rounded</span>
          <div class="frame"><NeoImage skeleton alt="skeleton" rounded ratio="1" /></div>
        </div>
        <div class="column">
          <span class="cell-label">skeleton · sharp</span>
          <div class="frame"><NeoImage skeleton alt="sharp" rounded={false} ratio="1" /></div>
        </div>
        <div class="column">
          <span class="cell-label">skeleton · glass</span>
          <div class="frame"><NeoImage skeleton glass rounded alt="glass-skel" ratio="1" /></div>
        </div>

        <div class="column">
          <span class="cell-label">error · no fallback · alt visible</span>
          <div class="frame"><NeoImage src={BROKEN} alt="alt visible" showAltText rounded ratio="1" /></div>
        </div>
        <div class="column">
          <span class="cell-label">error → fallback</span>
          <div class="frame"><NeoImage src={BROKEN} fallback={FALLBACK} alt="fallback" rounded ratio="1" /></div>
        </div>
        <div class="column">
          <span class="cell-label">loaded · fit:contain</span>
          <div class="frame wide"><NeoImage src={PNG} alt="contain" rounded ratio="16/9" fit="contain" /></div>
        </div>
      </section>
    </div>
  {/if}
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

  .visual-stage.matrix {
    flex-direction: column;
    align-items: stretch;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 1.25rem 2rem;
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

  .frame {
    width: 8rem;
    height: 8rem;
  }

  .frame.wide {
    width: 12rem;
    height: auto;
  }
</style>
