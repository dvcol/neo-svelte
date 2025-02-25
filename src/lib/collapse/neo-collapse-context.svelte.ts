import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import { NeoErrorMissingCollapseId } from '~/utils/error.utils.js';
import { Logger } from '~/utils/logger.utils.js';

export type NeoCollapseGroupState = {
  readonly id: string;
  readonly min: number;
  readonly max: number;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
};

export type NeoCollapseSection = {
  readonly id: string;
  readonly editable?: boolean;
  open: boolean;
  changed: number;
};

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
      let nb = this.opened - this.max;
      let index = -1;
      while (nb > 0 && this.opened >= Math.abs(index)) {
        const last = this.#opened.at(index);
        // If the last section is editable, close it
        if (last && last.editable) {
          last.open = false;
          nb -= 1;
        }
        // else, move to the next section
        else {
          index -= 1;
        }
      }
    } else if (this.min && this.opened < this.min) {
      let nb = this.min - this.opened;
      let index = -1;
      while (nb > 0 && this.closed >= Math.abs(index)) {
        const first = this.#closed.at(index);
        // If the first section is editable, open it
        if (first && first.editable) {
          first.open = true;
          nb -= 1;
        }
        // else, move to the next section
        else {
          index -= 1;
        }
      }
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

export const getNeoCollapseGroupContext = () => {
  return getContext<NeoCollapseContext>(NeoGroupContextSymbol);
};

export const setCollapseGroupContext = (group: NeoCollapseGroupState) => {
  return setContext<NeoCollapseContext>(NeoGroupContextSymbol, new NeoCollapseContext(group));
};
