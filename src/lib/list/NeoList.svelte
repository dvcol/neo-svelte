<script lang="ts">
  import type { NeoListContext, NeoListMethods, NeoListProps, NeoListRenderContext, NeoListSection, NeoListSelectedItem, NeoListSelectEvent } from '~/list/neo-list.model.js';

  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { shallowClone } from '@dvcol/common-utils/common/object';
  import { emptyAnimation, emptyTransition, flipToggle, scaleFreeze } from '@dvcol/svelte-utils/transition';
  import { watch } from '@dvcol/svelte-utils/watch';
  import { tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import IconList from '~/icons/IconList.svelte';
  import {
    findByIdInList,
    isSection,

    showDivider,
  } from '~/list/neo-list.model.js';
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
    skeleton = false,
    scrollToLoader,

    select = false,
    multiple = false,
    nullable = true,
    selected = $bindable(),
    disabled,
    readonly,
    reverse,
    dim,

    // Styles
    shadow = true,
    scrollbar = true,

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

    // Other props
    containerProps,
    loaderProps,
    buttonProps,
    dividerProps,
    itemProps,
    sectionProps,
    ...rest
  }: NeoListProps = $props();

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const empty = $derived(!items?.length);
  const missing = $derived(items?.some(item => item.id === undefined || item.id === null));

  const isMultiple = (list?: NeoListSelectedItem | NeoListSelectedItem[]): list is NeoListSelectedItem[] | undefined =>
    multiple && (Array.isArray(list) || list === undefined);

  const isNullable = $derived(multiple ? nullable || (isMultiple(selected) && (selected?.length ?? 0) > 1) : nullable);

  const scrollTop: NeoListMethods['scrollTop'] = debounce((options?: ScrollToOptions) => {
    if (!ref) return false;
    ref.scrollTo({ top: 0, behavior: 'smooth', ...options });
    return ref;
  }, shortDuration / 2);

  const scrollBottom: NeoListMethods['scrollBottom'] = debounce((options?: ScrollToOptions) => {
    if (!ref?.scrollHeight) return false;
    ref.scrollTo({ top: ref.scrollHeight, behavior: 'smooth', ...options });
    return ref;
  }, shortDuration / 2);

  $effect(() => {
    if (!loading || !scrollToLoader) return;
    scrollBottom();
  });

  const scrollReverse = async () => {
    await tick();
    if (!ref) return;
    ref.scrollTo({ top: ref.scrollHeight, behavior: 'instant' });
  };

  $effect(() => {
    if (!reverse || !ref) return;
    scrollReverse();
  });

  const isSameIndex = (left: NeoListSelectedItem, right: NeoListSelectedItem) =>
    left?.index === right?.index && left?.sectionIndex === right?.sectionIndex;

  const cloneSelection = (selection = selected): undefined | NeoListSelectedItem | NeoListSelectedItem[] => {
    if (!selection || (Array.isArray(selection) && !selection.length)) return multiple ? [] : undefined;
    return shallowClone(selection, Array.isArray(selection) ? 3 : 2);
  };

  const selectItem: NeoListMethods['selectItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
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

  const clearItem: NeoListMethods['clearItem'] = (...selection: NeoListSelectedItem[]): NeoListSelectEvent | undefined => {
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
  const reSelect: NeoListMethods['reSelect'] = () => {
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

    select,
    multiple,
    nullable,
    selected,

    loading,
    skeleton,
    disabled,
    readonly,
    reverse,

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
    reSelect,
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      scrollTop,
      scrollBottom,
    });
  });

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
      <IconList size="3rem" stroke="1" />
      <div>No items</div>
    </div>
  {/if}
{/snippet}

{#snippet list({ items: array, section, index: sectionIndex }: NeoListRenderContext)}
  {@const visible = array
    ?.map((item, index) => ({ item, index }))
    .filter(({ item }) => filter(item))
    .sort((a, b) => sort(a.item, b.item))}
  {#if !visible?.length}
    {@render emptyItem(section?.empty)}
  {:else}
    <!-- Items -->
    {#each visible as { item, index } (item.id ?? index)}
      {@const checked = !isSection(item) && isChecked({ index, item, sectionIndex, section })}
      <svelte:element
        this={item.tag ?? 'li'}
        role={select ? 'option' : 'listitem'}
        data-index={index}
        data-section={sectionIndex}
        aria-selected={checked}
        aria-posinset={index + 1}
        aria-setsize={array.length}
        class:neo-list-item={true}
        class:neo-skeleton={skeleton}
        class:neo-checked={checked}
        class:neo-list-item-select={select}
        style:--neo-list-item-color={getColorVariable(item.color)}
        {...item.containerProps}
        animate:animateFn={{ ...animateProps, skip: section }}
        out:inFn={inProps}
        in:outFn={outProps}
      >
        {#if index && showDivider(item.divider, 'top')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
        {#if isSection(item)}
          {@const sectionContext = { items: item.items, section: item, index, context }}
          {#if customSection && !item.render}
            {@render customSection(list, sectionContext)}
          {:else}
            <NeoListBaseSection section={item} {index} {context} {skeleton} {select} {list} {...sectionProps} />
          {/if}
        {:else if customItem && !item.render}
          {@render customItem({ item, index, checked, context })}
        {:else}
          <NeoListBaseItem
            {item}
            {index}
            {context}
            {skeleton}
            {checked}
            {select}
            {highlight}
            {buttonProps}
            disabled={item.disabled || disabled || section?.disabled}
            readonly={item.readonly || readonly || section?.readonly || (!isNullable && checked)}
            {...itemProps}
            onclick={select ? () => toggleItem({ index, item, sectionIndex, section }, checked) : undefined}
          />
        {/if}
        {#if index < visible.length - 1 && showDivider(item.divider, 'bottom') && !showDivider(visible[index + 1].item.divider, 'bottom')}
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
  class:neo-reverse={reverse}
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
  {#if !empty || loading || skeleton}
    <svelte:element
      this={tag}
      role={select ? 'listbox' : 'list'}
      bind:this={ref}
      class:neo-list-items={true}
      class:neo-scroll={scrollbar}
      class:neo-shadow={shadow}
      class:neo-rounded={buttonProps?.rounded}
      class:neo-dim={dim}
      in:scaleFreeze={quickScaleProps}
      {...rest}
    >
      {@render children?.(context)}
      {@render list({ items, context })}
      {@render loader(loading || (empty && skeleton))}
    </svelte:element>
  {:else}
    <svelte:element
      this={tag}
      aria-label="Empty placeholder"
      role={select ? 'listbox' : 'list'}
      bind:this={ref}
      class:neo-list-empty={true}
      in:fade={quickDurationProps}
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
    height: 100%;

    &-items,
    &-empty {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      margin: 0;
      padding: 0;
      border-radius: var(--neo-border-radius);
    }

    &-items {
      padding-inline: var(--neo-list-padding, 0.375rem);
      padding-block: var(--neo-list-padding, 0.375rem);
      overflow: auto;

      &.neo-scroll,
      &.neo-rounded {
        padding-block: var(--neo-menu-scroll-padding, 0.625rem);

        &:not(.neo-scroll) :global(> .neo-list-item) {
          padding: 0 var(--neo-menu-padding, var(--neo-gap-tiny, 0.25rem));
        }
      }

      &.neo-scroll {
        padding-block: var(--neo-list-scroll-padding, 0.625rem);

        &.neo-shadow {
          @include mixin.fade-scroll(1rem);
        }

        @include mixin.scrollbar($button-height: var(--neo-list-scrollbar-padding, 0.5rem));
      }

      &.neo-dim {
        &:hover > .neo-list-item:not(:hover, .neo-checked, :has(*:focus-visible)),
        &:has(> .neo-list-item :global(*:focus-visible)) > .neo-list-item:not(:hover, .neo-checked, :has(:global(*:focus-visible))) {
          opacity: 0.6;
          transition-delay: 0.1s;
          transition-timing-function: linear;
          transition-duration: 0.4s;
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
      transition: opacity 0.2s linear;
      transition-delay: 0s;
    }

    &-loader.neo-select {
      gap: var(--neo-gap-tiny, 0.25rem);
    }

    &-item {
      :global(> .neo-list-item-button) {
        width: 100%;
      }

      &.neo-skeleton {
        pointer-events: none;
      }

      &-select {
        :global(> .neo-list-item-button.neo-rounded) {
          border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-md));
        }

        :global(> .neo-list-base-loader:first-child) {
          margin-top: 0.25rem;
        }
      }

      :global(> .neo-list-item-divider) {
        margin-block: 0.5rem;
        color: var(--neo-list-divider-color, var(--neo-text-color));
      }

      &:hover,
      &:focus,
      &:focus-within {
        :global(> .neo-list-section-title),
        :global(> .neo-list-item-button .neo-list-item-content),
        :global(> .neo-list-item-button .neo-list-item-description) {
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

    &.neo-reverse {
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
