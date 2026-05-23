<script lang="ts">
  import type {
    NeoListContext,
    NeoListItem,
    NeoListItemOrSection,
    NeoListMethods,
    NeoListProps,
    NeoListRenderContext,
    NeoListSection,
    NeoListSelectedItem,
    NeoListSelectEvent,
    NeoListSelectMethods,
  } from '~/list/neo-list.model.js';
  import type { NeoVirtualContext, NeoVirtualItem, NeoVirtualListMethods, NeoVirtualRegister } from '~/list/neo-virtual-list.model.js';
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
  import { findByIdInList, hasSections, isSection, showDivider } from '~/list/neo-list.model.js';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoListBaseLoader from '~/list/NeoListBaseLoader.svelte';
  import NeoListBaseSection from '~/list/NeoListBaseSection.svelte';
  import NeoVirtualList from '~/list/NeoVirtualList.svelte';
  import { toAnimation, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { NeoErrorListSelectDisabled } from '~/utils/error.utils.js';
  import { Logger } from '~/utils/logger.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickCircOutProps, quickDurationProps, quickScaleProps } from '~/utils/transition.utils.js';

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
    scrolling = $bindable(false),
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

    // Virtualization
    virtual = false,
    itemHeight,
    estimatedItemHeight = 40,
    buffer = 3,
    key,
    virtualProps,

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

  // ------------------------------------------------------ Virtual gating ----

  const sections = $derived(hasSections(items));
  const virtualEnabled = $derived(virtual && !sections && !flip);

  let virtualWarned = false;
  $effect(() => {
    if (!virtual) {
      virtualWarned = false;
      return;
    }
    if (virtualEnabled || virtualWarned) return;
    virtualWarned = true;
    if (sections) Logger.warn('NeoList: `virtual` is disabled when items contain sections — falling back to non-virtual rendering.');
    else if (flip) Logger.warn('NeoList: `virtual` is disabled when `flip` is set — falling back to non-virtual rendering.');
  });

  const isMultiple = (list?: NeoListSelectedItem | NeoListSelectedItem[]): list is NeoListSelectedItem[] | undefined =>
    multiple && (Array.isArray(list) || list === undefined);

  const isNullable = $derived(multiple ? nullable || (isMultiple(selected) && (selected?.length ?? 0) > 1) : nullable);

  const onScrollEvent = (e?: SvelteEvent) => {
    if (!ref) return;
    if (ref.scrollTop === 0) {
      if (flip) return onScrollBottom?.(e);
      else return onScrollTop?.(e);
    }
    if (Math.abs(Math.abs(ref.scrollTop) + ref.clientHeight - ref.scrollHeight) <= scrollTolerance) {
      if (flip) return onScrollTop?.(e);
      else return onScrollBottom?.(e);
    }
  };

  // -------------------------------------------------- Imperative methods ----
  // In virtual mode, scroll methods delegate to NeoVirtualList (bound below).
  // Otherwise they operate directly on the local DOM ref.

  let virtualList = $state<NeoVirtualListMethods | undefined>();

  export const scrollToTop: NeoListMethods['scrollToTop'] = (options) => {
    if (virtualEnabled && virtualList) return virtualList.scrollToTop(options);
    if (!ref) return false;
    ref.scrollTo({ top: flip ? -ref.scrollHeight : 0, behavior: 'smooth', ...options });
    onScrollEvent();
    return ref;
  };

  export const scrollToBottom: NeoListMethods['scrollToBottom'] = (options) => {
    if (virtualEnabled && virtualList) return virtualList.scrollToBottom(options);
    if (!ref?.scrollHeight) return false;
    ref.scrollTo({ top: flip ? 0 : ref.scrollHeight, behavior: 'smooth', ...options });
    onScrollEvent();
    return ref;
  };

  export const scrollToIndex: NeoListMethods['scrollToIndex'] = (index, options) => {
    if (virtualEnabled && virtualList) return virtualList.scrollToIndex(index, options);
    return false;
  };

  export const refresh: NeoListMethods['refresh'] = () => {
    if (virtualEnabled && virtualList) virtualList.refresh();
  };

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
    if (!flip || !ref || virtualEnabled) return;
    scrollReverse();
  });

  const isSameIndex = (left: NeoListSelectedItem, right: NeoListSelectedItem) =>
    left?.index === right?.index && left?.sectionIndex === right?.sectionIndex;

  const cloneSelection = (selection = selected): undefined | NeoListSelectedItem | NeoListSelectedItem[] => {
    if (!selection || (Array.isArray(selection) && !selection.length)) return multiple ? [] : undefined;
    return shallowClone(selection, Array.isArray(selection) ? 3 : 2);
  };

  export const selectItem: NeoListSelectMethods['selectItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
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

  export const clearItem: NeoListSelectMethods['clearItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
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
  export const reSelect: NeoListSelectMethods['reSelect'] = () => {
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
    scrolling,

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
    scrollToIndex,
    refresh,
    selectItem,
    clearItem,
    reSelect,
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

  // Viewport tracking for non-virtual mode: a single IntersectionObserver on the
  // scroll container marks rows as visible / hidden. FLIP and mount/unmount
  // transitions are then skipped for rows outside the viewport — animating an
  // off-screen translate is invisible work anyway, and FLIP's per-row
  // getBoundingClientRect cost is what makes 1000-row mutations stutter.
  const visibleRows: Set<Element> = new Set();
  let io = $state<IntersectionObserver | null>(null);

  $effect(() => {
    if (!ref || virtualEnabled || typeof IntersectionObserver === 'undefined') {
      io = null;
      visibleRows.clear();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleRows.add(entry.target);
          else visibleRows.delete(entry.target);
        }
      },
      // 50% rootMargin keeps a buffer above/below so a row scrolling toward the
      // viewport is already marked visible by the time it animates in.
      { root: ref, rootMargin: '50%' },
    );
    io = observer;
    return () => {
      observer.disconnect();
      io = null;
      visibleRows.clear();
    };
  });

  const observeRow = (node: Element) => {
    if (!io) return;
    io.observe(node);
    return () => {
      io?.unobserve(node);
      visibleRows.delete(node);
    };
  };

  // Skip FLIP for rows outside the viewport. Falls back to `true` (skip) when
  // the IntersectionObserver hasn't run yet for a row — FLIP wouldn't be
  // visually meaningful for an unmeasured row anyway, and skipping avoids the
  // synchronous getBoundingClientRect cost on freshly-mounted rows during a
  // re-render storm.
  const skipOffscreen = (node: Element) => !visibleRows.has(node);

  // Transitions: in virtual mode, suppress per-row mount/unmount transitions while
  // the user is actively scrolling — the cursor advance would otherwise fire
  // transitions on every row that crosses the buffer boundary.
  const animateFn = $derived(missing ? emptyAnimation : toAnimation(animate));
  const animateProps = $derived(toTransitionProps(animate));
  const inFn = $derived.by(() => {
    if (missing) return emptyTransition;
    if (virtualEnabled && scrolling) return emptyTransition;
    return toTransition(inAction);
  });
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived.by(() => {
    if (missing) return emptyTransition;
    if (virtualEnabled && scrolling) return emptyTransition;
    return toTransition(outAction);
  });
  const outProps = $derived(toTransitionProps(outAction));

  // ---------------------- Virtual mode: filtered/sorted slice ---------------
  // Sections are guaranteed absent in virtual mode (gated above), so we can
  // operate on a flat array.

  const visibleItems = $derived.by<NeoListItem[]>(() => {
    if (!virtualEnabled) return [];
    const flat = items as NeoListItem[];
    const filtered: NeoListItem[] = [];
    for (let i = 0; i < flat.length; i++) {
      const it = flat[i]!;
      if (filter(it)) filtered.push(it);
    }
    return filtered.sort(sort);
  });

  // eslint-disable-next-line style/operator-linebreak
  const virtualKey = $derived(key ??
    ((item: NeoListItemOrSection, index: number) => (item.id as string | number | undefined) ?? index));

  // Resolve original (unfiltered) index for selection lookup so toggleItem
  // matches `findByIdInList` semantics in non-virtual mode.
  const itemOriginalIndex = (item: NeoListItem) => (items as NeoListItem[]).indexOf(item);
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
        animate:animateFn={{ ...animateProps, skip: section ? true : skipOffscreen }}
        out:inFn={inProps}
        in:outFn={outProps}
        {@attach observeRow}
      >
        {#if renderDivider(i, visible, flip && !isSafari() ? 'bottom' : 'top')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
        {#if isSection(item)}
          {@const sectionContext = { items: item.items, section: item, index, context }}
          {#if customSection && !item.render}
            {@render customSection(list, sectionContext)}
          {:else}
            <NeoListBaseSection section={item} {index} {context} {select} {list} {reverse} {flip} {...sectionProps} />
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
            flip={flip && !isSafari()}
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

{#snippet virtualRow(v: NeoVirtualItem<NeoListItem>, _ctx: NeoVirtualContext<NeoListItem>, register: NeoVirtualRegister)}
  {@const item = v.item}
  {@const originalIndex = itemOriginalIndex(item)}
  {@const checked = isChecked({ index: originalIndex, item })}
  <svelte:element
    this={item.tag ?? 'li'}
    role={select ? 'option' : 'listitem'}
    data-id={item?.id}
    data-index={originalIndex}
    aria-selected={checked}
    aria-posinset={v.index + 1}
    aria-setsize={visibleItems.length}
    class:neo-list-item={true}
    class:neo-checked={checked}
    class:neo-list-item-select={select}
    style:--neo-list-item-color={getColorVariable(item.color)}
    {...item.containerProps}
    {@attach register}
  >
    {#if customItem && !item.render}
      {@render customItem({ item, index: originalIndex, checked, context })}
    {:else}
      <NeoListBaseItem
        {item}
        index={originalIndex}
        {context}
        {checked}
        {select}
        {highlight}
        {buttonProps}
        {reverse}
        {rounded}
        flip={false}
        disabled={item.disabled || disabled}
        readonly={item.readonly || readonly || (!isNullable && checked)}
        {...itemProps}
        onclick={select ? () => toggleItem({ index: originalIndex, item }, checked) : undefined}
      />
    {/if}
  </svelte:element>
{/snippet}

{#snippet virtualLoader()}
  {#if loading}
    {@render loader(true)}
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
  {#if virtualEnabled && (!empty || loading)}
    <NeoVirtualList
      bind:this={virtualList}
      bind:ref
      bind:scrolling
      {tag}
      role={select ? 'listbox' : 'list'}
      items={visibleItems}
      key={virtualKey}
      {itemHeight}
      {estimatedItemHeight}
      {buffer}
      {scrollTolerance}
      {onScrollTop}
      {onScrollBottom}
      class={[
        'neo-list-items',
        scrollbar && 'neo-scroll',
        shadow && 'neo-shadow',
        dim && 'neo-dim',
      ]}
      onscroll={rest?.onscroll}
      after={virtualLoader}
      {...virtualProps}
      children={virtualRow}
    />
  {:else if !empty || loading}
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

    :global {
      .neo-list-items {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 100%;
        margin: 0;
        padding-inline: var(--neo-list-padding, 0.375rem);
        padding-block: var(--neo-list-padding, 0.375rem);
        overflow: auto;
        border-radius: var(--neo-list-border-radius, var(--neo-border-radius));

        &.neo-scroll {
          padding-block: var(--neo-list-scroll-padding, 0.625rem);

          &.neo-shadow {
            @include mixin.fade-scroll(1rem);
          }

          @include mixin.scrollbar($button-height: var(--neo-list-scrollbar-padding, 0.625rem));
        }

        &.neo-dim {
          &:hover > .neo-list-item:not(:hover, .neo-checked, :has(*:focus-visible)),
          &:has(.neo-list-item *:focus-visible) > .neo-list-item:not(:hover, .neo-checked, :has(*:focus-visible)) {
            opacity: 0.6;
            transition-timing-function: linear;
            transition-duration: 0.6s;
          }
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

      :global(.neo-list-items) {
        // TODO: remove when Safari supports `flex-direction: column-reverse;` with correct padding
        @supports not ((hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none)) {
          flex-direction: column-reverse;
          justify-content: end;
        }
      }
    }
  }
</style>
