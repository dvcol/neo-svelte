import type { Snippet } from 'svelte';

import type { NeoButtonGroupContext, NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';
import type { NeoIconBouncingDotsProps } from '~/icons/neo-icon.model.js';

export interface NeoButtonRowItemButton extends NeoButtonProps {
  menuProps?: Partial<NeoMenuItem>;
  label?: string | undefined;
  icon?: Snippet<[unknown]>;
}

export interface NeoButtonRowItemDivider extends NeoDividerProps {
  divider: true;
}

export type NeoButtonRowItem = NeoButtonRowItemButton | NeoButtonRowItemDivider;

export const isButtonRowDivider = (item: NeoButtonRowItem): item is NeoButtonRowItemDivider => item && 'divider' in item && item.divider;

export function buttonRowItemToMenuItem(item: NeoButtonRowItem, next?: NeoButtonRowItem): NeoMenuItem | undefined {
  if (isButtonRowDivider(item)) return;
  return {
    id: item.id?.toString(),
    label: item.label,
    value: item.value,
    before: item.icon,
    reverse: item.reverse,
    disabled: item.disabled,
    readonly: item.readonly,
    color: item.color || undefined,
    href: item.href,
    onclick: item.onclick,
    divider: {
      bottom: next && isButtonRowDivider(next),
    },
    ...(item.menuProps ?? {}),
  };
}

export interface NeoButtonRowContext {
  items?: NeoMenuItem[];
  threshold?: number;
  menuProps?: Partial<NeoMenuProps>;
  iconProps?: NeoIconBouncingDotsProps;
  collapseProps?: NeoButtonProps;
}

export interface NeoButtonRowProps extends Omit<NeoButtonRowContext, 'items'>, Omit<NeoButtonGroupProps, 'children'> {
  // Snippets
  children?: Snippet<[NeoButtonGroupContext, NeoButtonRowContext]>;
  collapsed?: Snippet<[NeoButtonGroupContext, NeoButtonRowContext]>;

  // States
  ref?: NeoButtonGroupProps['ref'];
  items: NeoButtonRowItem[];

  // Button props
  hovered?: NeoButtonProps['hovered'];
  focused?: NeoButtonProps['focused'];

  // Other props
  buttonProps?: NeoButtonProps;
}
