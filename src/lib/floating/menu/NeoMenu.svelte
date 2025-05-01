<script lang="ts">
  import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';

  import { getFocusableElement } from '@dvcol/common-utils/common/element';

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
    triggerRef = $bindable(),

    target,
    portal = true,
    padding = '0',
    openOnHover = true,
    openOnFocus = false,
    openOnClick = false,
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

  const host = $derived.by(() => {
    if (triggerRef) return triggerRef;
    if (!target) return;
    if (typeof target === 'function') return target();
    return target;
  });

  const onkeydown = (e: KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    open = e.key === 'ArrowDown';
    if (open && ref) getFocusableElement(ref)?.focus();
  };

  $effect(() => {
    host?.addEventListener('keydown', onkeydown);
    return () => host?.removeEventListener('keydown', onkeydown);
  });
</script>

{#snippet tooltip()}
  <NeoMenuList
    {items}
    {shadow}
    {scrollbar}
    {rounded}
    {reverse}
    {flip}
    {baseProps}
    {itemProps}
    {dividerProps}
    {keepOpenOnSelect}
    tooltipProps={{ role, portal, padding, openOnHover, openOnFocus, openOnClick, ...rest }}
    {...menuProps}
    {onMenu}
    {onSelect}
  />
{/snippet}

<NeoTooltip
  bind:ref
  bind:triggerRef
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
  {rounded}
  {...rest}
  {tooltip}
/>
