import type { AnimationFunction, TransitionFunction, TransitionProps } from '@dvcol/svelte-utils/transition';
import type { Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
import type { NeoListBaseSectionProps } from '~/list/neo-list-base-section.model.js';
import type {
  NeoListContext,
  NeoListItemOrSection,
  NeoListItemRender,
  NeoListRowRender,
  NeoListSectionRender,
  NeoListSelectedItem,
} from '~/list/neo-list.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';

export interface NeoListVisibleItem<Value = unknown> {
  item: NeoListItemOrSection<Value>;
  index: number;
}

export interface NeoListRowsProps<Value = unknown, Context = NeoListContext> {
  // Snippets
  itemRender?: NeoListItemRender<Value, 'li', Context>;
  row?: NeoListRowRender<Value, Context>;
  sectionRender?: NeoListSectionRender<Value>;
  emptyRender?: Snippet<[Context]>;

  // Context
  items: NeoListItemOrSection<Value>[];
  visible: NeoListVisibleItem<Value>[];
  context: Context;

  // States
  sections?: boolean;
  loading?: boolean;
  select?: boolean;
  highlight?: string;
  reverse?: boolean;
  flip?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  nullable?: boolean;
  divider?: boolean;

  // Styles
  rounded?: BorderRadiusInput;

  // Animation
  animateFn: AnimationFunction<TransitionProps>;
  animateProps?: TransitionProps;
  inFn: TransitionFunction<TransitionProps>;
  inProps?: TransitionProps;
  outFn: TransitionFunction<TransitionProps>;
  outProps?: TransitionProps;
  skipOffscreen: (node: Element) => boolean;

  // Events
  ontoggle?: (item: NeoListSelectedItem<Value>, clear?: boolean) => void;

  // Attachments
  observe: Attachment<Element>;

  // Methods
  isChecked: (item: NeoListSelectedItem<Value>) => boolean | undefined;
  filter: (item: NeoListItemOrSection<Value>) => boolean;
  sort: (a: NeoListItemOrSection<Value>, b: NeoListItemOrSection<Value>) => number;

  // Other props
  buttonProps?: NeoButtonProps;
  dividerProps?: NeoDividerProps;
  itemProps?: Partial<Omit<NeoListBaseItemProps<Value, Context>, 'buttonProps'>>;
  sectionProps?: NeoListBaseSectionProps<Value>;
}
