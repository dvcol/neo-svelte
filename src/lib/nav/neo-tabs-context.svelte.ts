import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabContextValue, OnChange, OnClose } from '~/nav/neo-tabs.model.js';

import { Logger } from '~/utils/logger.utils.js';

export type NeoTabContextPosition = { id: TabId; top: number; left: number; width: number; height: number };
export type NeoTabContextPositions = { oldTab?: NeoTabContextPosition; newTab?: NeoTabContextPosition };

type NeoTabContextOptions = {
  // States
  /**
   * Disables all tabs.
   */
  disabled?: boolean;

  // Styles
  /**
   * Whether to animate the tab transition.
   */
  slide?: boolean;
  /**
   * Clicking the active tab will unselect it.
   */
  toggle?: boolean;
  /**
   * Add a button to add new tabs.
   */
  add?: boolean;
  /**
   * Add a close button to each tab.
   */
  close?: boolean;
} & Pick<NeoButtonGroupProps, 'vertical' | 'shallow' | 'inset' | 'glass' | 'flat' | 'text'>;

export type NeoTabsContext<T = unknown> = NeoTabContextOptions & {
  // States
  /**
   * The active tab ID.
   */
  active?: TabId;
  /**
   * The active tab value.
   */
  value?: NeoTabContextValue<T>;
};

type NeoTabContextCallbacks<T = unknown> = { onChange?: OnChange<T>; onClose?: OnClose<T> };

export class NeoTabContext<T = unknown> {
  readonly #tabs: Map<TabId, NeoTabContextValue<T>> = new SvelteMap();
  readonly #panes: Map<TabId, TabId> = new SvelteMap();
  readonly #onChange?: OnChange<T>;
  readonly #onClose?: OnClose<T>;
  #active?: TabId = $state();
  #previous?: TabId = $state();
  #position: NeoTabContextPositions = $state({});
  #options: NeoTabContextOptions = $state({});

  get active() {
    return this.#active;
  }

  get value() {
    return this.getValue(this.active);
  }

  get previous() {
    return this.getValue(this.#previous);
  }

  get disabled() {
    return this.#options?.disabled;
  }

  get slide() {
    return this.#options?.slide;
  }

  get toggle() {
    return this.#options?.toggle;
  }

  get close() {
    return this.#options?.close;
  }

  get shallow() {
    return this.#options?.shallow;
  }

  get inset() {
    return this.#options?.inset;
  }

  get glass() {
    return this.#options?.glass;
  }

  get vertical() {
    return this.#options?.vertical;
  }

  get position() {
    return this.#position;
  }

  get text() {
    return this.#options?.text;
  }

  get flat() {
    return this.text || this.#options?.flat;
  }

  get state(): NeoTabsContext {
    return {
      ...this.#options,
      active: this.active,
      value: this.value,
      slide: this.slide,
      close: this.close,
      toggle: this.toggle,
      inset: this.inset,
      glass: this.glass,
      shallow: this.shallow,
      vertical: this.vertical,
      disabled: this.disabled,
      flat: this.flat,
      text: this.text,
    };
  }

  constructor({ onChange, onClose }: NeoTabContextCallbacks<T> = {}) {
    this.#onChange = onChange;
    this.#onClose = onClose;
  }

  getValue(tabId?: TabId) {
    if (!tabId) return;
    return this.#tabs.get(tabId);
  }

  getPane(tabId?: TabId) {
    if (!tabId) return;
    return this.#panes.get(tabId);
  }

  onOption(options: NeoTabContextOptions) {
    Object.assign(this.#options, options);
    if (!options.slide) delete this.#position.oldTab;
  }

  #getPosition(tabId?: TabId) {
    if (!tabId) return;
    const _ref = this.getValue(tabId)?.ref;
    const parent = _ref?.parentElement?.getBoundingClientRect();
    const rect = _ref?.getBoundingClientRect();
    if (!parent || !rect) return;
    return {
      id: tabId,
      top: rect.top - parent.top,
      left: rect.left - parent.left,
      width: rect.width,
      height: rect.height,
    };
  }

  onPosition(_ref = this.value?.ref) {
    const _new: NeoTabContextPositions = {
      oldTab: this.#getPosition(this.position?.newTab?.id),
    };
    if (this.active) {
      _new.newTab = this.#getPosition(this.active);
    }
    this.#position = _new;
    return this.position;
  }

  onChange(tabId?: TabId, emit = true) {
    if (tabId === this.#active) {
      if (this.#active && this.toggle) this.onChange();
      return;
    }
    const current = this.value;
    this.#previous = this.active;
    this.#active = tabId;
    this.onPosition();
    if (emit) this.#onChange?.(this.active, this.value, current);
  }

  onClose(tabId?: TabId) {
    this.#onClose?.(tabId, this.value);
  }

  register(tabId: TabId, value: Omit<NeoTabContextValue<T>, 'index'>) {
    if (this.#tabs.has(tabId)) {
      return Logger.warn(`Tab ID '${String(tabId)}' already exists. Tab registration ignored.`, { existing: this.getValue(tabId), ignored: value });
    }
    this.#tabs.set(tabId, { ...value, index: this.#tabs.size });
  }

  remove(tabId: TabId) {
    this.#tabs.delete(tabId);
    if (this.#active === tabId) this.onChange();
  }

  registerPane(tabId: TabId, panelId: TabId) {
    if (this.#panes.has(tabId)) {
      return Logger.warn(`Tab ID '${String(tabId)}' already exists. Pane registration ignored.`, {
        existing: this.#panes.get(tabId),
        ignored: panelId,
      });
    }
    this.#panes.set(tabId, panelId);
  }

  removePane(tabId: TabId) {
    this.#panes.delete(tabId);
  }
}

const NeoTabsContextSymbol = Symbol('NeoTabsContext');

export const getTabContext = <T = unknown>(): NeoTabContext<T> | undefined => {
  return getContext<NeoTabContext<T>>(NeoTabsContextSymbol);
};

export const setTabContext = <T = unknown>(callback?: NeoTabContextCallbacks<T>) => {
  return setContext(NeoTabsContextSymbol, new NeoTabContext<T>(callback));
};
