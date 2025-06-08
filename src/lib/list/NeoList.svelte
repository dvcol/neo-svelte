<script lang="ts">
  import type {
    NeoListContext,
    NeoListItemOrSection,
    NeoListMethods,
    NeoListProps,
    NeoListRenderContext,
    NeoListSection,
    NeoListSelectedItem,
    NeoListSelectEvent,
    NeoListSelectMethods,
  } from '~/list/neo-list.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { isSafari } from '@dvcol/common-utils/common/browser';
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { shallowClone } from '@dvcol/common-utils/common/object';
  import { emptyAnimation, emptyTransition, flipToggle, scaleFreeze } from '@dvcol/svelte-utils/transition';
  import { watch } from '@dvcol/svelte-utils/watch';
  import { tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoIconList from '~/icons/NeoIconList.svelte';
  import { findByIdInList, isSection, showDivider } from '~/list/neo-list.model.js';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoListBaseLoader from '~/list/NeoListBaseLoader.svelte';
  import NeoListBaseSection from '~/list/NeoListBaseSection.svelte';
  import { toAnimation, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { NeoErrorListSelectDisabled } from '~/utils/error.utils.js';
  import { Logger } from '~/utils/logger.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickCircOutProps, quickDurationProps, quickScaleProps, shortDuration } from '~/utils/transition.utils.js';

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
    items = [],
    highlight = $bindable(),
    filter = $bindable(item => !item?.hidden),
    sort = $bindable(() => 0),
    loading = false,
    scrollToLoader,
    scrollTolerance = 1,

    divider,
    select = false,
    multiple = false,
    nullable = true,
    selected = $bindable(),
    disabled,
    readonly,
    reverse,
    flip,
    dim,

    // Styles
    shadow = true,
    scrollbar = true,
    rounded,

    // Size
    flex,
    width: _width,
    height: _height,

    // Animation
    in: inAction = { use: scale, props: quickScaleProps },
    out: outAction = { use: fade, props: { ...quickScaleProps, delay: quickScaleProps?.duration } },
    animate = { use: flipToggle, props: quickCircOutProps },

    // Events
    onSelect,
    onScrollTop,
    onScrollBottom,

    // Other props
    containerProps,
    loaderProps,
    buttonProps,
    dividerProps,
    itemProps,
    sectionProps,
    ...rest
  }: NeoListProps = $props();

  // TODO - pull to refresh (in mixin or component)
  // TODO - floating button (back to top)

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const empty = $derived(!items?.length);
  const missing = $derived(items?.some(item => item.id === undefined || item.id === null));

  const isMultiple = (list?: NeoListSelectedItem | NeoListSelectedItem[]): list is NeoListSelectedItem[] | undefined =>
    multiple && (Array.isArray(list) || list === undefined);

  const isNullable = $derived(multiple ? nullable || (isMultiple(selected) && (selected?.length ?? 0) > 1) : nullable);

  const onScrollEvent = (e?: SvelteEvent) => {
    if (!ref) return;
    // if at the top console.info('top');
    if (ref.scrollTop === 0) {
      if (flip) return onScrollBottom?.(e);
      else return onScrollTop?.(e);
    }
    // if at the bottom console.info('bottom');
    if (Math.abs(Math.abs(ref.scrollTop) + ref.clientHeight - ref.scrollHeight) <= scrollTolerance) {
      if (flip) return onScrollTop?.(e);
      else return onScrollBottom?.(e);
    }
  };

  export const scrollToTop: NeoListMethods['scrollToTop'] = debounce((options?: ScrollToOptions) => {
    if (!ref) return false;
    ref.scrollTo({ top: flip ? -ref.scrollHeight : 0, behavior: 'smooth', ...options });
    onScrollEvent();
    return ref;
  }, shortDuration / 2);

  export const scrollToBottom: NeoListMethods['scrollToBottom'] = debounce((options?: ScrollToOptions) => {
    if (!ref?.scrollHeight) return false;
    ref.scrollTo({ top: flip ? 0 : ref.scrollHeight, behavior: 'smooth', ...options });
    onScrollEvent();
    return ref;
  }, shortDuration / 2);

  $effect(() => {
    if (!loading || !scrollToLoader) return;
    scrollToBottom();
  });

  const scrollReverse = async () => {
    await tick();
    if (!ref) return;
    ref.scrollTo({ top: ref.scrollHeight, behavior: 'instant' });
  };

  $effect(() => {
    if (!flip || !ref) return;
    scrollReverse();
  });

  const isSameIndex = (left: NeoListSelectedItem, right: NeoListSelectedItem) =>
    left?.index === right?.index && left?.sectionIndex === right?.sectionIndex;

  const cloneSelection = (selection = selected): undefined | NeoListSelectedItem | NeoListSelectedItem[] => {
    if (!selection || (Array.isArray(selection) && !selection.length)) return multiple ? [] : undefined;
    return shallowClone(selection, Array.isArray(selection) ? 3 : 2);
  };

  const selectItem: NeoListSelectMethods['selectItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
    if (disabled || readonly || !selection?.length) return;
    if (!select) throw new NeoErrorListSelectDisabled();

    const previous = cloneSelection();
    if (isMultiple(selected)) {
      selected = [...(selected ?? []), ...selection];
    } else {
      if (selection.length > 1) Logger.warn('Multiple selection is disabled. Only the first selection will be considered.');
      [selected] = selection;
    }
    return { type: 'select', previous, current: cloneSelection(), added: selection };
  };

  const clearItem: NeoListSelectMethods['clearItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
    if (disabled || readonly) return;
    if (!select) throw new NeoErrorListSelectDisabled();

    const previous = cloneSelection();
    if (isMultiple(selected)) {
      if (!selection?.length) selected = [];
      else selected = selected?.filter(item => !selection.some(s => isSameIndex(s, item))) ?? [];
    } else {
      selected = undefined;
    }

    return { type: 'clear', previous, current: cloneSelection(), removed: selection };
  };

  const toggleItem = (item: NeoListSelectedItem, clear = false) => {
    if (disabled || readonly) return;
    const event = clear ? clearItem(item) : selectItem(item);
    if (event) onSelect?.(event);
  };

  const isChecked = (item: NeoListSelectedItem) => {
    if (isMultiple(selected)) return selected?.some(i => isSameIndex(i, item));
    return isSameIndex(selected, item);
  };

  /**
   * Re-selects the previous selection if it still exists in the list
   */
  const reSelect: NeoListSelectMethods['reSelect'] = () => {
    if (!select || missing || !selected) return;
    if (Array.isArray(selected) && !selected.length) return;
    const previous = cloneSelection();
    clearItem();
    if (multiple && !Array.isArray(previous)) return;
    if (isMultiple(previous)) {
      selected = previous?.map(item => findByIdInList(item, items)).filter<NeoListSelectedItem>(item => !!item) ?? [];
    } else {
      selected = findByIdInList(previous, items);
    }
    const event: NeoListSelectEvent = { type: 're-select', previous, current: cloneSelection() };
    onSelect?.(event);
    return event;
  };

  // Clear selected item(s) when items list changes and attempts to re-select if the item still exists
  watch(
    () => {
      reSelect();
    },
    () => items,
  );

  const context = $derived<NeoListContext>({
    // States
    items,

    divider,
    loading,
    disabled,
    readonly,
    reverse,
    flip,

    // Selection
    select,
    multiple,
    nullable,
    selected,

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
    scrollToTop,
    scrollToBottom,
    selectItem,
    clearItem,
    reSelect,
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      scrollToTop,
      scrollToBottom,
    });
  });

  const onscroll: NeoListProps['onscroll'] = debounce((e) => {
    rest?.onscroll?.(e);
    onScrollEvent(e);
  }, 25);

  const renderDivider = (index: number, array: { item: NeoListItemOrSection }[], position: 'top' | 'bottom') => {
    if (position === 'top') return index && (showDivider(array[index]?.item.divider, 'top') ?? showDivider(divider, 'top'));
    if (index >= array.length - 1) return false;
    return showDivider(array[index].item.divider, 'bottom') && !showDivider(array[index + 1]?.item.divider, 'top');
  };

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  const animateFn = $derived(missing ? emptyAnimation : toAnimation(animate));
  const animateProps = $derived(toTransitionProps(animate));
  const inFn = $derived(missing ? emptyTransition : toTransition(inAction));
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived(missing ? emptyTransition : toTransition(outAction));
  const outProps = $derived(toTransitionProps(outAction));
</script>

{#snippet loader(show = loading)}
  <!-- Loading indicator -->
  <li
    role={select ? 'option' : 'listitem'}
    aria-disabled="true"
    aria-label="Loading placeholder."
    class="neo-list-loader"
    class:neo-select={select}
    class:neo-list-item-select={select}
  >
    {#if show && customLoader}
      {@render customLoader(context)}
    {:else}
      <NeoListBaseLoader loading={show} {select} in={inAction} out={outAction} {...loaderProps} />
    {/if}
  </li>
{/snippet}

{#snippet emptyItem(itemEmpty: NeoListSection['empty'] = customEmpty)}
  {#if itemEmpty}
    {@render itemEmpty(context)}
  {:else}
    <div class="neo-list-empty-content">
      <NeoIconList size="3rem" stroke="1" />
      <div>No items</div>
    </div>
  {/if}
{/snippet}

{#snippet list({ items: array, section, index: sectionIndex }: NeoListRenderContext)}
  {@const visible = array
    ?.map((item, index) => ({ item, index }))
    .filter(({ item }) => filter(item))
    .sort((a, b) => sort(a.item, b.item))}
  {#if !visible?.length && !loading}
    {@render emptyItem(section?.empty)}
  {:else}
    <!-- Items -->
    {#each visible as { item, index }, i (item.id ?? index)}
      {@const checked = !isSection(item) && isChecked({ index, item, sectionIndex, section })}
      <svelte:element
        this={item.tag ?? 'li'}
        role={select ? 'option' : 'listitem'}
        data-id={item?.id}
        data-index={index}
        data-section={sectionIndex}
        aria-selected={checked}
        aria-posinset={index + 1}
        aria-setsize={visible.length}
        class:neo-list-item={true}
        class:neo-checked={checked}
        class:neo-list-item-select={select}
        style:--neo-list-item-color={getColorVariable(item.color)}
        {...item.containerProps}
        animate:animateFn={{ ...animateProps, skip: section }}
        out:inFn={inProps}
        in:outFn={outProps}
      >
        {#if renderDivider(i, visible, flip && !isSafari() ? 'bottom' : 'top') ?? showDivider(divider, flip && !isSafari() ? 'bottom' : 'top')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
        {#if isSection(item)}
          {@const sectionContext = { items: item.items, section: item, index, context }}
          {#if customSection && !item.render}
            {@render customSection(list, sectionContext)}
          {:else}
            <NeoListBaseSection section={item} {index} {context} {select} {list} {reverse} {...sectionProps} />
          {/if}
        {:else if customItem && !item.render}
          {@render customItem({ item, index, checked, context })}
        {:else}
          <NeoListBaseItem
            {item}
            {index}
            {context}
            {checked}
            {select}
            {highlight}
            {buttonProps}
            {reverse}
            {rounded}
            disabled={item.disabled || disabled || section?.disabled}
            readonly={item.readonly || readonly || section?.readonly || (!isNullable && checked)}
            {...itemProps}
            onclick={select ? () => toggleItem({ index, item, sectionIndex, section }, checked) : undefined}
          />
        {/if}
        {#if renderDivider(i, visible, flip && !isSafari() ? 'top' : 'bottom')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
      </svelte:element>
    {/each}
  {/if}
{/snippet}

<svelte:element
  this={containerTag}
  class:neo-list={true}
  class:neo-empty={empty}
  class:neo-flip={flip}
  style:flex
  style:width={width?.absolute}
  style:min-width={width?.min}
  style:max-width={width?.max}
  style:height={height?.absolute}
  style:min-height={height?.min}
  style:max-height={height?.max}
  {...containerRest}
>
  {@render before?.(context)}
  {#if !empty || loading}
    <svelte:element
      this={tag}
      role={select ? 'listbox' : 'list'}
      bind:this={ref}
      class:neo-list-items={true}
      class:neo-scroll={scrollbar}
      class:neo-shadow={shadow}
      class:neo-dim={dim}
      in:scaleFreeze={quickScaleProps}
      {onscroll}
      {...rest}
    >
      {@render children?.(context)}
      {@render list({ items, context })}
      {@render loader(loading || empty)}
    </svelte:element>
  {:else}
    <svelte:element
      this={tag}
      aria-label="Empty placeholder"
      role={select ? 'listbox' : 'list'}
      bind:this={ref}
      class:neo-list-empty={true}
      in:fade={quickDurationProps}
      {onscroll}
      {...rest}
    >
      {@render emptyItem()}
    </svelte:element>
  {/if}
  {@render after?.(context)}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    &-loader,
    &-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      color: var(--neo-list-item-color, inherit);
      list-style-type: none;
      transition: opacity 0.2s linear;
      transition-delay: 0s;
    }

    &-items,
    &-empty {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      margin: 0;
      padding: 0;
      border-radius: var(--neo-list-border-radius, var(--neo-border-radius));
    }

    &-items {
      overflow: auto;
      padding-inline: var(--neo-list-padding, 0.375rem);
      padding-block: var(--neo-list-padding, 0.375rem);

      &.neo-scroll {
        padding-block: var(--neo-list-scroll-padding, 0.625rem);

        &.neo-shadow {
          @include mixin.fade-scroll(1rem);
        }

        @include mixin.scrollbar($button-height: var(--neo-list-scrollbar-padding, 0.625rem));
      }

      &.neo-dim {
        &:hover > .neo-list-item:not(:hover, .neo-checked, :has(*:focus-visible)),
        &:has(> .neo-list-item :global(*:focus-visible)) > .neo-list-item:not(:hover, .neo-checked, :has(:global(*:focus-visible))) {
          opacity: 0.6;
          transition-timing-function: linear;
          transition-duration: 0.6s;
        }
      }
    }

    &-loader.neo-select {
      gap: var(--neo-gap-xs, 0.625rem);
    }

    &-item {
      :global(> .neo-list-item-button) {
        width: 100%;
      }

      &-select {
        :global(> .neo-list-base-loader:first-child) {
          margin-top: 0.25rem;
        }
      }

      :global(> .neo-list-item-divider) {
        color: var(--neo-list-divider-color, var(--neo-text-color));
        margin-block: 0.5rem;
      }

      &:hover,
      &:focus,
      &:focus-within {
        :global(> .neo-list-section-title),
        :global(> .neo-list-item-button .neo-list-item-content){
          color: var(--neo-text-color-highlight);
        }

        :global(> .neo-list-item-button .neo-list-item-description),
        :global(> .neo-list-item-button .neo-list-item-tags){
          color: var(--neo-text-color-secondary-highlight);
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

    &.neo-flip {
      flex-direction: column-reverse;
      justify-content: end;

      .neo-list-items {
        // TODO: remove when Safari supports `flex-direction: column-reverse;` with correct padding
        @supports not ((hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none)) {
          flex-direction: column-reverse;
          justify-content: end;
        }
      }
    }
  }
</style>
