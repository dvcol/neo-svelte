import { getUUID } from '@dvcol/common-utils/common/string';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import type { NeoDialogPlacement } from '~/floating/common/neo-placement.model.js';
import type { NeoPortalContainerProps } from '~/floating/portal/neo-portail-container.model.js';

export class NeoPortalContext {
  readonly #id: string;
  readonly #dialogs = new SvelteMap<string, boolean>();
  #ref = $state<HTMLElement>();
  #open = $derived(Array.from(this.#dialogs.values().filter(Boolean)).length);
  #placement = $state<NeoDialogPlacement>();

  get id() {
    return this.#id;
  }

  get ref() {
    return this.#ref;
  }

  get open() {
    return this.#open;
  }

  get placement() {
    return this.#placement;
  }

  constructor(id: string) {
    this.#id = id;
  }

  updateRef(ref?: HTMLElement) {
    this.#ref = ref;
  }

  openDialog(id: string, placement: NeoDialogPlacement) {
    this.#dialogs.set(id, true);
    this.#placement = placement;
  }

  closeDialog(id: string) {
    const dialog = this.#dialogs.get(id);
    if (!dialog) return;
    this.#dialogs.set(id, false);
  }
}

const NeoPortalContextSymbol = Symbol('NeoPortalContext');

export const getNeoPortalContext = () => {
  return getContext<NeoPortalContext>(NeoPortalContextSymbol);
};

export const setNeoPortalContext = (id: NeoPortalContainerProps['id']) => {
  return setContext<NeoPortalContext>(NeoPortalContextSymbol, new NeoPortalContext(id || `neo-portal-container-${getUUID()}`));
};
