<script lang="ts">
  import NeoDialog from '../../src/lib/dialog/NeoDialog.svelte';

  import type { NeoDialogProps } from '~/dialog/neo-dialog.model';

  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoButtonGroup from '~/buttons/NeoButtonGroup.svelte';

  const options = $state<NeoDialogProps>({
    open: false,
    modal: true,
    fade: true,
    disableBodyScroll: true,
    closeOnClickedOutside: true,
    returnValue: undefined,
  });
</script>

<div class="row">
  <NeoButtonGroup rounded>
    <NeoButton toggle bind:checked={options.modal}>Modal</NeoButton>
    <NeoButton toggle bind:checked={options.fade}>Fade</NeoButton>
    <NeoButton toggle bind:checked={options.disableBodyScroll}>Body Scroll</NeoButton>
    <NeoButton toggle bind:checked={options.closeOnClickedOutside}>Clicked Outside</NeoButton>
  </NeoButtonGroup>
</div>

<div class="row content">
  <div class="column">
    <span class="label">Default</span>
    <NeoButton toggle bind:checked={options.open}>Open</NeoButton>
    <NeoDialog {...options} bind:open={options.open} bind:returnValue={options.returnValue}>
      <div class="column">
        <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Malesuada pharetra ullamcorper eget hac; imperdiet a finibus hac. Sollicitudin
          tincidunt mauris eros ex pharetra imperdiet. Nibh facilisi ante vestibulum feugiat facilisi quam risus ex? Malesuada condimentum nulla odio
          facilisi semper sodales. Dapibus est duis odio tincidunt elementum. Sodales scelerisque venenatis hac ridiculus scelerisque massa vitae.
          Hendrerit blandit sed, ac cursus ante varius quam. Malesuada habitant curae diam pulvinar proin congue tristique dictum.
        </p>

        <p>
          Dignissim quisque non fermentum ipsum; sapien dignissim lobortis. Quam montes lacus ipsum ac dolor class. Erat accumsan morbi fermentum
          consectetur sollicitudin elit a. Primis tincidunt aenean malesuada eleifend nunc morbi consequat. Aenean malesuada sapien habitant feugiat
          sapien consectetur torquent risus nascetur. Dui elit gravida sollicitudin nascetur suscipit facilisi est sodales? Vulputate rhoncus rhoncus
          suspendisse amet nostra quisque eleifend tellus interdum? Volutpat nunc imperdiet sagittis, efficitur nibh eget maecenas. Finibus justo
          nascetur parturient nascetur ac condimentum erat ultrices. Sociosqu nascetur quisque; elit iaculis libero quis.
        </p>
      </div>
    </NeoDialog>
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
