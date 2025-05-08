import type { NeoProgressContext, NeoProgressStart } from '~/progress/neo-progress.model.js';

import { getUUID } from '@dvcol/common-utils/common/string';
import { getContext, setContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

import { NeoProgressStatus } from '~/progress/neo-progress.model.js';
import { NeoErrorProgressContextNotFound } from '~/utils/error.utils.js';

/**
 * Queuing service to keep track of concurrent call to progress bar
 */
export class NeoProgressService {
  readonly #context: NeoProgressContext;
  #active = new SvelteSet<string>();

  get context(): NeoProgressContext {
    return this.#context;
  }

  get value() {
    return this.context.value;
  }

  get buffer() {
    return this.context.buffer;
  }

  get status() {
    return this.context.status;
  }

  get active(): Set<string> {
    return this.#active;
  }

  constructor(context: NeoProgressContext) {
    this.#context = context;
  }

  sync() {
    if (this.status === NeoProgressStatus.Active) return;
    if (this.status === NeoProgressStatus.Indeterminate) return;
    this.#active.clear();
    return this.active;
  }

  start(opts?: NeoProgressStart, id: string = getUUID()): string | undefined {
    this.sync();
    this.#active.add(id);
    if (this.status === NeoProgressStatus.Active) this.context.reset(true, opts);
    else this.context.start(opts);
    return id;
  }

  cancel(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.context.cancel();
    return id;
  }

  complete(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.context.complete();
    return id;
  }

  error(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.context.complete({ state: NeoProgressStatus.Error });
    return id;
  }

  success(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.context.complete({ state: NeoProgressStatus.Success });
    return id;
  }

  warning(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.context.complete({ state: NeoProgressStatus.Warning });
    return id;
  }
}

const NeoProgressContextSymbol = Symbol('NeoProgressContext');

export function getProgressContext(): NeoProgressContext {
  return getContext<NeoProgressContext>(NeoProgressContextSymbol);
}

export function setProgressContext(context: NeoProgressContext): NeoProgressContext | undefined {
  return setContext(NeoProgressContextSymbol, context);
}

export function useNeoProgressService(): NeoProgressService {
  const context = getProgressContext();
  if (!context) throw new NeoErrorProgressContextNotFound();
  return new NeoProgressService(context);
}
