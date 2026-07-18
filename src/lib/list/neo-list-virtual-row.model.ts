import type { TransitionConfig } from 'svelte/transition';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
import type {
  NeoListContext,
  NeoListItemRender,
  NeoListSelectedItem,
  NeoListVirtualItem,
} from '~/list/neo-list.model.js';
import type { NeoVirtualRegister } from '~/list/neo-virtual-list.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';

export type NeoListVirtualRowTransition = (
  node: Element,
  key: string | number,
  options: { direction: 'in' | 'out' },
) => TransitionConfig | (() => TransitionConfig);

export interface NeoListVirtualRowProps<Value = unknown, Context = NeoListContext> {
  // Snippets
  itemRender?: NeoListItemRender<Value, 'li', Context>;

  // Context
  item: NeoListVirtualItem<Value>;
  id: string | number;
  index: number;
  virtualIndex: number;
  setSize: number;
  checked?: boolean;
  context: Context;

  // States
  select?: boolean;
  highlight?: string;
  reverse?: boolean;
  disabled?: boolean;
  readonly?: boolean;

  // Styles
  rounded?: BorderRadiusInput;
  dividerTop?: boolean;
  dividerBottom?: boolean;

  // Transitions
  transitionIn: NeoListVirtualRowTransition;
  transitionOut: NeoListVirtualRowTransition;

  // Attachments
  register: NeoVirtualRegister;

  // Events
  ontoggle?: (item: NeoListSelectedItem<Value>, clear?: boolean) => void;

  // Other props
  buttonProps?: NeoButtonProps;
  itemProps?: Partial<Omit<NeoListBaseItemProps<Value, Context>, 'buttonProps'>>;
  dividerProps?: NeoDividerProps;
}
