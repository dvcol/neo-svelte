<script lang="ts">
  import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';

  import NeoFloatingStepper from '~/floating/common/NeoFloatingStepper.svelte';

  type HarnessProps = Omit<Partial<NeoFloatingStepperProps>, 'steps'> & {
    steps: NeoFloatingStepperProps['steps'];
    headerText?: string;
  };

  const { headerText, steps, ...rest }: HarnessProps = $props();
</script>

<NeoFloatingStepper {steps} {...rest} header={headerText ?? rest.header} />
