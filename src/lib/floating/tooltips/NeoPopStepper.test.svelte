<script lang="ts">
  import type { NeoPopStepperProps } from '~/floating/tooltips/neo-pop-stepper.model.js';

  import NeoPopStepper from '~/floating/tooltips/NeoPopStepper.svelte';

  type HarnessProps = Partial<NeoPopStepperProps> & {
    triggerLabel?: string;
    bodyText?: string;
  };

  let {
    open = $bindable(false),
    active = $bindable(0),
    steps = [],
    triggerLabel = 'open',
    bodyText = 'step body',
    ...rest
  }: HarnessProps = $props();
</script>

{#snippet tooltip()}
  {bodyText}
{/snippet}

<NeoPopStepper bind:open bind:active {steps} {tooltip} {...rest}>
  <button type="button" data-testid="trigger-button">{triggerLabel}</button>
</NeoPopStepper>
