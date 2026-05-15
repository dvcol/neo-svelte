<script lang="ts">
  import type { NeoTooltipContext, NeoTooltipToggle } from '~/floating/tooltips/neo-tooltip.model.js';
  import type { NeoStepperStep } from '~/stepper/neo-stepper.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoPopStepper from '~/floating/tooltips/NeoPopStepper.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type Props = {
    placement?: string;
    closable?: boolean;
    rounded?: boolean;
  };

  const {
    placement = 'bottom',
    closable = true,
    rounded = false,
  }: Props = $props();

  let active = $state(0);
</script>

{#snippet stepBody()}
  <div>Step content</div>
{/snippet}

{#snippet trigger(_: NeoTooltipContext, toggle: NeoTooltipToggle)}
  <NeoButton class="trigger" text {rounded} onclick={() => toggle()}>Click me</NeoButton>
{/snippet}

<NeoThemeProvider>
  <div class="visual-frame" data-testid="visual-target">
    <NeoPopStepper
      bind:active
      {rounded}
      {closable}
      steps={[
        { markProps: { label: 'One' }, render: stepBody },
        { markProps: { label: 'Two' }, render: stepBody },
        { markProps: { label: 'Three' }, render: stepBody },
      ] satisfies NeoStepperStep[]}
      header="Stepper"
      tooltip="Steps"
      tooltipProps={{ placement, openOnHover: false, openOnFocus: false }}
      children={trigger}
    />
  </div>
</NeoThemeProvider>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .visual-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>
