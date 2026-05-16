<script lang="ts">
  import type { NeoDialogStepperProps } from '~/floating/dialog/neo-dialog-stepper.model.js';

  import NeoDialogStepper from '~/floating/dialog/NeoDialogStepper.svelte';

  type HarnessProps = Partial<NeoDialogStepperProps> & {
    bodyText?: string;
    headerText?: string;
    onRef?: (ref: HTMLDialogElement | undefined) => void;
  };

  let {
    dialogRef = $bindable<HTMLDialogElement | undefined>(undefined),
    open = $bindable(false),
    modal = $bindable(true),
    active = $bindable(0),
    steps = [],
    bodyText = 'stepper body',
    headerText,
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(dialogRef);
  });
</script>

<NeoDialogStepper bind:dialogRef bind:open bind:modal bind:active {steps} header={headerText} {...rest}>
  <span data-testid="dialog-stepper-body">{bodyText}</span>
</NeoDialogStepper>
