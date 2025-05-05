import type { NeoProgressHTMLElement, NeoProgressStart } from '~/progress/neo-progress.model.js';

import { getUUID } from '@dvcol/common-utils/common/string';
import { SvelteSet } from 'svelte/reactivity';

import { NeoProgressStatus } from '~/progress/neo-progress.model.js';

/**
 * Queuing service to keep track of concurrent call to progress bar
 */
export class NeoProgressService {
  readonly #ref: NeoProgressHTMLElement;
  #active = new SvelteSet<string>();

  get ref() {
    return this.#ref;
  }

  get value() {
    return this.ref.value;
  }

  get buffer() {
    return this.ref.buffer;
  }

  get status() {
    return this.ref.status;
  }

  get active(): Set<string> {
    return $state.snapshot(this.#active);
  }

  constructor(ref: NeoProgressHTMLElement) {
    this.#ref = ref;
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
    if (this.status === NeoProgressStatus.Active) this.ref.reset(true, opts);
    else this.ref.start(opts);
    return id;
  }

  cancel(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.ref.cancel();
    return id;
  }

  complete(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.ref.complete();
    return id;
  }

  error(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.ref.complete({ state: NeoProgressStatus.Error });
    return id;
  }

  success(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.ref.complete({ state: NeoProgressStatus.Success });
    return id;
  }

  warning(id?: string, force = !id): string | undefined {
    this.sync();
    if (id) this.#active.delete(id);
    if (force || this.#active.size === 0) void this.ref.complete({ state: NeoProgressStatus.Warning });
    return id;
  }
}
