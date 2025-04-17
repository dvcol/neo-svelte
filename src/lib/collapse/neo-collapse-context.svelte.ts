import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import { NeoErrorMissingCollapseId } from '~/utils/error.utils.js';
import { Logger } from '~/utils/logger.utils.js';

export const NeoCollapseGroupStrategy = {
  Readonly: 'readonly' as const,
  Oldest: 'oldest' as const,
} as const;

export type NeoCollapseGroupStrategies = (typeof NeoCollapseGroupStrategy)[keyof typeof NeoCollapseGroupStrategy];

export const defaultCollapseGroupStrategy: { min: NeoCollapseGroupStrategies; max: NeoCollapseGroupStrategies } = {
  min: NeoCollapseGroupStrategy.Readonly,
  max: NeoCollapseGroupStrategy.Oldest,
} as const;

export interface NeoCollapseGroupState {
  readonly id: string;
  readonly min: number;
  readonly max: number;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
  readonly strategy?:
    | NeoCollapseGroupStrategies
    | {
      min?: NeoCollapseGroupStrategies;
      max?: NeoCollapseGroupStrategies;
    };
}

export interface NeoCollapseSection {
  readonly id: string;
  readonly editable?: boolean;
  open: boolean;
  changed: number;
}

/**
 * Toggle the oldest changed sections.
 * @param count - The number of sections to close
 * @param fields - The fields in order of newest to oldest
 * @param open - Whether to open or close the sections
 */
function toggleOldestChanged(count: number, fields: NeoCollapseSection[], open = false) {
  let nb = count;
  let index = -1;
  while (nb > 0 && fields.length >= Math.abs(index)) {
    // Last changed section
    const last = fields.at(index);
    // If the last section is editable, close it
    if (last && last.editable) {
      last.open = open;
      nb -= 1;
    } else {
      // else, move to the next section
      index -= 1;
    }
  }
}

export class NeoCollapseContext {
  readonly #group: NeoCollapseGroupState;
  readonly #map: Map<string, NeoCollapseSection> = new SvelteMap();
  readonly #opened = $derived([...this.#map.values()].filter(section => section.open).sort((a, b) => b.changed - a.changed));
  readonly #closed = $derived([...this.#map.values()].filter(section => !section.open).sort((a, b) => b.changed - a.changed));

  get disabled() {
    return this.#group.disabled;
  }

  get readonly() {
    return this.#group.readonly;
  }

  get min() {
    return this.#group.min;
  }

  get max() {
    return this.#group.max;
  }

  get opened() {
    return this.#opened.length;
  }

  get closed() {
    return this.#closed.length;
  }

  get strategy() {
    if (typeof this.#group.strategy === 'object') return this.#group.strategy;
    return {
      min: this.#group.strategy,
      max: this.#group.strategy,
    };
  }

  get canOpen() {
    if (this.strategy.max === NeoCollapseGroupStrategy.Oldest) return true;
    if (this.max) return this.opened < this.max;
    return true;
  }

  get canClose() {
    if (this.strategy.min === NeoCollapseGroupStrategy.Oldest) return true;
    if (this.min) return this.opened > this.min;
    return true;
  }

  constructor(group: NeoCollapseGroupState) {
    this.#group = group;
  }

  register(id: NeoCollapseSection['id'], section: NeoCollapseSection) {
    if (!id) throw new NeoErrorMissingCollapseId();
    if (this.#map.has(id)) {
      return Logger.warn(`Section ID '${String(id)}' already exists. Tab registration ignored.`, {
        existing: this.#map.get(id),
        ignored: section,
        groupId: this.#group.id,
      });
    }
    this.#map.set(id, section);
    this.#enforce();
  }

  remove(sectionId: string) {
    this.#map.delete(sectionId);
  }

  #enforce() {
    if (this.max && this.opened > this.max) {
      toggleOldestChanged(this.opened - this.max, this.#opened);
    } else if (this.min && this.opened < this.min) {
      toggleOldestChanged(this.min - this.opened, this.#closed, true);
    }
  }

  update(sectionId: NeoCollapseSection['id']) {
    const section = this.#map.get(sectionId);
    if (!section) return Logger.warn(`Section ID '${String(sectionId)}' does not exist.`, { sectionId, groupId: this.#group.id });
    section.changed = Date.now();
    this.#enforce();
  }
}

const NeoGroupContextSymbol = Symbol('NeoCollapseGroupContext');

export function getNeoCollapseGroupContext() {
  return getContext<NeoCollapseContext>(NeoGroupContextSymbol);
}

export function setCollapseGroupContext(group: NeoCollapseGroupState) {
  return setContext<NeoCollapseContext>(NeoGroupContextSymbol, new NeoCollapseContext(group));
}
