<script lang="ts">
  import { getFocusableElement } from '@dvcol/common-utils/common/element';

  import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';

  import NeoMenuList from '~/floating/menu/NeoMenuList.svelte';
  import { setMenuContext } from '~/floating/menu/neo-menu-context.svelte.js';
  import NeoTooltip from '~/floating/tooltips/NeoTooltip.svelte';

  /* eslint-disable prefer-const -- necessary for binding checked */
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
    openOnHover = false,
    openOnFocus = false,
    openOnClick = true,

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
  /* eslint-enable prefer-const */

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
    {baseProps}
    {itemProps}
    {dividerProps}
    {keepOpenOnSelect}
    tooltipProps={{ portal, padding, openOnHover, openOnFocus, openOnClick, ...rest }}
    {...menuProps}
    {onMenu}
    {onSelect}
  />
{/snippet}

<NeoTooltip
  bind:ref
  bind:triggerRef
  bind:open={
    () => open, // eslint-disable-line no-sequences
    _open => {
      tooltipOpen = _open;
      console.info('tooltipOpen setter', tooltipOpen);
    }
  }
  {target}
  {portal}
  {padding}
  {openOnHover}
  {openOnFocus}
  {openOnClick}
  {...rest}
  {tooltip}
/>
