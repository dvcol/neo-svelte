<script lang="ts">
  import type { NeoTooltipPlacement } from '~/floating/common/neo-placement.model.js';
  import type { NeoMenuContext, NeoMenuListItemProps } from '~/floating/menu/neo-menu-list-item.model.js';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { getFocusableElement } from '@dvcol/common-utils/common/element';
  import { tick } from 'svelte';

  import { reversePlacement } from '~/floating/common/neo-placement.model.js';
  import { getMenuContext, setMenuContext } from '~/floating/menu/neo-menu-context.svelte.js';
  import NeoMenuList from '~/floating/menu/NeoMenuList.svelte';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';
  import { getColorVariable } from '~/utils/colors.utils.js';

  let {
    // Snippets
    children,

    // Item Props
    ref = $bindable(),
    tag = 'li',

    item,
    parent,
    index = 0,
    length,
    level = 1,

    // Tooltip Props
    tooltipRef = $bindable(),
    open = $bindable(false),
    keepOpenOnSelect,

    placement = 'right-start',
    offset = (p: NeoTooltipPlacement) => ({ mainAxis: 6, crossAxis: p?.endsWith('start') ? -6 : 6 }),

    // Styles
    rounded,
    reverse,

    // Events
    onMenu,
    onSelect,

    // Other Props
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
      return ref;
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

  const nested = $derived(!!items?.length && !!ref);

  const onkeydown = async (e: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    if (!nested && !menuContext?.ref) return;
    e.preventDefault();
    e.stopPropagation();
    const openNested = reverse ? e.key === 'ArrowLeft' : e.key === 'ArrowRight';
    tooltipOpen = openNested;
    if (open && !openNested) return;
    await tick();
    if (openNested) getFocusableElement(tooltipRef)?.focus();
    if (!openNested) getFocusableElement(menuContext?.ref)?.focus();
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

  const context = $derived<NeoMenuContext>({ item, index, length, parent, open, keepOpenOnSelect, onMenu, onSelect });

  const nestedPlacement = $derived(reverse ? reversePlacement(placement) : placement);
</script>

<svelte:element
  this={item.tag ?? tag}
  bind:this={ref}
  role="menuitem"
  data-index={index}
  data-level={level}
  aria-haspopup={nested ? 'menu' : undefined}
  aria-posinset={index + 1}
  aria-setsize={length}
  class:neo-menu-item={true}
  style:--neo-list-item-color={getColorVariable(item.color)}
  {...rest}
  {...item.itemProps}
>
  {#if children}
    {@render children?.(context)}
  {:else}
    <NeoListBaseItem
      {item}
      {index}
      {context}
      {rounded}
      {reverse}
      toggle
      arrow={nested}
      checked={open}
      selector=".neo-menu-item"
      {...baseProps}
      {...item.baseProps}
      {onclick}
    />
  {/if}
</svelte:element>

{#snippet tooltip()}
  <NeoMenuList
    {reverse}
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
    padding: 0 var(--neo-menu-padding, var(--neo-gap-tiny, 0.25rem));
    color: var(--neo-list-item-color, inherit);

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
      :global(> .neo-list-item-button .neo-list-item-content),
      :global(> .neo-list-item-button .neo-list-item-description) {
        color: var(--neo-text-color-highlight);
      }
    }
  }
</style>
