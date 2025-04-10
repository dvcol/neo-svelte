import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

type NeoMenuContextParent = { readonly open: boolean; readonly ref?: HTMLElement; dismiss: () => void | Promise<void> };

export class NeoMenuContext {
  #parent = $state<NeoMenuContextParent>();
  #children = new SvelteMap();

  #hasChildrenOpen = $derived(this.#children.values().some(Boolean));

  get ref(): HTMLElement | undefined {
    return this.#parent?.ref;
  }

  get children(): boolean {
    return this.#hasChildrenOpen;
  }

  get parent(): boolean {
    return this.#parent?.open || this.children;
  }

  constructor(parent: NeoMenuContextParent) {
    this.#parent = parent;
  }

  toggle(index: number, open: boolean): void {
    this.#children.set(index, open);
  }

  dismiss(): void {
    this.#parent?.dismiss();
  }
}

export const NeoMenuContextSymbol = Symbol('NeoMenuContext');

export const setMenuContext = (context: NeoMenuContextParent): NeoMenuContext => setContext(NeoMenuContextSymbol, new NeoMenuContext(context));
export const getMenuContext = (): NeoMenuContext | undefined => getContext<NeoMenuContext>(NeoMenuContextSymbol);
