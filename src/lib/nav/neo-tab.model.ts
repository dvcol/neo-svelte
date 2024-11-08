import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

export type TabId = string | number | symbol;
export type NeoTabProps = {
  // Snippets
  children?: Snippet<[{ active: boolean; tabId: TabId; value?: unknown }]>;

  // States
  tabId?: TabId;
  value?: unknown;

  // Styles
  close?: boolean;
} & Omit<NeoButtonProps, 'value' | 'children'>;
