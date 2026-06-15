import type { Data, UniqueIdentifier } from '@dnd-kit/abstract';
import type { Sortable } from '@dnd-kit/dom/sortable';
import type { DragDropEventHandlers } from '@dnd-kit/svelte';

import { move, swap } from '@dnd-kit/helpers';
import { SvelteMap } from 'svelte/reactivity';

export type NeoSortableData = Data;

export interface NeoSortableItem<Value extends NeoSortableData = NeoSortableData> {
  /**
   * The unique identifier for the sortable item.
   */
  id: UniqueIdentifier;
  /**
   * The value payload of the item
   */
  data: Value;
}

type NeoSortableInstance<Data extends NeoSortableData = NeoSortableData> = Sortable<Data>;

export class NeoSortableInvalidItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NeoSortableInvalidItemError';
  }
}

export type NeoSortableContextItems<Data extends NeoSortableData> = NeoSortableItem<Data>[] | Record<UniqueIdentifier, NeoSortableItem<Data>[]>;
type NeoSortableContextIds = UniqueIdentifier[] | Record<UniqueIdentifier, UniqueIdentifier[]>;

export interface NeoSortableContextOptions<Data extends NeoSortableData = NeoSortableData> {
  handlers: DragDropEventHandlers<Data>;
  items: NeoSortableContextItems<Data>;
}

function cloneItems<Data extends NeoSortableData>(items?: NeoSortableContextItems<Data>) {
  if (!items) return items;
  if (Array.isArray(items)) return items.slice();
  return Object.fromEntries(Object.entries(items).map(([key, value]) => [key, value.slice()]));
}

export class NeoSortableContext<Data extends NeoSortableData = NeoSortableData> {
  readonly #instances = new SvelteMap<UniqueIdentifier, NeoSortableInstance<Data>>();
  readonly #options: NeoSortableContextOptions<Data>;

  #dragging = $state(false);

  #snapshot = $state<NeoSortableContextItems<Data>>();
  #ids = $derived.by<NeoSortableContextIds>(() => {
    if (Array.isArray(this.items)) return this.items.map(i => i.id);
    return Object.fromEntries(Object.entries(this.items).map(([key, value]) => [key, value.map(i => i.id)]));
  });

  get #handlers(): DragDropEventHandlers<Data> {
    return this.#options.handlers;
  }

  get items(): NeoSortableContextItems<Data> {
    return this.#options.items;
  }

  get ids(): NeoSortableContextIds {
    return this.#ids;
  }

  get isDragging(): boolean {
    return this.#dragging;
  }

  constructor(options: NeoSortableContextOptions<Data>) {
    this.#options = options;
  }

  get(id: UniqueIdentifier) {
    return this.#instances.get(id);
  }

  has(item: UniqueIdentifier) {
    return this.#instances.has(item);
  }

  add(item: NeoSortableInstance<Data>) {
    if (!item.id) throw new NeoSortableInvalidItemError('Sortable item must have a unique identifier');
    this.#instances.set(item.id, item);

    return () => this.remove(item.id);
  }

  remove(item: NeoSortableInstance<Data> | UniqueIdentifier) {
    if (typeof item === 'object' && !item?.id) throw new NeoSortableInvalidItemError('Sortable item must have a unique identifier');
    this.#instances.delete(typeof item === 'object' ? item.id : item);
  }

  move(event: Parameters<typeof move>[1]) {
    this.#options.items = move(this.#options.items, event);
  }

  swap(event: Parameters<typeof swap>[1]) {
    this.#options.items = swap(this.#options.items, event);
  }

  dragStart: NonNullable<DragDropEventHandlers<Data>['onDragStart']> = (event, manager) => {
    this.#dragging = true;
    this.#snapshot = cloneItems(this.#options.items);
    this.#handlers.onDragStart?.(event, manager);
  };

  dragOver: NonNullable<DragDropEventHandlers<Data>['onDragOver']> = (event, manager) => {
    if (!event) return;
    this.move(event);
    this.#handlers.onDragOver?.(event, manager);
  };

  dragEnd: NonNullable<DragDropEventHandlers<Data>['onDragEnd']> = (event, manager) => {
    if (event?.canceled && this.#snapshot) this.#options.items = this.#snapshot;

    this.#dragging = false;
    this.#snapshot = [];
    this.#handlers.onDragEnd?.(event, manager);
  };
}
