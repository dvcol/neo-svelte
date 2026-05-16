<script lang="ts">
  import NeoFilePicker from '~/inputs/NeoFilePicker.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  function makeFiles(...names: string[]): FileList {
    const dt = new DataTransfer();
    for (const name of names) dt.items.add(new File(['data'], name, { type: 'text/plain' }));
    return dt.files;
  }

  let {
    // Backwards-compat for existing single-picker tests.
    label,
    multiple = false,
    rounded = true,
    loading = false,
    files = $bindable<FileList | undefined>(undefined),
    variant = 'matrix',
  }: {
    label?: string;
    multiple?: boolean;
    rounded?: boolean;
    loading?: boolean;
    files?: FileList;
    variant?: 'matrix' | 'single';
  } = $props();

  const oneFile = makeFiles('avatar.png');
  const manyFiles = makeFiles('alpha.txt', 'beta.txt', 'gamma.txt');
</script>

<NeoThemeProvider>
  {#if variant === 'single'}
    <div class="visual-stage" data-testid="visual-stage">
      <NeoFilePicker bind:files {label} {multiple} {rounded} {loading} />
    </div>
  {:else}
    <div class="visual-stage matrix" data-testid="visual-stage">
      <section class="row">
        <span class="cell-label">idle (single)</span>
        <NeoFilePicker label="Idle" rounded loading={false} />

        <span class="cell-label">multiple</span>
        <NeoFilePicker label="Multiple" multiple rounded loading={false} />

        <span class="cell-label">disabled</span>
        <NeoFilePicker label="Disabled" disabled rounded loading={false} />
      </section>

      <section class="row">
        <span class="cell-label">one file</span>
        <NeoFilePicker label="One file" files={oneFile} rounded loading={false} />

        <span class="cell-label">many files</span>
        <NeoFilePicker label="Many files" multiple files={manyFiles} rounded loading={false} />

        <span class="cell-label">required invalid</span>
        <NeoFilePicker label="Required" required validation valid={false} rounded loading={false} />
      </section>

      <section class="row">
        <span class="cell-label">expanded drop</span>
        <NeoFilePicker label="Drag & Drop" multiple expanded drop append rounded loading={false} />

        <span class="cell-label">tinted</span>
        <NeoFilePicker label="Tinted" tinted color="var(--neo-color-primary)" rounded loading={false} />

        <span class="cell-label">glass</span>
        <NeoFilePicker label="Glass" glass rounded loading={false} />
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
    gap: 1.5rem;
    align-items: stretch;
  }

  .row {
    display: grid;
    grid-template-columns: 9rem 16rem 9rem 16rem 9rem 16rem;
    gap: 0.75rem 1rem;
    align-items: start;
  }

  .cell-label {
    padding-top: 0.5rem;
    font-size: 0.75rem;
    text-align: right;
    opacity: 0.7;
  }
</style>
