<script lang="ts">
  import type { NeoTooltipContext } from 'src/lib/index.js';

  import type { NeoTooltipPlacement } from '~/floating/common/neo-placement.model.js';
  import type { NeoMenuContext, NeoMenuItem, NeoMenuListItemProps } from '~/floating/menu/neo-menu-list-item.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { isSafari } from '@dvcol/common-utils/common/browser';
  import { getFocusableElement, getLastFocusableElement } from '@dvcol/common-utils/common/element';
  import { getUUID } from '@dvcol/common-utils/common/string';
  import { tick } from 'svelte';

  import NeoDivider from '~/divider/NeoDivider.svelte';
  import { reversePlacement } from '~/floating/common/neo-placement.model.js';
  import { getMenuContext, setMenuContext } from '~/floating/menu/neo-menu-context.svelte.js';
  import NeoMenuList from '~/floating/menu/NeoMenuList.svelte';
  import NeoMenuListItem from '~/floating/menu/NeoMenuListItem.svelte';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';
  import { showDivider } from '~/list/neo-list.model.js';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import { getColorVariable } from '~/utils/colors.utils.js';

  let {
    // Snippets
    children,

    // Item Props
    ref = $bindable(),
    tag = 'li',
    menuTag = 'ul',

    item,
    parent,
    array,
    index = 0,
    sectionIndex,
    level = 1,
    divider,

    // Tooltip Props
    tooltipRef = $bindable(),
    open = $bindable(false),
    keepOpenOnSelect,

    placement = 'right-start',
    offset = (p?: NeoTooltipPlacement) => ({ mainAxis: 8, crossAxis: p?.endsWith('start') ? -6 : 6 }),

    // Styles
    rounded,
    reverse,
    flip,

    // Events
    onMenu,
    onSelect,

    // Other Props
    dividerProps,
    tooltipProps,
    baseProps,
    menuProps,
    ...rest
  }: NeoMenuListItemProps = $props();

  const items = $derived(item?.items);

  const menuContext = getMenuContext();
  $effect(() => {
    if (!menuContext) return;
    menuContext.toggle(index, open);
  });

  let tooltipOpen = $state(false);
  const childContext = setMenuContext({
    get open() {
      return open;
    },
    get ref() {
      return ref ?? menuContext?.ref;
    },
    async dismiss() {
      tooltipOpen = false;
      await tick();
      return menuContext?.dismiss();
    },
  });

  $effect(() => {
    open = tooltipOpen || childContext.children;
  });

  const nested = $derived(!item.section && !!items?.length && !!ref);

  const onkeydown = async (e: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    if (!nested && !parent) return;
    e.preventDefault();
    e.stopPropagation();
    const openNested = reverse ? e.key === 'ArrowLeft' : e.key === 'ArrowRight';
    if (nested) tooltipOpen = openNested;
    // If we are closing the nested menu we don't change focus
    if (!openNested && open) return;
    // If we are on the main menu and closing, do nothing
    if (!openNested && !parent) return;
    await tick();
    // Focus the first focusable element in the opened tooltip
    if (openNested && flip) return getLastFocusableElement(tooltipRef)?.focus();
    if (openNested) return getFocusableElement(tooltipRef)?.focus();
    // Focus the first focusable element in the parent menu:
    return menuContext?.ref?.focus();
  };

  $effect(() => {
    ref?.addEventListener('keydown', onkeydown);
    return () => ref?.removeEventListener('keydown', onkeydown);
  });

  const onclick = (e: SvelteEvent<MouseEvent>, checked?: boolean) => {
    if (nested) {
      onMenu?.(item, e);
      return baseProps?.onclick?.(e, checked);
    }
    onSelect?.(item, e);
    baseProps?.onclick?.(e, checked);
    if (keepOpenOnSelect || item.keepOpenOnSelect) return;
    menuContext?.dismiss();
  };

  const context = $derived<NeoMenuContext>({ item, parent, array, index, sectionIndex, open, keepOpenOnSelect, onMenu, onSelect });

  const nestedPlacement = $derived(reverse ? reversePlacement(placement) : placement);

  const renderDivider = (index: number, array: NeoMenuItem[] = [], position: 'top' | 'bottom') => {
    if (position === 'top') return index && (showDivider(array[index]?.divider, 'top') ?? showDivider(divider, 'top'));
    if (index >= array.length - 1) return false;
    return showDivider(array[index].divider, 'bottom') && !showDivider(array[index + 1]?.divider, 'top');
  };
</script>

<svelte:element
  this={item.tag ?? tag}
  role="menuitem"
  data-index={index}
  data-level={level}
  data-section={sectionIndex}
  aria-haspopup={nested ? 'menu' : undefined}
  aria-posinset={index + 1}
  aria-setsize={array?.length}
  class:neo-menu-item={true}
  class:neo-section={!!item.section}
  style:--neo-list-item-color={getColorVariable(item.color)}
  {...rest}
  {...item.itemProps}
>
  {#if renderDivider(index, array, flip && !isSafari() ? 'bottom' : 'top')}
    <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
  {/if}

  {#if children}
    {@render children?.(context)}
  {:else if item.section}
    {@const labelId = item.label ? `neo-menu-item-section-label-${getUUID()}` : undefined}

    {#if labelId}
      <span id={labelId} class="neo-menu-item-section-label" class:neo-sticky={item.sticky} class:neo-reverse={reverse || item.reverse}>
        {item.label}
      </span>
    {/if}
    {#if items}
      <svelte:element this={menuTag} role="menu" class:neo-menu-item-section={true} class:neo-flip={flip}>
        {#each items as child, childIndex (child.id ?? childIndex)}
          <NeoMenuListItem
            {children}
            {tag}
            {menuTag}

            item={child}
            parent={item}
            array={items}
            index={childIndex}
            sectionIndex={index}

            {level}
            {divider}
            {keepOpenOnSelect}
            {placement}
            {offset}

            {rounded}
            {reverse}
            {flip}

            {dividerProps}
            {tooltipProps}
            {baseProps}
            {...rest}

            menuProps={{ tag: menuTag, rounded, reverse, flip, divider, dividerProps, tooltipProps, baseProps, ...child.menuProps }}
            onMenu={(i, e) => {
              child.menuProps?.onMenu?.(i, e);
              onMenu?.(i, e);
            }}
            onSelect={(i, e) => {
              child.menuProps?.onSelect?.(i, e);
              onSelect?.(i, e);
            }}
          />
        {/each}
      </svelte:element>
    {/if}
  {:else}
    <NeoListBaseItem
      bind:buttonRef={ref}
      {item}
      {index}
      {context}
      {rounded}
      {reverse}
      {flip}
      toggle={nested}
      arrow={nested}
      checked={open}
      selector=".neo-menu-item"
      {...baseProps}
      {...item.baseProps}
      {onclick}
    />
  {/if}

  {#if renderDivider(index, array, flip && !isSafari() ? 'top' : 'bottom')}
    <NeoDivider aria-hidden="true" {...dividerProps} {...item.dividerProps} class={['neo-menu-item-divider', item.dividerProps?.class]} />
  {/if}
</svelte:element>

{#snippet tooltip({ placement }: NeoTooltipContext)}
  <NeoMenuList
    flip={flip ?? placement.includes('top')}
    tag={menuTag}
    {...menuProps}
    itemProps={{ ...rest, ...menuProps?.itemProps }}
    {keepOpenOnSelect}
    {items}
    {item}
    level={level + 1}
    {onMenu}
    {onSelect}
  />
{/snippet}

{#if nested}
  <NeoTooltip
    target={ref}
    bind:ref={tooltipRef}
    bind:open={() => open,
      (_open) => {
        tooltipOpen = _open;
      }}
    {rounded}
    {...tooltipProps}
    {...item.tooltipProps}
    placement={nestedPlacement}
    {offset}
    {tooltip}
    openOnFocus={false}
  />
{/if}

<style lang="scss">
  .neo-menu-item {
    --neo-btn-bg-color-hover: var(--neo-menu-bg-color-hover, transparent);

    padding: 0 var(--neo-menu-padding, var(--neo-gap-4xs, 0.25rem));
    color: var(--neo-list-item-color, inherit);
    list-style-type: none;

    :global(> .neo-list-item-button) {
      width: 100%;

      --neo-btn-text-color-active: currentcolor;
    }

    :global(> .neo-list-item-button.neo-rounded) {
      border-radius: var(--neo-btn-border-radius, var(--neo-border-radius-lg));
    }

    &:hover,
    &:focus,
    &:focus-within {
      :global(> .neo-list-item-button .neo-list-item-content) {
        color: var(--neo-text-color-highlight);
      }

      :global(> .neo-list-item-button .neo-list-item-description),
      :global(> .neo-list-item-button .neo-list-item-tags){
        color: var(--neo-text-color-secondary-highlight);
      }
    }

    &.neo-section {
      padding: 0;
    }

    &-section {
      display: flex;
      flex-direction: column;

      &-label {
        display: inline-flex;
        width: 100%;
        padding: 0.25rem 0.6125rem;
        transition: color 0.3s ease;
        margin-block-end: 0.125rem;

        &.neo-sticky {
          position: sticky;
          top: -0.5rem;
          z-index: var(--neo-z-index-in-front, 1);
          background: var(
                          --neo-list-section-bg-color,
                          linear-gradient(to top, transparent 5%, oklch(from var(--neo-background-color) l c h / 50%) 20%, var(--neo-background-color))
          );
        }

        &.neo-reverse {
          justify-content: flex-end;
          text-align: end;
        }
      }

      &.neo-flip {
        // TODO: remove when Safari supports `flex-direction: column-reverse;` with correct padding
        @supports not ((hanging-punctuation: first) and (font: -apple-system-body) and (-webkit-appearance: none)) {
          flex-direction: column-reverse;
          justify-content: end;
        }
      }
    }
  }
</style>
