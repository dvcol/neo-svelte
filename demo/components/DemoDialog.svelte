<script lang="ts">
  import { wait } from '@dvcol/common-utils/common/promise';

  import type { NeoPopConfirmProps } from '../../src/lib';
  import type { NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';
  import NeoDialog from '~/floating/dialog/NeoDialog.svelte';
  import NeoDialogConfirm from '~/floating/dialog/NeoDialogConfirm.svelte';

  const options = $state<NeoDialogProps>({
    modal: true,
    fade: true,
    disableBodyScroll: true,
    closeOnClickOutside: true,
    returnValue: undefined,
  });

  let openDefault = $state(false);
  let openConfirm = $state(false);

  const confirmOptions: NeoPopConfirmProps = {
    dialog: lorem,
    header: 'Confirm dialog',
    width: { max: '40rem' },
    onClose: () => console.info('Confirm dialog button closed'),
    onConfirm: async () => {
      console.info('Confirm dialog button confirming...');
      await wait(2000);
      console.info('Confirm dialog button confirmed');
      return true;
    },
    onCancel: async () => {
      console.info('Confirm dialog button cancelling...');
      await wait(1000);
      console.info('Confirm dialog button cancelled');
      return true;
    },
    dialogProps: {
      onclose: () => console.info('Dialog closed'),
      oncancel: () => console.info('Dialog cancelled'),
    },
  };

  // TODO move PopConfirm & PopStepper to cards & factorise with dialog
</script>

<div class="row">
  <NeoButtonGroup rounded>
    <NeoButton toggle bind:checked={options.modal}>Modal</NeoButton>
    <NeoButton toggle bind:checked={options.fade}>Fade</NeoButton>
    <NeoButton toggle bind:checked={options.disableBodyScroll}>Body Scroll</NeoButton>
    <NeoButton toggle bind:checked={options.closeOnClickOutside}>Click Outside</NeoButton>
  </NeoButtonGroup>
</div>

{#snippet lorem()}
  <div class="column">
    <p>
      Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin tincidunt
      mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio facilisi
      semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae. Hendrerit
      blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
    </p>

    <p>
      Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
      consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
      sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus rhoncus
      suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo nascetur
      parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
    </p>
  </div>
{/snippet}

<div class="row content">
  <div class="column">
    <span class="label">Default</span>

    <NeoButton elevation="0" toggle bind:checked={openDefault}>Open</NeoButton>
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}

    <NeoDialog {...options} bind:open={openDefault} bind:modal={options.modal} bind:returnValue={options.returnValue}>
      {@render lorem()}
    </NeoDialog>
  </div>

  <div class="column">
    <span class="label">Confirm</span>

    <NeoButton elevation="0" toggle bind:checked={openConfirm}>Open</NeoButton>
    {#if options.returnValue !== undefined}
      <span>Returned value: {JSON.stringify(options.returnValue, undefined, 2)}</span>
    {/if}

    <NeoDialogConfirm {...options} bind:open={openConfirm} bind:modal={options.modal} bind:returnValue={options.returnValue} {...confirmOptions}>
      {@render lorem()}
    </NeoDialogConfirm>
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .column {
    @include flex.column($center: true, $gap: var(--neo-gap-lg), $flex: 0 1 auto);
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;

    &.content {
      flex: 1 1 100%;
      height: 100%;
    }
  }
</style>
