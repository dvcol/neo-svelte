<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { scaleFreeze, scaleHeight } from '@dvcol/svelte-utils';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  import type { NeoListContext, NeoListProps } from '~/list/neo-list.model.js';

  import IconList from '~/icons/IconList.svelte';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';

  import { getColorVariable } from '~/utils/colors.utils.js';
  import { defaultTransitionDuration, enterTransitionProps, flipTransitionProps, scaleTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    item: customItem,
    empty: customEmpty,
    loader: customLoader,
    children,

    // States
    ref = $bindable(),
    tag = 'div',
    items = [],
    loading,
    skeleton,

    // Styles
    shadow,

    // Other props
    ...rest
  }: NeoListProps = $props();
  /* eslint-enable prefer-const */

  const context = $derived<NeoListContext>({
    // States
    items,

    loading,
    skeleton,

    // Styles
  });

  const empty = $derived(!items?.length);

  let listWidth = $state<string>();
  let listHeight = $state<string>();
  const updateSize = debounce(() => {
    if (!ref || empty) return;
    const { clientWidth, clientHeight } = ref;
    if (clientWidth) listWidth = `${clientWidth}px`;
    else listWidth = undefined;
    if (clientHeight) listHeight = `${clientHeight}px`;
    else listHeight = undefined;
  }, defaultTransitionDuration / 2);

  // Debounced to await transition end
  $effect(() => {
    if (!ref || !items?.length) return;
    listHeight = undefined;
    listWidth = undefined;
    updateSize(loading);
  });
</script>

{#snippet loader()}
  <!-- Loading indicator -->
  {#if loading}
    <li class="neo-list-loader" transition:scaleHeight={scaleTransitionProps}>
      {#if customLoader}
        {@render customLoader(context)}
      {:else}
        <NeoSkeletonText class="neo-list-loader-skeleton" lines={typeof loading === 'boolean' ? 2 : loading} />
      {/if}
    </li>
  {/if}
{/snippet}

{#snippet list()}
  <!-- Items -->
  {#each items as item, index (item.id ?? index)}
    {@const { tag: itemTag, label: itemLabel, value: itemValue, color: itemColor, render: itemRender, id: itemId, ...itemProps } = item}
    <svelte:element
      this={itemTag ?? 'li'}
      class:neo-list-item={true}
      style:--neo-list-item-color={getColorVariable(itemColor)}
      animate:flip={flipTransitionProps}
      transition:scaleHeight={enterTransitionProps}
      {...itemProps}
    >
      {#if itemRender}
        {@render itemRender(item, index, context)}
      {:else if customItem}
        {@render customItem(item, index, context)}
      {:else}
        <NeoSkeletonText class="neo-list-item-skeleton" loading={skeleton} lines={1} align="center">
          <span class="neo-list-item-content">{itemLabel ?? itemValue}</span>
        </NeoSkeletonText>
      {/if}
    </svelte:element>
  {/each}
{/snippet}

{@render children?.(context)}

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-list={true}
  class:neo-empty={empty}
  class:neo-shadow={shadow}
  style:--neo-list-min-height={listHeight}
  style:--neo-list-min-width={listWidth}
  {...rest}
>
  {#if !empty}
    <ul class="neo-list-items" in:scaleFreeze={scaleTransitionProps}>
      {@render list()}
      {@render loader()}
    </ul>
  {:else if customEmpty}
    {@render customEmpty(context)}
  {:else}
    <ul class="neo-list-empty" in:fade={enterTransitionProps}>
      <NeoSkeletonText
        class="neo-list-empty-skeleton"
        loading={skeleton || !!loading}
        lines={typeof loading === 'boolean' ? 6 : loading}
        align="center"
        transitionProps={{ tag: 'li' }}
        containerProps={{ class: 'neo-list-empty-skeleton-container' }}
        width="100%"
      >
        <div class="neo-list-empty-content">
          <IconList size="3rem" stroke="1" />
          <div>No items</div>
        </div>
      </NeoSkeletonText>
    </ul>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list {
    @include mixin.scrollbar($gutter: stable both-edges);

    position: relative;
    display: flex;
    flex-direction: column;
    min-width: var(--neo-list-min-width, 8rem);
    height: 100%;
    min-height: var(--neo-list-min-height);

    &.neo-shadow {
      @include mixin.fade-scroll(1rem);

      padding-block: 0.625rem;
    }

    &-items,
    &-empty {
      margin: 0;
      padding: 0;
    }

    &-item {
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
    }

    &-item-content {
      padding: 0.125rem 0.5rem;
      transition: color 0.3s ease;

      &:hover {
        color: var(--neo-text-color-highlight);
      }
    }

    &-loader {
      overflow: hidden;
      list-style-type: none;
    }

    &-empty-content {
      display: flex;
      flex-direction: column;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      justify-content: center;
      min-width: var(--neo-list-min-width, 8rem);
      min-height: var(--neo-list-min-height);
    }

    :global(.neo-list-empty-skeleton),
    :global(.neo-list-item-skeleton),
    :global(.neo-list-loader-skeleton) {
      padding-inline: 0.5rem;
    }

    :global(.neo-list-empty-skeleton-container) {
      margin: auto;
    }
  }
</style>
