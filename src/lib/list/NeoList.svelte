<script lang="ts">
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { shallowClone } from '@dvcol/common-utils/common/object';
  import { flipToggle, scaleFreeze, watch } from '@dvcol/svelte-utils';
  import { emptyAnimation, emptyTransition } from '@dvcol/svelte-utils/transition';
  import { fade, scale } from 'svelte/transition';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import IconList from '~/icons/IconList.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoListBaseLoader from '~/list/NeoListBaseLoader.svelte';
  import NeoListBaseSection from '~/list/NeoListBaseSection.svelte';
  import {
    isSection,
    type NeoListContext,
    type NeoListItemOrSection,
    type NeoListMethods,
    type NeoListProps,
    type NeoListRenderContext,
    type NeoListSelectedItem,
    type NeoListSelectEvent,
  } from '~/list/neo-list.model.js';
  import { toAnimation, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { defaultTransitionDuration, enterTransitionProps, flipTransitionProps, scaleTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    item: customItem,
    empty: customEmpty,
    loader: customLoader,
    section: customSection,
    after,
    before,
    children,

    // States
    ref = $bindable(),
    tag = 'ul',
    items = $bindable([]),
    highlight = $bindable(),
    filter = $bindable(item => !item?.hidden),
    sort = $bindable(() => 0),
    loading,
    skeleton,
    scrollToLoader,

    select = false,
    multiple = false,
    selected = $bindable(),
    disabled,
    readonly,

    // Styles
    shadow = true,
    scrollbar = true,

    // Animation
    in: inAction = { use: scale, props: scaleTransitionProps },
    out: outAction = { use: fade, props: { ...scaleTransitionProps, delay: scaleTransitionProps?.duration } },
    animate = { use: flipToggle, props: flipTransitionProps },

    // Events
    onselect,

    // Other props
    containerTag = 'div',
    containerProps,
    loaderProps,
    buttonProps,
    dividerProps,
    ...rest
  }: NeoListProps = $props();
  /* eslint-enable prefer-const */

  // Todo - keep selected on filter
  // TODO - rework focus highlights
  // TODO - rework divider for re-sort
  // TODO - sticky section header background
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

  const isMultiple = (list?: NeoListSelectedItem | NeoListSelectedItem[]): list is NeoListSelectedItem[] | undefined =>
    multiple && (Array.isArray(list) || list === undefined);

  const isSameIndex = (left: NeoListSelectedItem, right: NeoListSelectedItem) =>
    left?.index === right?.index && left?.sectionIndex === right?.sectionIndex;

  const cloneSelection = (selection = selected): undefined | NeoListSelectedItem | NeoListSelectedItem[] => {
    if (!selection || (Array.isArray(selection) && !selection.length)) return multiple ? [] : undefined;
    return shallowClone(selection, Array.isArray(selection) ? 3 : 2);
  };

  const selectItem: NeoListMethods['selectItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
    if (disabled || readonly || !selection?.length) return;
    if (!select) throw new Error('Selection is disabled.'); // TODO custom error

    const previous = cloneSelection();
    if (isMultiple(selected)) {
      selected = [...(selected ?? []), ...selection];
    } else {
      if (selection.length > 1) console.warn('Multiple selection is disabled. Only the first selection will be considered.');
      [selected] = selection;
    }
    return { previous, current: cloneSelection() };
  };

  const clearItem: NeoListMethods['clearItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
    if (disabled || readonly) return;
    if (!select) throw new Error('Selection is disabled.'); // TODO custom error

    const previous = cloneSelection();
    if (isMultiple(selected)) {
      if (!selection?.length) selected = [];
      else selected = selected?.filter(item => !selection.some(s => isSameIndex(s, item))) ?? [];
    } else {
      selected = undefined;
    }

    return { previous, current: cloneSelection() };
  };

  const toggleItem = (item: NeoListSelectedItem, clear = false) => {
    if (disabled || readonly) return;
    const event = clear ? clearItem(item) : selectItem(item);
    if (event) onselect?.(event);
  };

  const isChecked = (item: NeoListSelectedItem) => {
    if (isMultiple(selected)) return selected?.some(i => isSameIndex(i, item));
    return isSameIndex(selected, item);
  };

  const findInList = (selection: NeoListSelectedItem, array: NeoListItemOrSection[]): NeoListSelectedItem | undefined => {
    const result: Partial<NeoListSelectedItem> = {};
    const search = array?.some((item, index) => {
      if (isSection(item)) {
        // if section differs, skip
        if (selection?.section?.id !== item.id) return false;
        const sectionIndex = item?.items?.findIndex(sub => sub.id === selection?.item?.id);
        if (sectionIndex < 0) return false;
        result.index = sectionIndex;
        result.item = item.items[sectionIndex];
        result.section = item;
        result.sectionIndex = index;
        return true;
      }
      if (item.id !== selection?.item?.id) return false;
      result.index = index;
      result.item = item;
      return true;
    });
    return search ? (result as NeoListSelectedItem) : undefined;
  };

  // Clear selected item(s) when items list changes and attempts to re-select if the item still exists
  watch(
    () => items,
    () => {
      if (!select || !selected) return;
      const previous = cloneSelection();
      clearItem();
      if (multiple && !Array.isArray(previous)) return;
      if (isMultiple(previous)) {
        selected = previous?.map(item => findInList(item, items)).filter<NeoListSelectedItem>(item => !!item) ?? [];
      } else {
        selected = findInList(previous, items);
      }
      onselect?.({ previous, current: cloneSelection() });
    },
  );

  const context = $derived<NeoListContext>({
    // States
    items,

    select,
    multiple,
    selected,

    loading,
    skeleton,
    disabled,
    readonly,

    // Filter
    get highlight() {
      return highlight;
    },
    set highlight(value) {
      highlight = value;
    },
    get sort() {
      return sort;
    },
    set sort(value) {
      sort = value;
    },
    get filter() {
      return filter;
    },
    set filter(value) {
      filter = value;
    },

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
  const animateFn = $derived(missing ? emptyAnimation : toAnimation(animate));
  const animateProps = $derived(toTransitionProps(animate));
  const inFn = $derived(missing ? emptyTransition : toTransition(inAction));
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived(missing ? emptyTransition : toTransition(outAction));
  const outProps = $derived(toTransitionProps(outAction));
</script>

{#snippet loader(show = loading)}
  <!-- Loading indicator -->
  <li class="neo-list-loader" class:neo-list-item-select={select}>
    {#if show && customLoader}
      {@render customLoader(context)}
    {:else}
      <NeoListBaseLoader loading={show} {select} in={inAction} out={outAction} {...loaderProps} />
    {/if}
  </li>
{/snippet}

{#snippet list({ items: array, section, index: sectionIndex }: NeoListRenderContext)}
  {@const visible = array?.filter(filter).sort(sort)}
  <!-- Items -->
  {#each visible as item, index (item.id ?? index)}
    <svelte:element
      this={item.tag ?? 'li'}
      role={select ? 'option' : 'listitem'}
      data-index={index}
      data-section={sectionIndex}
      class:neo-list-item={true}
      class:neo-skeleton={skeleton}
      class:neo-list-item-select={select}
      style:--neo-list-item-color={getColorVariable(item.color)}
      {...item.containerProps}
      animate:animateFn={{ ...animateProps, enabled: !section }}
      out:inFn={inProps}
      in:outFn={outProps}
    >
      {#if item.divider}
        <NeoDivider {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
      {/if}
      {#if isSection(item)}
        {@const sectionContext = { items: item.items, section: item, index, context }}
        {#if customSection && !item.render}
          {@render customSection(list, sectionContext)}
        {:else}
          <NeoListBaseSection section={item} {index} {context} {skeleton} {list} />
        {/if}
      {:else if customItem && !item.render}
        {@render customItem({ item, index, context })}
      {:else}
        {@const selection = { index, item, sectionIndex, section }}
        {@const checked = isChecked(selection)}
        <NeoListBaseItem
          {item}
          {index}
          {context}
          {skeleton}
          {select}
          {checked}
          {highlight}
          {buttonProps}
          disabled={item.disabled || disabled}
          readonly={item.readonly || readonly}
          onclick={() => toggleItem(selection, checked)}
        />
      {/if}
    </svelte:element>
  {/each}
{/snippet}

<svelte:element this={containerTag} class:neo-list={true} class:neo-empty={empty} {...containerProps}>
  {@render before?.(context)}
  {#if !empty || loading || skeleton}
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
      {@render list({ items, context })}
      {@render loader(loading || (empty && skeleton))}
    </svelte:element>
  {:else}
    <svelte:element this={tag} bind:this={ref} class:neo-list-empty={true} in:fade={enterTransitionProps} {...rest}>
      {#if customEmpty}
        {@render customEmpty(context)}
      {:else}
        <div class="neo-list-empty-content">
          <IconList size="3rem" stroke="1" />
          <div>No items</div>
        </div>
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
      border-radius: var(--neo-border-radius);
    }

    &-items {
      padding-inline: 0.25rem;

      &.neo-scroll {
        @include mixin.scrollbar($button-height: 0.375rem);

        padding-block: 0.5rem;

        &.neo-shadow {
          @include mixin.fade-scroll(1rem);
        }
      }
    }

    &-loader,
    &-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
      padding-inline: 0.125rem;
    }

    &-loader {
      gap: 0.125rem;
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
      }

      :global(.neo-list-item-divider) {
        margin-block: 0.5rem;
        color: var(--neo-list-divider-color, var(--neo-text-color));
      }

      &:hover,
      &:focus,
      &:focus-within {
        :global(.neo-list-section-title) {
          color: var(--neo-text-color-highlight);
        }
      }
    }

    &-empty-content {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      gap: var(--neo-gap-xxs, 0.5rem);
      align-items: center;
      justify-content: center;
      min-width: var(--neo-list-min-width, 8rem);
      min-height: var(--neo-list-min-height);
    }
  }
</style>
