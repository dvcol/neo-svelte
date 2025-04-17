<script lang="ts">
  import type { MarkAndToken } from '@dvcol/common-utils/common/string';

  import type { NeoMarkProps } from '~/text/neo-mark.model.js';

  import { markTokenizer } from '@dvcol/common-utils/common/string';

  const {
    // Snippets
    children,

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

<svelte:element this={tag} class:neo-mark={true} {...rest}>
  {#if parts?.length && parts?.at(0)?.mark}
    {#each parts as { token, mark }}{token}{#if mark}<mark>{mark}</mark>{/if}{/each}
  {:else}
    {value}
  {/if}
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-mark {
    mark {
      color: var(--neo-mark-color, var(--neo-text-color-highlight));
      font-weight: var(--neo-mark-font-weight, bold);
      background-color: inherit;
    }
  }
</style>
