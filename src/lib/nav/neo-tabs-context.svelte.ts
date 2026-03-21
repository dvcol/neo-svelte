import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabContextValue, OnChange, OnClose } from '~/nav/neo-tabs.model.js';

import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import { NeoErrorMissingTabId } from '~/utils/error.utils.js';
import { Logger } from '~/utils/logger.utils.js';

export interface NeoTabContextPosition<Id extends TabId> {
  id: Id;
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface NeoTabContextPositions<Id extends TabId> {
  oldTab?: NeoTabContextPosition<Id>;
  newTab?: NeoTabContextPosition<Id>;
}

type NeoTabContextOptions = {
  // States
  /**
   * Disables all tabs.
   */
  disabled?: boolean;

  // Styles
  /**
   * Whether to animate the tab transition.
   * @default true
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
} & Pick<NeoButtonGroupProps, 'elevation' | 'pressed' | 'convex' | 'borderless' | 'glass' | 'start' | 'vertical'>;

export type NeoTabsContext<Id extends TabId, Value = unknown> = NeoTabContextOptions & {
  // States
  /**
   * The active tab ID.
   */
  active?: Id;
  /**
   * The active tab value.
   */
  value?: NeoTabContextValue<Value>;
};

interface NeoTabContextCallbacks<Id extends TabId, Value = unknown> {
  onChange?: OnChange<Id, Value>;
  onClose?: OnClose<Id, Value>;
}

export class NeoTabContext<Id extends TabId, Value = unknown> {
  readonly #tabs: Map<Id, NeoTabContextValue<Value>> = new SvelteMap();
  readonly #panes: Map<Id, Id> = new SvelteMap();
  readonly #onChange?: OnChange<Id, Value>;
  readonly #onClose?: OnClose<Id, Value>;
  #active?: Id = $state();
  #previous?: Id = $state();
  #position: NeoTabContextPositions<Id> = $state({});
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

  get position() {
    return this.#position;
  }

  get state(): NeoTabsContext<Id, Value> {
    return {
      ...this.#options,
      active: this.active,
      value: this.value,
    };
  }

  constructor({ onChange, onClose }: NeoTabContextCallbacks<Id, Value> = {}) {
    this.#onChange = onChange;
    this.#onClose = onClose;
  }

  getValue(tabId?: Id) {
    if (!tabId) return;
    return this.#tabs.get(tabId);
  }

  getPane(tabId?: Id) {
    if (!tabId) return;
    return this.#panes.get(tabId);
  }

  onOption(options: NeoTabContextOptions) {
    Object.assign(this.#options, options);
    if (!options.slide) delete this.#position.oldTab;
  }

  #getPosition(tabId?: Id) {
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
    const _new: NeoTabContextPositions<Id> = {
      oldTab: this.#getPosition(this.position?.newTab?.id),
    };
    if (this.active) {
      _new.newTab = this.#getPosition(this.active);
    }
    this.#position = _new;
    return this.position;
  }

  onChange(tabId?: Id, emit = true) {
    if (tabId === this.#active) {
      if (this.#active && this.state?.toggle) this.onChange();
      return;
    }
    const current = this.value;
    this.#previous = this.active;
    this.#active = tabId;
    this.onPosition();
    if (emit) this.#onChange?.(this.active, this.value, current);
  }

  onClose(tabId?: Id) {
    this.#onClose?.(tabId, this.value);
  }

  register(tabId: Id, value: Omit<NeoTabContextValue<Value>, 'index'>, force = false) {
    if (!tabId) throw new NeoErrorMissingTabId();
    if (this.#tabs.has(tabId) && !force) {
      return Logger.warn(`Tab ID '${String(tabId)}' already exists. Tab registration ignored.`, { existing: this.getValue(tabId), ignored: value });
    }
    this.#tabs.set(tabId, { ...value, index: this.#tabs.size });
  }

  /**
   * Removes the tab from the context.
   * @param tabId - The tab ID to remove.
   * @param discard - If true, the active tab will be discarded.
   */
  remove(tabId: Id, discard = true) {
    this.#tabs.delete(tabId);
    if (!discard) return;
    if (this.#active === tabId) this.onChange();
  }

  clear(discard = true) {
    this.#tabs.clear();
    if (!discard) return;
    if (this.#active) this.onChange();
  }

  registerPane(tabId: Id, panelId: Id) {
    if (this.#panes.has(tabId)) {
      return Logger.warn(`Tab ID '${String(tabId)}' already exists. Pane registration ignored.`, {
        existing: this.#panes.get(tabId),
        ignored: panelId,
      });
    }
    this.#panes.set(tabId, panelId);
  }

  removePane(tabId: Id) {
    this.#panes.delete(tabId);
  }
}

const NeoTabsContextSymbol = Symbol('NeoTabsContext');

export function getTabContext<Id extends TabId, Value = unknown>(): NeoTabContext<Id, Value> | undefined {
  return getContext<NeoTabContext<Id, Value>>(NeoTabsContextSymbol);
}

export function setTabContext<Id extends TabId, Value = unknown>(callback?: NeoTabContextCallbacks<Id, Value>) {
  return setContext(NeoTabsContextSymbol, new NeoTabContext<Id, Value>(callback));
}
