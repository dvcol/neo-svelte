import type { Snippet } from 'svelte';
import type { NeoButtonGroup } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';

export type OnChange<T = unknown> = (tabId?: TabId, value?: T) => unknown;
export type NeoTabsContext = {
  // States
  active?: TabId;
  disabled?: boolean;

  // Styles
  slide?: boolean;
  add?: boolean;
  close?: boolean;
  vertical?: boolean;
};

export type TabsProps<T = unknown> = {
  // Snippets
  children?: Snippet<[NeoTabsContext]>;

  // Events
  onchange?: OnChange<T>;
  onclose?: OnChange<T>;
  onadd?: NeoTabProps['onclick'];
} & NeoTabsContext &
  Omit<NeoButtonGroup, 'onchange' | 'children' | 'vertical'>;
