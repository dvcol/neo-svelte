<script lang="ts">
  import { getFocusableElement } from '@dvcol/common-utils/common/element';

  import { tick } from 'svelte';

  import type { NeoTooltipPlacement } from '~/floating/common/neo-placement.model.js';
  import type { NeoMenuContext, NeoMenuListItemProps } from '~/floating/menu/neo-menu-item.model.js';

  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoMenuList from '~/floating/menu/NeoMenuList.svelte';
  import { getMenuContext, setMenuContext } from '~/floating/menu/neo-menu-context.svelte.js';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';
  import NeoListBaseItem from '~/list/NeoListBaseItem.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
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

    // Tooltip Props
    tooltipRef = $bindable(),
    open = $bindable(false),
    keepOpen = false,

    placement = 'right-start',
    offset = (p: NeoTooltipPlacement) => ({ mainAxis: 6, crossAxis: p?.endsWith('start') ? -6 : 6 }),

    // Events
    onMenu,
    onSelect,

    // Other Props
    tooltipProps,
    baseProps,
    dividerProps,
    ...rest
  }: NeoMenuListItemProps = $props();
  /* eslint-enable prefer-const */

  const items = $derived(item?.items);

  const menuContext = getMenuContext();
  $effect(() => {
    if (!menuContext) return;
    menuContext.toggle(index, open);
  });

  const childContext = setMenuContext({
    get open() {
      return open;
    },
    get ref() {
      return ref;
    },
    async dismiss() {
      open = false;
      await tick();
      return menuContext?.dismiss();
    },
  });

  let tooltipOpen = $state(false);
  $effect(() => {
    open = tooltipOpen || childContext.children;
  });

  const nested = $derived(!!items?.length && !!ref);

  const onkeydown = async (e: KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    if (!nested && !menuContext?.ref) return;
    e.preventDefault();
    e.stopPropagation();
    tooltipOpen = e.key === 'ArrowRight';
    if (open && e.key === 'ArrowLeft') return;
    await tick();
    if (e.key === 'ArrowRight') getFocusableElement(tooltipRef)?.focus();
    if (e.key === 'ArrowLeft') getFocusableElement(menuContext?.ref)?.focus();
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
    if (keepOpen) return;
    menuContext?.dismiss();
  };

  // TODO - context
  const context = $derived<NeoMenuContext>({ item, index, length, parent, open, keepOpen, onMenu, onSelect });
</script>

<svelte:element
  this={item.tag ?? tag}
  bind:this={ref}
  role="option"
  data-index={index}
  aria-posinset={index + 1}
  aria-setsize={length}
  class:neo-menu-item={true}
  {...rest}
  {...item.itemProps}
>
  {#if children}
    {@render children?.(context)}
  {:else}
    <NeoListBaseItem {item} {index} {context} toggle arrow={nested} checked={open} selector=".neo-menu-item" {...baseProps} {onclick} />
  {/if}
</svelte:element>

{#snippet tooltip()}
  <NeoMenuList
    {...item.menuProps}
    itemProps={{ ...rest, ...item.itemProps }}
    baseProps={{ ...baseProps, ...item.baseProps }}
    tooltipProps={{ ...tooltipProps, ...item.tooltipProps }}
    {dividerProps}
    {keepOpen}
    {items}
    {item}
    onMenu={(i, e) => {
      item.menuProps?.onMenu?.(i, e);
      onMenu?.(i, e);
    }}
    onSelect={(i, e) => {
      item.menuProps?.onSelect?.(i, e);
      onSelect?.(i, e);
    }}
  />
{/snippet}

{#if nested}
  <NeoTooltip
    target={ref}
    bind:ref={tooltipRef}
    bind:open={
      () => open, // eslint-disable-line no-sequences
      _open => {
        tooltipOpen = _open;
      }
    }
    {...tooltipProps}
    {placement}
    {offset}
    {tooltip}
    openOnFocus={false}
  />
{/if}

<style lang="scss">
  .neo-menu-item {
    padding: 0 var(--neo-menu-padding, var(--neo-gap-tiny, 0.25));

    :global(> .neo-list-item-button) {
      width: 100%;

      --neo-btn-text-color-active: var(--neo-text-color);
    }

    :global(> .neo-list-item-button.neo-rounded) {
      border-radius: var(--neo-btn-border-radius-rounded, var(--neo-border-radius-md));
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
