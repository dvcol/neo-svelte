<script lang="ts">
  import type { NeoDialogHTMLElement, NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';
  import NeoThemeProvider from '~/providers/NeoThemeProvider.svelte';

  type HarnessProps = Partial<NeoDialogProps> & {
    bodyText?: string;
    onRef?: (ref: NeoDialogHTMLElement | undefined) => void;
  };

  let {
    ref = $bindable<NeoDialogHTMLElement | undefined>(undefined),
    open = $bindable(false),
    modal = $bindable(true),
    returnValue = $bindable<string | undefined>(),
    bodyText = 'Dialog body',
    onRef,
    ...rest
  }: HarnessProps = $props();

  $effect(() => {
    onRef?.(ref);
  });
</script>

<NeoThemeProvider>
  <div class="visual-stage" data-testid="visual-stage">
    <NeoDialog bind:ref bind:open bind:modal bind:returnValue {...rest}>
      <div class="dialog-body">
        <h2 data-testid="dialog-title">Dialog title</h2>
        <p data-testid="dialog-body">{bodyText}</p>
        <div class="actions">
          <NeoButton data-testid="dialog-cancel">Cancel</NeoButton>
          <NeoButton data-testid="dialog-confirm" rounded>Confirm</NeoButton>
        </div>
      </div>
    </NeoDialog>
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
    height: 100vh;
    padding: 4rem;
  }

  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    height: 100%;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: auto;
  }
</style>
