<script lang="ts">
  import NeoButton from '~/buttons/NeoButton.svelte';
  import NeoInput from '~/inputs/common/NeoInput.svelte';
  import NeoTooltip from '~/tooltips/NeoTooltip.svelte';

  let containerRef = $state<HTMLElement>();
  let content = $state();
</script>

{#snippet tooltip()}
  <div class="neo-tooltip-content">
    <div>Tooltip content</div>
    <div>Line 1</div>
    <div>Line 2</div>
    <div>Line 3</div>
    {#if content}
      <div>{content}</div>
    {/if}
  </div>
{/snippet}

<div class="row">
  <div class="column content">
    <span class="label">Tooltip</span>
    <NeoTooltip {tooltip}>
      <NeoButton text>Hover Me</NeoButton>
    </NeoTooltip>
  </div>

  <div class="column content">
    <span class="label">Tooltip (string)</span>
    <NeoTooltip tooltip="This is a string tooltip">
      <NeoButton text>Hover Me</NeoButton>
    </NeoTooltip>
  </div>

  <div class="column content">
    <span class="label">Tooltip (ref)</span>

    <NeoInput bind:value={content} bind:containerRef placeholder="Placeholder" />

    <NeoTooltip {tooltip} target={containerRef} />
  </div>
</div>

<style lang="scss">
  @use 'src/lib/styles/common/flex' as flex;

  .label {
    max-width: 80vw;
    white-space: pre-line;
    word-break: break-all;
  }

  .neo-tooltip-content {
    @include flex.column($center: true, $gap: var(--neo-gap-xxs));
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
