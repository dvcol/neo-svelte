<script lang="ts">
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';
</script>

<div class="row">
  <div class="column content">
    <span class="label">Tooltip</span>
    <NeoTooltip>
      <div>Trigger content</div>

      {#snippet tooltip()}
        <div>Tooltip content</div>
      {/snippet}
    </NeoTooltip>
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

    &.content {
      flex: 1 0 20%;
      min-width: fit-content;
      max-width: min(25%, 50rem);
    }
  }

  .row {
    @include flex.row($center: true, $gap: var(--neo-gap-xl), $flex: 0 1 auto);

    margin: 2rem 0;
  }
</style>
