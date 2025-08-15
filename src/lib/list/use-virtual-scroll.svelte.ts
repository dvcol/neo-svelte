import type { PartialKeys, VirtualizerOptions } from '@tanstack/virtual-core';

import { elementScroll, observeElementOffset, observeElementRect, Virtualizer } from '@tanstack/virtual-core';
import { onMount, untrack } from 'svelte';

export type PartialOptions<TScrollElement extends Element, TItemElement extends Element> = PartialKeys<
  VirtualizerOptions<TScrollElement, TItemElement>,
  'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

class VirtualizerReactiveWrapper<
  TScrollElement extends Element,
  TItemElement extends Element,
> {
  readonly #instance: Virtualizer<TScrollElement, TItemElement>;
  readonly #setOptions: Virtualizer<TScrollElement, TItemElement>['setOptions'];

  get debug() {
    return this.#instance.options.debug;
  }

  #change = $state(0);

  get change() {
    return this.#change;
  }

  readonly size = $derived.by(() => {
    if (this.#change && !this.#instance) throw new Error('VirtualizerReactiveWrapper not initialized');
    return this.#instance.getTotalSize();
  });

  readonly items = $derived.by(() => {
    if (this.#change && !this.#instance) throw new Error('VirtualizerReactiveWrapper not initialized');
    return this.#instance.getVirtualItems();
  });

  readonly range = $derived.by(() => {
    if (this.#change && !this.#instance) throw new Error('VirtualizerReactiveWrapper not initialized');
    const _range = this.#instance.calculateRange();
    return {
      start: _range?.startIndex ?? 0,
      end: _range?.endIndex ?? 0,
    };
  });

  constructor(
    options: PartialOptions<TScrollElement, TItemElement>,
  ) {
    const init: VirtualizerOptions<TScrollElement, TItemElement> = {
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      ...options,
      onChange: (
        instance: Virtualizer<TScrollElement, TItemElement>,
        sync: boolean,
      ) => {
        options.onChange?.(instance, sync);
        if (!sync) return;
        this.update();
      },
    };

    this.#instance = new Virtualizer<TScrollElement, TItemElement>(init);
    this.#setOptions = this.#instance.setOptions;

    onMount(() => {
      console.info('==> VirtualizerReactiveWrapper mounted', init, this.#instance);
      this.update(true);
      return this.#instance._didMount();
    });
  }

  update(sync = false): this {
    untrack(() => {
      if (sync) this.#instance._willUpdate();
      this.#change += 1;
    });
    return this;
  }

  setOptions(
    options: Partial<VirtualizerOptions<TScrollElement, TItemElement>>,
  ): this {
    this.#instance.setOptions({
      ...this.#instance.options,
      ...options,
      onChange: (
        instance: Virtualizer<TScrollElement, TItemElement>,
        sync: boolean,
      ) => {
        options.onChange?.(instance, sync);
        if (sync) this.update();
      },
    });
    this.update(true);
    return this;
  }

  measureElement(
    element: TItemElement | null | undefined,
  ): this {
    this.#instance.measureElement(element);
    return this;
  }
}

export function useVirtualScroll<
  TScrollElement extends Element,
  TItemElement extends Element,
>(
  options: PartialOptions<TScrollElement, TItemElement>,
): VirtualizerReactiveWrapper<TScrollElement, TItemElement> {
  return new VirtualizerReactiveWrapper<TScrollElement, TItemElement>(options);
}
