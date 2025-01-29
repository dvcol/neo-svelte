<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { shallowClone } from '@dvcol/common-utils/common/object';
  import { scaleFreeze, watch } from '@dvcol/svelte-utils';
  import { flip } from 'svelte/animate';
  import { fade, scale } from 'svelte/transition';

  import IconList from '~/icons/IconList.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import {
    isSection,
    type NeoListContext,
    type NeoListItem,
    type NeoListMethods,
    type NeoListProps,
    type NeoListSection,
    type NeoListSelectedItem,
    type NeoListSelectEvent,
  } from '~/list/neo-list.model.js';
  import NeoSkeletonText from '~/skeletons/NeoSkeletonText.svelte';
  import { emptyAnimation, emptyTransition, toAnimation, toAnimationProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { defaultTransitionDuration, enterTransitionProps, flipTransitionProps, scaleTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    item: customItem,
    empty: customEmpty,
    loader: customLoader,
    after,
    before,
    children,

    // States
    ref = $bindable(),
    tag = 'ul',
    items = $bindable([]),
    loading,
    skeleton,
    scrollToLoader,

    select = false,
    multiple = false,
    selected = $bindable(),
    touched = $bindable([]),

    // Styles
    shadow,
    scrollbar = true,

    // Animation
    transition,
    animate,

    // Events
    onselect,

    // Other props
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoListProps = $props();
  /* eslint-enable prefer-const */

  const empty = $derived(!items?.length);
  const missing = $derived(items?.some(item => item.id === undefined || item.id === null));

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

  const findItem = (index: NeoListSelectedItem['index']): NeoListSelectedItem => {
    const item: NeoListItem | NeoListSection = items[index];
    if (isSection(item)) throw new Error('Section cannot be selected.'); // TODO custom error
    if (!item) throw new Error('Item not found.'); // TODO custom error
    return { index, item, id: item.id, value: item?.value };
  };

  const isMultiple = (list?: NeoListSelectedItem | NeoListSelectedItem[]): list is NeoListSelectedItem[] | undefined =>
    multiple && (Array.isArray(list) || list === undefined);

  const selectItem: NeoListMethods['selectItem'] = (
    index: NeoListSelectedItem['index'],
    ...indexes: NeoListSelectedItem['index'][]
  ): NeoListSelectEvent => {
    if (!select) throw new Error('Selection is disabled.'); // TODO custom error

    const previous = shallowClone(selected, 2);
    if (isMultiple(selected)) {
      selected = [...(selected ?? []), findItem(index), ...indexes.map(findItem)];
    } else {
      if (indexes.length) console.warn('Multiple selection is disabled. Only the first selection will be considered.');
      selected = findItem(index);
    }
    return { previous, current: shallowClone(selected, 2) };
  };

  const clearItem: NeoListMethods['clearItem'] = (...indexes: NeoListSelectedItem['index'][]): NeoListSelectEvent => {
    if (!select) throw new Error('Selection is disabled.'); // TODO custom error

    const previous = shallowClone(selected, 2);
    if (isMultiple(selected)) {
      if (!indexes?.length) selected = undefined;
      else selected = selected?.filter(item => !indexes.includes(item.index)) ?? [];
    } else {
      selected = undefined;
    }

    return { previous, current: shallowClone(selected, 2) };
  };

  const toggleItem = (index: NeoListSelectedItem['index']) => {
    touched.push(index);
    const clear = isMultiple(selected) ? selected?.some(item => item.index === index) : selected?.index === index;
    const event = clear ? clearItem(index) : selectItem(index);
    onselect?.(event);
  };

  const isChecked = (index: NeoListSelectedItem['index']) => {
    return isMultiple(selected) ? selected?.some(item => item.index === index) : selected?.index === index;
  };

  // Clear selected item(s) when items list changes and attempts to re-select if the item still exists
  watch(
    () => items,
    () => {
      if (!select || !selected) return;
      const previous = shallowClone(selected, 2);
      clearItem();
      let event: NeoListSelectEvent | undefined;
      if (isMultiple(previous)) {
        const [first, ...indexes]: number[] = previous.map(item => items?.findIndex(i => i?.id === item.id)).filter(index => index > -1);
        if (first) event = selectItem(first, ...indexes);
      } else {
        const index = items?.findIndex(i => i?.id === previous.id);
        if (index !== -1) event = selectItem(index);
      }
      touched = [];
      if (!event) return;
      onselect?.(event);
    },
  );

  const context = $derived<NeoListContext>({
    // States
    items,

    loading,
    skeleton,

    select,
    multiple,
    selected,

    // Methods
    scrollTop,
    scrollBottom,
    selectItem,
    clearItem,
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      scrollTop,
      scrollBottom,
    });
  });

  const animateFn = $derived(missing ? emptyAnimation : toAnimation(animate, flip));
  const animateProps = $derived(toAnimationProps(animate, flipTransitionProps));
  const transitionFn = $derived(missing ? emptyTransition : toTransition(transition, scale));
  const transitionProps = $derived(toTransitionProps(transition, scaleTransitionProps));
</script>

{#snippet loader()}
  <!-- Loading indicator -->
  {#if loading}
    <li class="neo-list-loader" class:neo-list-item-select={select} transition:transitionFn={transitionProps}>
      {#if customLoader}
        {@render customLoader(context)}
      {:else}
        <NeoSkeletonText class="neo-list-loader-skeleton" lines={typeof loading === 'boolean' ? 2 : loading} />
      {/if}
    </li>
  {/if}
{/snippet}

{#snippet list(_items: (NeoListItem | NeoListSection)[])}
  <!-- Items -->
  {#each _items as _item, _index (_item.id ?? _index)}
    <svelte:element
      this={_item.tag ?? 'li'}
      role={select ? 'option' : 'listitem'}
      class:neo-list-item={true}
      class:neo-skeleton={skeleton}
      class:neo-list-item-select={select}
      style:--neo-list-item-color={getColorVariable(_item.color)}
      animate:animateFn={animateProps}
      transition:transitionFn={transitionProps}
      {..._item.containerProps}
    >
      {#if isSection(_item)}
        <!-- TODO - section-->
      {:else if customItem && !_item.render}
        {@render customItem(_item, _index, context)}
      {:else}
        <NeoListBaseItem
          item={_item}
          index={_index}
          {context}
          {skeleton}
          {select}
          checked={isChecked(_index)}
          touched={touched?.includes(_index)}
          disabled={_item.disabled}
          {toggleItem}
        />
      {/if}
    </svelte:element>
  {/each}
{/snippet}

<svelte:element this={containerTag} class:neo-list={true} class:neo-empty={empty} {...containerProps}>
  {@render before?.(context)}
  {#if !empty}
    <svelte:element
      this={tag}
      role={select ? 'listbox' : 'list'}
      bind:this={ref}
      class:neo-list-items={true}
      class:neo-scroll={scrollbar}
      class:neo-shadow={shadow}
      in:scaleFreeze={scaleTransitionProps}
      {...rest}
    >
      {@render children?.(context)}
      {@render list(items)}
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
  {@render after?.(context)}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list {
    display: flex;
    flex-direction: column;
    height: 100%;

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

    &-items,
    &-empty {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    &-items {
      padding-inline: 0.25rem;

      &.neo-scroll {
        @include mixin.scrollbar($button-height: 0.375rem);

        &.neo-shadow {
          @include mixin.fade-scroll(1rem);

          padding-block: 0.25rem;
        }
      }
    }

    &-loader,
    &-item {
      width: 100%;
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
    }

    &-item {
      &.neo-skeleton {
        pointer-events: none;
      }

      &-select {
        :global(.neo-list-item-button) {
          padding: 0.125rem;
        }

        :global(.neo-list-loader-skeleton) {
          margin-top: 0.125rem;
        }

        :global(.neo-list-loader-skeleton .neo-skeleton-text-paragraph) {
          gap: 0.5rem;
          padding: 0.125rem;
        }
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
  }
</style>
