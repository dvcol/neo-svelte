<script lang="ts">
  import type { NeoPopConfirmProps } from '~/floating/tooltips/neo-pop-confirm.model.js';

  import NeoPopConfirm from '~/floating/tooltips/NeoPopConfirm.svelte';

  type HarnessProps = NeoPopConfirmProps & {
    triggerLabel?: string;
    bodyText?: string;
    headerText?: string;
  };

  let {
    open = $bindable(false),
    triggerLabel = 'open',
    bodyText = 'Are you sure?',
    headerText,
    ...rest
  }: HarnessProps = $props();
</script>

<NeoPopConfirm bind:open tooltip={bodyText} header={headerText} {...rest}>
  <button type="button" data-testid="trigger-button">{triggerLabel}</button>
</NeoPopConfirm>
