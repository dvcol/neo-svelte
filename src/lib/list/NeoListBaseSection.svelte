<script lang="ts">
  import { getUUID } from '@dvcol/common-utils/common/string';

  import type { NeoListBaseSectionProps } from '~/list/neo-list-base-section.props.js';

  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';

  const {
    // Snippets
    list,

    // States
    section,
    index,
    context,

    skeleton,

    // Other props
    skeletonProps,
    ...rest
  }: NeoListBaseSectionProps = $props();

  const labelId = $derived(section.title ? `neo-list-section-label-${getUUID()}` : undefined);
</script>

{#if section?.render}
  {@render section?.render(list, { items: section.items, section, index, context })}
{:else}
  {#if section.title}
    <NeoSkeletonText loading={skeleton} lines={1} align="center" {...skeletonProps} class={['neo-list-item-skeleton', skeletonProps?.class]}>
      <span id={labelId} class="neo-list-item-section-title">{section.title}</span>
    </NeoSkeletonText>
  {/if}
  <ul role="group" aria-labelledby={labelId} class:neo-list-item-section={true} {...rest}>
    {@render list({ items: section.items, section, index, context })}
  </ul>
{/if}

<style lang="scss">
  .neo-list-item-section {
    margin-inline-start: 0.5rem;

    &-title {
      display: inline-flex;
      padding: 0.25rem 0.6125rem;
      transition: color 0.3s ease;
      margin-block-end: 0.125rem;
    }
  }
</style>
