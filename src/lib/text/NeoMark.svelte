<script lang="ts">
  import type { NeoMarkProps } from '~/text/neo-mark.model.js';

  import { markTokenizer } from '@dvcol/common-utils/common/string';

  import NeoHtml from '~/text/NeoHtml.svelte';

  const {
    // Snippets
    children,

    // States
    tag = 'span',
    value,
    filter,
    tokenizer = markTokenizer,
    html = false,

    // Other props
    ...rest
  }: NeoMarkProps = $props();

  const parts = $derived.by(() => {
    if (html) return;
    return tokenizer(value, filter);
  });

  const content = $derived.by(() => {
    if (!html) return;
    return tokenizer(value, filter, { html: true }).map(({ token, mark }) => mark ? `${token}<mark>${mark}</mark>` : token).join('');
  });

</script>

<svelte:element this={tag} class:neo-mark={true} {...rest}>
  {#if content?.length}
    {@const htmlProps = typeof html === 'object' ? html : {}}
    <NeoHtml html={content} {...htmlProps} />
  {:else if parts?.length && parts?.at(0)?.mark}
    {#each parts as { token, mark }, i (i)}{token}{#if mark}<mark>{mark}</mark>{/if}{/each}
  {:else}
    {value}
  {/if}
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-mark {
    :global(mark) {
      color: var(--neo-mark-color, var(--neo-text-color-highlight));
      font-weight: var(--neo-mark-font-weight, bold);
      background-color: inherit;
    }
  }
</style>
