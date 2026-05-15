<script lang="ts">
  import type { NeoDialogHTMLElement } from '~/floating/dialog/neo-dialog.model.js';
  import type { NeoDrawerStepperProps } from '~/floating/drawer/neo-drawer.model.js';

  import NeoDrawerStepper from '~/floating/drawer/NeoDrawerStepper.svelte';

  type HarnessProps = Partial<NeoDrawerStepperProps> & {
    bodyText?: string;
    headerText?: string;
    onRef?: (ref: NeoDialogHTMLElement | undefined) => void;
  };

  let {
    dialogRef = $bindable<NeoDialogHTMLElement | undefined>(undefined),
    open = $bindable(false),
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

<NeoDrawerStepper bind:dialogRef bind:open bind:active {steps} header={headerText} {...rest}>
  <span data-testid="drawer-stepper-body">{bodyText}</span>
</NeoDrawerStepper>
