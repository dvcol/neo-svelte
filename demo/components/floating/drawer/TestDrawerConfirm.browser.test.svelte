<script lang="ts">
  import NeoDrawerConfirm from '~/floating/drawer/NeoDrawerConfirm.svelte';
  import NeoDrawerStepper from '~/floating/drawer/NeoDrawerStepper.svelte';
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
      <NeoDrawerConfirm
        open
        tag="div"
        modal
        unmountOnClose
        elevation={2}
        rounded
        backdrop
        placement="right"
        full
        header="Discard changes?"
      >
        <p>Your edits will be lost. Are you sure you want to discard them?</p>
      </NeoDrawerConfirm>
    {:else}
      <NeoDrawerStepper
        open
        tag="div"
        modal
        unmountOnClose
        elevation={2}
        rounded
        backdrop
        placement="right"
        full
        active={1}
        header="Setup"
        {steps}
      >
        <p>Step content body — second of three steps.</p>
      </NeoDrawerStepper>
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
  }
</style>
