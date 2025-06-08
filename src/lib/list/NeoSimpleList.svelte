<script lang="ts">
  import type { TransitionFunction, TransitionProps } from '@dvcol/svelte-utils/transition';

  import type { NeoListItem, NeoListMethods, NeoListProps } from '~/list/neo-list.model.js';
  import type { NeoSimpleListContext, NeoSimpleListProps } from '~/list/neo-simple-list.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { isSafari } from '@dvcol/common-utils/common/browser';
  import { debounce } from '@dvcol/common-utils/common/debounce';
  import { emptyTransition, scaleFreeze } from '@dvcol/svelte-utils/transition';
  import { fade, scale } from 'svelte/transition';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import NeoIconList from '~/icons/NeoIconList.svelte';
  import { showDivider } from '~/list/neo-list.model.js';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import NeoListBaseLoader from '~/list/NeoListBaseLoader.svelte';
  import NeoVirtualList from '~/list/NeoVirtualList.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { getColorVariable } from '~/utils/colors.utils.js';
  import { toSize } from '~/utils/style.utils.js';
  import { quickDurationProps, quickScaleProps, shortDuration } from '~/utils/transition.utils.js';

  let {
    // Snippets
    item: customItem,
    empty: customEmpty,
    loader: customLoader,
    after,
    before,
    children: inner,

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
    disabled,
    readonly,
    reverse,
    flip,
    dim,

    // Virtual List
    buffer,
    itemHeight,

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

    // Events
    onScrollTop,
    onScrollBottom,

    // Other props
    containerProps,
    loaderProps,
    buttonProps,
    dividerProps,
    itemProps,
    ...rest
  }: NeoSimpleListProps = $props();

  // TODO - loading

  const { tag: containerTag = 'div', ...containerRest } = $derived(containerProps ?? {});

  const filtered = $derived(items?.filter(item => filter(item)).sort((a, b) => sort(a, b)));
  const empty = $derived(!filtered?.length);
  const missing = $derived(filtered?.some(item => item.id === undefined || item.id === null));

  const onScrollEvent = debounce((e?: SvelteEvent) => {
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
  }, 25);

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

  const context = $derived<NeoSimpleListContext>({
    // States
    items,

    divider,
    loading,
    disabled,
    readonly,
    reverse,
    flip,

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
  });

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, {
      scrollToTop,
      scrollToBottom,
    });
  });

  const stopScrolling = debounce(() => {
    scrolling = false;
  }, 'ontouchstart' in window ? 300 : 150);

  const onscroll: NeoListProps['onscroll'] = (e) => {
    scrolling = true;
    rest?.onscroll?.(e);
    onScrollEvent(e);
    if (!ref || 'onscrollend' in ref) return;
    stopScrolling();
  };

  const onscrollend: NeoListProps['onscrollend'] = (e) => {
    rest?.onscrollend?.(e);
    stopScrolling();
  };

  const renderDivider = (index: number, array: NeoListItem[], position: 'top' | 'bottom') => {
    if (position === 'top') return index && (showDivider(array[index]?.divider, 'top') ?? showDivider(divider, 'top'));
    if (index >= array.length - 1) return false;
    return showDivider(array[index]?.divider, 'bottom') && !showDivider(array[index + 1]?.divider, 'top');
  };

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));

  // Skip first animation in virtual list
  let counter = 0;

  const inFn = $derived<TransitionFunction<TransitionProps>>((...args) => {
    counter++;
    if (missing || scrolling || counter < 1) return emptyTransition(...args);
    return toTransition(inAction)?.(...args);
  });
  const inProps = $derived(toTransitionProps(inAction));
  const outFn = $derived<TransitionFunction<TransitionProps>>((...args) => {
    if (missing || scrolling || counter < 1) return emptyTransition(...args);
    return toTransition(outAction)?.(...args);
  });
  const outProps = $derived(toTransitionProps(outAction));
</script>

{#snippet loader(show = loading)}
  <!-- Loading indicator -->
  <li
    role="listitem"
    aria-label="Loading placeholder."
    class="neo-list-loader"
  >
    {#if show && customLoader}
      {@render customLoader(context)}
    {:else}
      <NeoListBaseLoader loading={show} in={inAction} out={outAction} {...loaderProps} />
    {/if}
  </li>
{/snippet}

{#snippet emptyItem()}
  {#if customEmpty}
    {@render customEmpty(context)}
  {:else}
    <div class="neo-list-empty-content">
      <NeoIconList size="3rem" stroke="1" />
      <div>No items</div>
    </div>
  {/if}
{/snippet}

{#snippet list()}
  <NeoVirtualList
    bind:ref
    role="list"
    {tag}
    {rounded}
    {dim}
    {shadow}
    {scrollbar}
    {buffer}
    {itemHeight}
    items={filtered}
    in={{ use: scaleFreeze, props: quickScaleProps }}
    {...rest}
    {onscroll}
    {onscrollend}
    class={['neo-list-items', rest?.class]}
  >
    <!-- Before -->
    {#snippet before()}
      {@render inner?.(context)}
    {/snippet}
    <!-- Item -->
    {#snippet children({ item, index })}
      <svelte:element
        this={item.tag ?? 'li'}
        role="listitem"
        data-id={item?.id}
        data-index={index}
        aria-posinset={index + 1}
        aria-setsize={filtered.length}
        class:neo-list-item={true}
        style:--neo-list-item-color={getColorVariable(item.color)}
        {...item.containerProps}
        out:inFn={inProps}
        in:outFn={outProps}
      >
        {#if renderDivider(index, filtered, flip && !isSafari() ? 'bottom' : 'top') ?? showDivider(divider, flip && !isSafari() ? 'bottom' : 'top')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
        {#if customItem && !item.render}
          {@render customItem({ item, index, context })}
        {:else}
          <NeoListBaseItem
            {item}
            {index}
            {context}
            {highlight}
            {buttonProps}
            {reverse}
            {rounded}
            disabled={item.disabled || disabled}
            readonly={item.readonly || readonly}
            {...itemProps}
          />
        {/if}
        {#if renderDivider(index, filtered, flip && !isSafari() ? 'top' : 'bottom')}
          <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-list-item-divider', item.dividerProps?.class]} />
        {/if}
      </svelte:element>
    {/snippet}
    <!-- Loader -->
    {#snippet after()}
      {@render loader(loading || empty)}
    {/snippet}
  </NeoVirtualList>
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
    {@render list()}
  {:else}
    <svelte:element
      this={tag}
      aria-label="Empty placeholder"
      role="list"
      bind:this={ref}
      class:neo-list-empty={true}
      in:fade={quickDurationProps}
      {...rest}
      {onscroll}
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

    &-item {
      :global(> .neo-list-item-button) {
        width: 100%;
      }

      :global(> .neo-list-item-divider) {
        color: var(--neo-list-divider-color, var(--neo-text-color));
        margin-block: 0.5rem;
      }

      &:hover,
      &:focus,
      &:focus-within {
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
    }
  }
</style>
