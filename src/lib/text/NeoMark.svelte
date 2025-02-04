<script lang="ts">
  import type { NeoMarkProps } from '~/text/neo-mark.model.js';

  import { type MarkAndToken, markTokenizer } from '~/utils/string.utils.js';

  const {
    // States
    tag = 'span',
    value,
    filter,
    tokenizer = markTokenizer,

    // Other props
    ...rest
  }: NeoMarkProps = $props();

  const parts = $derived<MarkAndToken[]>(tokenizer(value, filter));
</script>

{#if parts?.length && parts?.at(0)?.mark}
  <svelte:element this={tag} class:neo-mark={true} {...rest}>
    {#each parts as { token, mark }}{token}{#if mark}<mark>{mark}</mark>{/if}{/each}
  </svelte:element>
{:else}
  {value}
{/if}

<style lang="scss">
  .neo-mark {
    mark {
      color: var(--neo-mark-color, var(--neo-text-color-highlight));
      font-weight: var(--neo-mark-font-weight, bold);
      background-color: inherit;
    }
  }
</style>
