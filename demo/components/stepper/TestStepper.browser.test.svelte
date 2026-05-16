<script lang="ts">
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';
  import NeoStepper from '~/stepper/NeoStepper.svelte';

  type Variant = 'horizontal' | 'vertical';

  const { variant = 'horizontal' }: { variant?: Variant } = $props();

  const steps = [
    { id: 'step-1', label: 'Account' },
    { id: 'step-2', label: 'Profile' },
    { id: 'step-3', label: 'Confirm' },
  ];
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <div class="cell">
      <NeoStepper
        active={1}
        {steps}
        vertical={variant === 'vertical'}
        rounded
        elevation={1}
        width="32rem"
        height="14rem"
      >
        <p>Step content body — second of three steps.</p>
      </NeoStepper>
    </div>
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

  .cell {
    display: flex;
    align-items: stretch;
  }
</style>
