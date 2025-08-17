import type { NeoProgressContext, NeoProgressStart } from '~/progress/neo-progress.model.js';

import { getUUID } from '@dvcol/common-utils/common/string';
import { getContext, setContext } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

import { NeoProgressStatus } from '~/progress/neo-progress.model.js';
import { NeoErrorProgressContextNotFound } from '~/utils/error.utils.js';

export interface NeoProgressServiceOptions {
  /**
   * Delay in milliseconds before the progress bar starts.
   * This is useful to debounce multiple calls to the progress bar.
   */
  delay?: number;
  /**
   * Function to generate a unique ID for the progress bar.
   * If not provided, a UUID will be generated.
   */
  uuid?: () => string;
}

/**
 * Queuing service to keep track of concurrent call to progress bar
 */
export class NeoProgressService {
  /** State of the progress bar */
  readonly #context: NeoProgressContext;
  /** Set of active progress IDs */
  #active = new SvelteSet<string>();
  /** Queue of progress IDs with their timeout */
  #queue = new SvelteMap<string, ReturnType<typeof setTimeout>>();
  /** Options for the progress service */
  #options: NeoProgressServiceOptions;

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

  constructor(context: NeoProgressContext, options: NeoProgressServiceOptions = {}) {
    this.#context = context;
    this.#options = options;
  }

  /**
   * Synchronizes the progress state working with the current active IDs set.
   */
  sync() {
    if (this.status === NeoProgressStatus.Active) return;
    if (this.status === NeoProgressStatus.Indeterminate) return;
    this.#active.clear();
    return this.active;
  }

  /**
   * Starts the progress bar with the given ID and options.
   * If the progress bar is already active, it resets it with the provided options instead.
   */
  #start(id: string, opts?: NeoProgressStart) {
    if (this.status === NeoProgressStatus.Active) return this.context.reset(true, opts);
    return this.context.start(opts);
  }

  /**
   * Dequeues the progress bar with the given ID if it exists in the queue.
   * @param id
   * @private
   */
  #deque(id: string) {
    const timeout = this.#queue.get(id);
    if (timeout === undefined) return;
    clearTimeout(timeout);
    this.#queue.delete(id);
  }

  /**
   * Deletes the progress bar with the given ID from the active set and dequeues it if it exists.
   */
  #delete(id: string) {
    this.#active.delete(id);
    this.#deque(id);
  }

  /**
   * Generates a unique ID for the progress bar.
   */
  #generateId() {
    return this.#options.uuid?.() ?? getUUID();
  }

  /**
   * Starts a new progress bar with the given options.
   * If an ID is provided, it will be used to track the progress bar.
   * If no ID is provided, a new UUID will be generated.
   * If a delay is provided, the progress bar will start after the specified delay.
   */
  start(opts?: NeoProgressStart, { id = this.#generateId(), delay = this.#options.delay }: { id?: string; delay?: number } = {}): string | undefined {
    this.sync();
    this.#delete(id); // debounce queue if delay, skip queue if not
    if (!delay) {
      this.#active.add(id);
      this.#start(id, opts);
    } else {
      this.#queue.set(id, setTimeout(() => {
        this.#active.add(id);
        this.#start(id, opts);
        this.#queue.delete(id);
      }, delay));
    }
    return id;
  }

  cancel(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#delete(id);
    if (force || this.#active.size === 0) void this.context.cancel();
    return id;
  }

  complete(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#delete(id);
    if (force || this.#active.size === 0) void this.context.complete();
    return id;
  }

  error(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#delete(id);
    if (force || this.#active.size === 0) void this.context.complete({ state: NeoProgressStatus.Error });
    return id;
  }

  success(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#delete(id);
    if (force || this.#active.size === 0) void this.context.complete({ state: NeoProgressStatus.Success });
    return id;
  }

  warning(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#delete(id);
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
