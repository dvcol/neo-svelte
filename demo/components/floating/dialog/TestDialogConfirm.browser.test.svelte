<script lang="ts">
  import NeoDialogConfirm from '~/floating/dialog/NeoDialogConfirm.svelte';
  import NeoDialogStepper from '~/floating/dialog/NeoDialogStepper.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Variant = 'confirm' | 'stepper';

  const { variant = 'confirm' }: { variant?: Variant } = $props();

  const steps = [
    { id: 'one' },
    { id: 'two' },
    { id: 'three' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    {#if variant === 'confirm'}
      <NeoDialogConfirm
        open
        tag="div"
        modal
        unmountOnClose
        elevation={2}
        rounded
        backdrop
        width="380px"
        height="200px"
        header="Delete project?"
      >
        <p>This action cannot be undone. Are you sure you want to delete this project?</p>
      </NeoDialogConfirm>
    {:else}
      <NeoDialogStepper
        open
        tag="div"
        modal
        unmountOnClose
        elevation={2}
        rounded
        backdrop
        width="420px"
        height="260px"
        active={1}
        header="Wizard"
        {steps}
      >
        <p>Step content body — this is the second of three steps.</p>
      </NeoDialogStepper>
    {/if}
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-stage {
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    padding: 2rem;
  }
</style>
