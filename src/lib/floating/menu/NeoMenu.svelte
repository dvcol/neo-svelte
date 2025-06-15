<script lang="ts">
  import type { NeoTooltipContext } from 'src/lib/index.js';

  import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';

  import { getFocusableElement } from '@dvcol/common-utils/common/element';
  import { tick } from 'svelte';

  import { setMenuContext } from '~/floating/menu/neo-menu-context.svelte.js';
  import NeoMenuList from '~/floating/menu/NeoMenuList.svelte';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';

  let {
    // Item Props
    items = [],

    keepOpenOnSelect,

    // Tooltip Props
    ref = $bindable(),
    open = $bindable(false),
    position = $bindable(),
    triggerRef = $bindable(),

    target,
    portal = true,
    padding = '0',
    openOnHover = true,
    openOnFocus = false,
    openOnClick = true,
    unmountOnClose = false,
    role = 'menu',

    // Styles
    shadow = true,
    scrollbar,
    rounded,
    reverse,
    flip,

    // Events
    onMenu,
    onSelect,

    // Props
    menuProps,
    baseProps,
    itemProps,
    dividerProps,
    ...rest
  }: NeoMenuProps = $props();

  let tooltipOpen = $state(false);
  const context = setMenuContext({
    get open() {
      return open;
    },
    get ref() {
      return ref;
    },
    dismiss() {
      tooltipOpen = false;
    },
  });

  $effect(() => {
    open = tooltipOpen || context.children;
  });

  const toggleListener = async (e: KeyboardEvent) => {
    // if tab && open, focus next element
    if (e.key === 'Tab' && open) {
      if (e.shiftKey !== position?.includes('top')) return;
      e.preventDefault();
      e.stopPropagation();
      return getFocusableElement(ref)?.focus();
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    const was = open;
    if (position?.includes('bottom')) triggerRef?.toggle?.(e.key === 'ArrowDown');
    if (position?.includes('top')) triggerRef?.toggle?.(e.key === 'ArrowUp');
    if (position?.includes('right')) triggerRef?.toggle?.(e.key === 'ArrowRight');
    if (position?.includes('left')) triggerRef?.toggle?.(e.key === 'ArrowLeft');
    await tick();
    if (was && open && ref) getFocusableElement(ref)?.focus();
  };

  const closeListener = async (e: KeyboardEvent) => {
    if (!triggerRef) return;
    if (position?.includes('bottom') && e.key !== 'ArrowUp') return;
    if (position?.includes('top') && e.key !== 'ArrowDown') return;
    if (position?.includes('right') && e.key !== 'ArrowLeft') return;
    if (position?.includes('left') && e.key !== 'ArrowRight') return;
    const selector = baseProps?.selector || '.neo-menu-item';
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target?.closest(selector)?.previousElementSibling) return;
    if (!e.target?.closest(selector)?.parentElement?.classList.contains('neo-menu-list')) return;
    e.preventDefault();
    e.stopPropagation();
    triggerRef?.toggle?.(false);
    getFocusableElement(triggerRef)?.focus();
  };

  $effect(() => {
    triggerRef?.addEventListener('keydown', toggleListener);
    ref?.addEventListener('keydown', closeListener);
    return () => {
      triggerRef?.removeEventListener('keydown', toggleListener);
      ref?.removeEventListener('keydown', closeListener);
    };
  });
</script>

{#snippet tooltip({ placement }: NeoTooltipContext)}
  <NeoMenuList
    {items}
    {shadow}
    {scrollbar}
    {reverse}
    flip={flip ?? placement.includes('top')}
    {baseProps}
    {itemProps}
    {dividerProps}
    {keepOpenOnSelect}
    rounded={rounded === true ? 'xl' : rounded}
    tooltipProps={{ role, portal, padding, openOnHover, openOnFocus, openOnClick, unmountOnClose, ...rest }}
    {...menuProps}
    {onMenu}
    {onSelect}
  />
{/snippet}

<NeoTooltip
  bind:ref
  bind:triggerRef
  bind:position
  bind:open={() => open,
    (_open) => {
      tooltipOpen = _open;
    }}
  {target}
  {role}
  {portal}
  {padding}
  {openOnHover}
  {openOnFocus}
  {openOnClick}
  {unmountOnClose}
  rounded={rounded === true ? 'xl' : rounded}
  {...rest}
  {tooltip}
/>
