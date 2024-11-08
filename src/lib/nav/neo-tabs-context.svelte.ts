import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import type { TabId } from '~/nav/neo-tab.model.js';
import type { OnChange } from '~/nav/neo-tabs.model.js';

type NeoTabContextOptions = {
  slide?: boolean;
  closeable?: boolean;
  disabled?: boolean;
  vertical?: boolean;
};

type NeoTabContextCallbacks<T> = { onChange?: OnChange<T>; onClose?: OnChange<T> };

export class NeoTabContext<T = unknown> {
  readonly #tabs: Map<TabId, T> = new SvelteMap<TabId, T>();
  readonly #onChange?: OnChange<T>;
  readonly #onClose?: OnChange<T>;
  #active?: TabId = $state();
  #options: NeoTabContextOptions = $state({});

  get active() {
    return this.#active;
  }

  get value() {
    return this.#getValue(this.active);
  }

  get disabled() {
    return this.#options?.disabled;
  }

  get slide() {
    return this.#options?.slide;
  }

  get closeable() {
    return this.#options?.closeable;
  }

  get vertical() {
    return this.#options?.vertical;
  }

  get state() {
    return {
      active: this.active,
      disabled: this.disabled,
      slide: this.slide,
      closeable: this.closeable,
      vertical: this.vertical,
    };
  }

  constructor(active?: TabId, { onChange, onClose }: NeoTabContextCallbacks<T> = {}) {
    this.#active = active;
    this.#onChange = onChange;
    this.#onClose = onClose;
  }

  #getValue(tabId?: TabId) {
    if (!tabId) return;
    return this.#tabs.get(tabId);
  }

  onOption(options: NeoTabContextOptions) {
    Object.assign(this.#options, options);
  }

  onChange(tabId?: TabId, emit = true) {
    this.#active = tabId;
    if (emit) this.#onChange?.(this.active, this.value);
  }

  onClose(tabId?: TabId, value?: T) {
    this.#onClose?.(tabId, value ?? this.#getValue(tabId));
  }

  register(tabId: TabId, value: T) {
    this.#tabs.set(tabId, value);
  }

  remove(tabId: TabId) {
    this.#tabs.delete(tabId);
    if (this.#active === tabId) this.onChange();
  }
}

const TabContextSymbol = Symbol('NeoTabContext');

export const getTabContext = <T = unknown>(): NeoTabContext<T> => {
  return getContext<NeoTabContext<T>>(TabContextSymbol);
};

export const setTabContext = <T = unknown>(active?: TabId, callback?: NeoTabContextCallbacks<T>) => {
  return setContext(TabContextSymbol, new NeoTabContext<T>(active, callback));
};
