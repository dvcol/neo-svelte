import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import type { TabId } from '~/nav/neo-tab.model.js';
import type { OnChange } from '~/nav/neo-tabs.model.js';

export type NeoTabContextPosition = { id: TabId; top: number; left: number; width: number; height: number };
export type NeoTabContextPositions = { oldTab?: NeoTabContextPosition; newTab?: NeoTabContextPosition };

type NeoTabContextOptions = {
  line?: boolean;
  slide?: boolean;
  closeable?: boolean;
  disabled?: boolean;
  vertical?: boolean;
};

type NeoTabContextCallbacks<T = unknown> = { onChange?: OnChange<T>; onClose?: OnChange<T> };
type NeoTabContextValue<T = unknown> = { value?: T; ref: HTMLDivElement };

export class NeoTabContext<T = unknown> {
  readonly #tabs: Map<TabId, NeoTabContextValue<T>> = new SvelteMap();
  readonly #onChange?: OnChange<T>;
  readonly #onClose?: OnChange<T>;
  #active?: TabId = $state();
  #position: NeoTabContextPositions = $state({});
  #options: NeoTabContextOptions = $state({});

  get active() {
    return this.#active;
  }

  get value() {
    return this.#getValue(this.active)?.value;
  }

  get ref() {
    return this.#getValue(this.active)?.ref;
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

  get position() {
    return this.#position;
  }

  constructor({ onChange, onClose }: NeoTabContextCallbacks<T> = {}) {
    this.#onChange = onChange;
    this.#onClose = onClose;
  }

  #getValue(tabId?: TabId) {
    if (!tabId) return;
    return this.#tabs.get(tabId);
  }

  onOption(options: NeoTabContextOptions) {
    Object.assign(this.#options, options);
    if (!options.slide) delete this.#position.oldTab;
  }

  #getPosition(tabId?: TabId) {
    if (!tabId) return;
    const _ref = this.#getValue(tabId)?.ref;
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

  onPosition(_ref = this.ref) {
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
    if (tabId === this.#active) return;
    this.#active = tabId;
    this.onPosition();
    if (emit) this.#onChange?.(this.active, this.value, this.ref);
  }

  onClose(tabId?: TabId, value?: T, ref?: HTMLDivElement) {
    const active = this.#getValue(tabId);
    this.#onClose?.(tabId, value ?? active?.value, ref ?? active?.ref);
  }

  register(tabId: TabId, ref: HTMLDivElement, value?: T) {
    this.#tabs.set(tabId, { value, ref });
  }

  remove(tabId: TabId) {
    this.#tabs.delete(tabId);
    if (this.#active === tabId) this.onChange();
  }
}

const TabContextSymbol = Symbol('NeoTabContext');

export const getTabContext = <T = unknown>(): NeoTabContext<T> | undefined => {
  return getContext<NeoTabContext<T>>(TabContextSymbol);
};

export const setTabContext = <T = unknown>(callback?: NeoTabContextCallbacks<T>) => {
  return setContext(TabContextSymbol, new NeoTabContext<T>(callback));
};
