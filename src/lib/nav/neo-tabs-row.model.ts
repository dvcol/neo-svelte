import type { Snippet } from 'svelte';

import type { NeoButtonRowItemDivider } from '~/buttons/neo-button-row.model.js';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';
import type { NeoIconBouncingDotsProps } from '~/icons/neo-icon.model.js';
import type { NeoTabProps } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';

import { getUUID } from '@dvcol/common-utils/common/string';

export interface NeoTabRowItemButton<Value = unknown> extends NeoTabProps<Value> {
  menuProps?: Partial<NeoMenuItem<Value>>;
  label?: string | undefined;
  icon?: Snippet<[unknown]>;
}

export interface NeoTabRowItemDivider extends NeoDividerProps {
  divider: true;
}

export type NeoTabRowItem<Value = unknown> = NeoTabRowItemButton<Value> | NeoTabRowItemDivider;

export const isTabRowDivider = <Value = unknown>(item: NeoTabRowItem<Value>): item is NeoButtonRowItemDivider => item && 'divider' in item && item.divider;

export function tabRowItemToMenuItem(item: NeoTabRowItem, next?: NeoTabRowItem): NeoMenuItem | undefined {
  if (isTabRowDivider(item)) return undefined;
  return {
    id: item.tabId ?? `neo-tab-${getUUID()}`,
    label: item.label,
    value: item.value,
    before: item.icon,
    reverse: item.reverse,
    disabled: item.disabled,
    readonly: item.readonly,
    color: item.color,
    href: item.href,
    onclick: item.onclick,
    divider: {
      bottom: next && isTabRowDivider(next),
    },
    ...(item.menuProps ?? {}),
  };
}

export interface NeoTabRowContext {
  items?: NeoMenuItem[];
  threshold?: number;
  menuProps?: Partial<NeoMenuProps>;
  iconProps?: NeoIconBouncingDotsProps;
  collapseProps?: NeoButtonProps;
}

export interface NeoTabsRowProps extends Omit<NeoTabRowContext, 'items'>, Omit<NeoTabsProps, 'children'> {
  // Snippets
  children?: Snippet<[NeoTabsContext, NeoTabRowContext]>;
  collapsed?: Snippet<[NeoTabsContext, NeoTabRowContext]>;

  // States
  ref?: NeoTabsProps['ref'];
  tabs: NeoTabRowItem[];

  // Button props
  hovered?: NeoButtonProps['hovered'];
  focused?: NeoButtonProps['focused'];

  // Other props
  tabProps?: NeoTabProps;
}
