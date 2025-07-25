<script lang="ts">
  import type { NeoListBaseSectionProps } from '~/list/neo-list-base-section.model.js';

  import { getUUID } from '@dvcol/common-utils/common/string';

  import NeoMark from '~/text/NeoMark.svelte';

  const {
    // Snippets
    list,

    // States
    section,
    index,
    context,

    select,
    highlight,
    reverse,
    flip,

    // Other props
    ...rest
  }: NeoListBaseSectionProps = $props();

  const labelId = $derived(section.label ? `neo-list-section-label-${getUUID()}` : undefined);
</script>

{#if section?.render}
  {@render section?.render(list, { items: section.items, section, index, context })}
{:else}
  {#if section.label}
    <div id={labelId} class="neo-list-section-title" class:neo-sticky={section.sticky} class:neo-reverse={reverse}>
      <NeoMark class="neo-list-section-title-mark" value={section.label} filter={highlight} />
    </div>
  {/if}
  <svelte:element
    this={section?.tag ?? 'ul'}
    role={select ? 'listbox' : 'list'}
    aria-labelledby={labelId}
    class:neo-list-section-list={true}
    class:neo-flip={flip}
    {...rest}
    {...section.sectionProps}
  >
    {@render list({ items: section.items, section, index, context })}
  </svelte:element>
{/if}

<style lang="scss">
  .neo-list-section {
    &-list {
      display: flex;
      flex-direction: column;

      &.neo-flip {
        flex-direction: column-reverse;
        justify-content: end;
      }
    }

    &-title {
      display: inline-flex;
      padding: 0.25rem 0.6125rem;
      transition: color 0.3s ease;
      margin-block-end: 0.125rem;

      &.neo-reverse {
        justify-content: flex-end;
        text-align: end;
      }

      &.neo-sticky {
        position: sticky;
        top: -0.75rem;
        z-index: var(--neo-z-index-in-front, 1);
        background: var(
          --neo-list-section-bg-color,
          linear-gradient(to top, transparent 5%, oklch(from var(--neo-background-color) l c h / 50%) 20%, var(--neo-background-color))
        );
      }
    }
  }
</style>
