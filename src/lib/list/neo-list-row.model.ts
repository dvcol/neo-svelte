import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
import type { NeoListBaseSectionProps } from '~/list/neo-list-base-section.model.js';
import type {
  NeoListContext,
  NeoListItemRender,
  NeoListRender,
  NeoListRowContext,
  NeoListRowRender,
  NeoListSectionRender,
  NeoListSelectedItem,
} from '~/list/neo-list.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';

export type NeoListRowProps<Value = unknown, Context = NeoListContext> = Omit<NeoListRowContext<Value, Context>, 'content'> & {
  // Snippets
  row?: NeoListRowRender<Value, Context>;
  itemRender?: NeoListItemRender<Value, 'li', Context>;
  sectionRender?: NeoListSectionRender<Value>;
  list: NeoListRender<Value>;

  // States
  select?: boolean;
  highlight?: string;
  reverse?: boolean;
  flip?: boolean;
  disabled?: boolean;
  readonly?: boolean;

  // Styles
  rounded?: BorderRadiusInput;

  // Events
  ontoggle?: (item: NeoListSelectedItem<Value>, clear?: boolean) => void;

  // Other props
  buttonProps?: NeoButtonProps;
  itemProps?: Partial<Omit<NeoListBaseItemProps<Value, Context>, 'buttonProps'>>;
  sectionProps?: NeoListBaseSectionProps<Value>;
};
