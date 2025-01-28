<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { scaleFreeze } from '@dvcol/svelte-utils';
  import { flip } from 'svelte/animate';
  import { fade, scale } from 'svelte/transition';

  import type { NeoListContext, NeoListItem, NeoListProps } from '~/list/neo-list.model.js';

  import NeoButton from '~/buttons/NeoButton.svelte';
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
    tag = 'ul',
    items = [],
    loading,
    skeleton,
    scrollToLoader,

    // Styles
    shadow = true,

    // Other props
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoListProps = $props();
  /* eslint-enable prefer-const */

  const empty = $derived(!items?.length);

  const scrollTop = debounce(() => {
    if (!ref) return false;
    ref.scrollTo({ top: 0, behavior: 'smooth' });
    return ref;
  }, defaultTransitionDuration / 2);

  const scrollBottom = debounce(() => {
    if (!ref?.scrollHeight) return false;
    ref.scrollTo({ top: ref.scrollHeight, behavior: 'smooth' });
    return ref;
  }, defaultTransitionDuration / 2);

  $effect(() => {
    if (!loading || !scrollToLoader) return;
    scrollBottom();
  });

  const context = $derived<NeoListContext>({
    // States
    items,

    loading,
    skeleton,

    // Styles

    // Methods
    scrollTop,
    scrollBottom,
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      scrollTop,
      scrollBottom,
    });
  });
</script>

{#snippet loader()}
  <!-- Loading indicator -->
  {#if loading}
    <li class="neo-list-loader" transition:scale={scaleTransitionProps}>
      {#if customLoader}
        {@render customLoader(context)}
      {:else}
        <NeoSkeletonText class="neo-list-loader-skeleton" lines={typeof loading === 'boolean' ? 2 : loading} />
      {/if}
    </li>
  {/if}
{/snippet}

{#snippet listItem({ label, value, disabled }: NeoListItem)}
  <NeoSkeletonText class="neo-list-item-skeleton" loading={skeleton} lines={1} align="center">
    <div class="neo-list-item-content" class:neo-disabled={disabled}>{label ?? value}</div>
  </NeoSkeletonText>
{/snippet}

{#snippet list()}
  <!-- Items -->
  {#each items as item, index (item.id ?? index)}
    {@const {
      tag: itemTag,
      label: itemLabel,
      value: itemValue,
      color: itemColor,
      disabled: itemDisabled,
      render: itemRender,
      id: itemId,
      href: itemHref,
      onclick: itemOnClick,
      buttonProps: itemButtonProps,
      ...itemProps
    } = item}
    <svelte:element
      this={itemTag ?? 'li'}
      class:neo-list-item={true}
      class:neo-skeleton={skeleton}
      style:--neo-list-item-color={getColorVariable(itemColor)}
      animate:flip={flipTransitionProps}
      transition:scale={scaleTransitionProps}
      {...itemProps}
    >
      {#if itemRender}
        {@render itemRender(item, index, context)}
      {:else if customItem}
        {@render customItem(item, index, context)}
      {:else if itemHref || itemOnClick}
        <NeoButton
          ghost
          href={itemHref}
          onclick={itemOnClick}
          disabled={itemDisabled}
          {...itemButtonProps}
          class={['neo-list-item-button', itemButtonProps?.class]}
        >
          {@render listItem(item)}
        </NeoButton>
      {:else}
        {@render listItem(item)}
      {/if}
    </svelte:element>
  {/each}
{/snippet}

<svelte:element this={containerTag} class:neo-list={true} class:neo-empty={empty} {...containerProps}>
  {@render children?.(context)}
  {#if !empty}
    <svelte:element
      this={tag}
      bind:this={ref}
      class:neo-list-items={true}
      class:neo-shadow={shadow && !empty}
      in:scaleFreeze={scaleTransitionProps}
      {...rest}
    >
      {@render list()}
      {@render loader()}
    </svelte:element>
  {:else}
    <svelte:element this={tag} bind:this={ref} class:neo-list-empty={true} in:fade={enterTransitionProps} {...rest}>
      {#if customEmpty}
        {@render customEmpty(context)}
      {:else}
        <NeoSkeletonText
          class="neo-list-empty-skeleton"
          loading={skeleton || !!loading}
          lines={typeof loading === 'boolean' ? 6 : loading}
          align="center"
          transitionProps={{ tag: 'li' }}
          containerProps={{ class: 'neo-list-empty-skeleton-container' }}
        >
          <div class="neo-list-empty-content">
            <IconList size="3rem" stroke="1" />
            <div>No items</div>
          </div>
        </NeoSkeletonText>
      {/if}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list {
    display: flex;
    flex-direction: column;
    height: 100%;

    &-items,
    &-empty {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    &-items {
      @include mixin.scrollbar($gutter: stable both-edges);

      &.neo-shadow {
        --neo-scrollbar-button-height: 0.375rem;

        @include mixin.fade-scroll(1rem);

        padding-block: 0.625rem;
      }
    }

    &-loader,
    &-item {
      width: 100%;
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
    }

    &-item {
      &-content {
        padding: 0.125rem 0.5rem;
        transition: color 0.3s ease;

        &:hover:not(.neo-disabled) {
          color: var(--neo-text-color-highlight);
        }

        &.neo-disabled {
          color: var(--neo-text-color-disabled);
          cursor: not-allowed;
        }
      }

      &.neo-skeleton {
        pointer-events: none;
      }
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

    :global(.neo-list-item-button) {
      width: 100%;
    }

    :global(.neo-list-empty-skeleton),
    :global(.neo-list-item-skeleton),
    :global(.neo-list-loader-skeleton) {
      padding-inline: 0.5rem;
    }

    :global(.neo-list-loader-skeleton .neo-skeleton-text-paragraph) {
      gap: 0.125rem;
    }

    :global(.neo-list-empty-skeleton-container) {
      width: 100%;
      margin: auto;
    }
  }
</style>
