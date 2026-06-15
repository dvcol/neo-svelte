import type { UniqueIdentifier } from '@dnd-kit/abstract';
import type { DragDropManager, DragDropManagerInput, Draggable, DropAnimation } from '@dnd-kit/dom';
import type { createDraggable, CreateDraggableInput, createDroppable, CreateDroppableInput, DragDropEventHandlers } from '@dnd-kit/svelte';
import type { createSortable, CreateSortableInput } from '@dnd-kit/svelte/sortable';
import type { Snippet } from 'svelte';

import type { NeoSortableContext, NeoSortableContextItems, NeoSortableData } from '~/sortable/neo-sortable-context.svelte.js';

import { getContext, setContext } from 'svelte';

export type DraggableItem<Data extends NeoSortableData = NeoSortableData> = Draggable<Data>;
export interface DragOverlayProps {
  /**
   * Whether the drag overlay is disabled.
   */
  disabled?: boolean;
  /**
   * Customize or disable the drop animation that plays when a drag operation ends.
   *
   * - `undefined` – use the default animation (250ms ease)
   * - `null` – disable the drop animation entirely
   * - `{duration, easing}` – customize the animation timing
   * - `(context) => Promise<void> | void` – provide a fully custom animation function
   */
  dropAnimation?: DropAnimation | null;
  /**
   * Content to render inside the overlay.
   * Receives the drag source as a snippet parameter.
   */
  children?: Snippet<[DraggableItem]>;
}

export interface DragDropProviderProps<Data extends NeoSortableData = NeoSortableData> extends DragDropManagerInput, DragDropEventHandlers<Data> {
  manager?: DragDropManager;
  children?: Snippet;
}

export interface NeoSortableProviderProps<Data extends NeoSortableData = NeoSortableData> extends Omit<DragDropProviderProps<Data>, 'children'> {
  items: NeoSortableContextItems<Data>;
  /**
   * Whether to restrict horizontal/vertical drag
   */
  axis?: 'x' | 'y';
  /**
   * Optional container to restrict the dragging.
   *
   * @default window
   */
  container?: HTMLElement;

  overlayProps?: Omit<DragOverlayProps, 'children'>;

  overlay?: DragOverlayProps['children'];
  children?: Snippet<[NeoSortableContext<Data>]>;
}

const NeoSortableContextSymbol = Symbol('NeoSortableContext');

export function getNeoSortableContext<Data extends NeoSortableData>(): NeoSortableContext<Data> {
  return getContext<NeoSortableContext<Data>>(NeoSortableContextSymbol);
}

export function setNeoSortableContext<Data extends NeoSortableData>(context: NeoSortableContext<Data>): NeoSortableContext<Data> {
  return setContext(NeoSortableContextSymbol, context);
}

export interface NeoSortableItemContext<Data extends NeoSortableData = NeoSortableData> { id: UniqueIdentifier; index: number; data?: Data; instance: ReturnType<typeof createSortable<Data>> }

export interface NeoSortableItemProps<Data extends NeoSortableData = NeoSortableData> extends CreateSortableInput<Data> {
  children?: Snippet<[NeoSortableItemContext<Data>, NeoSortableContext<Data>]>;
}

export type NeoDroppableZoneContext<Data extends NeoSortableData = NeoSortableData> = ReturnType<typeof createDroppable<Data>>;

export interface NeoDroppableZoneProps<Data extends NeoSortableData = NeoSortableData> extends CreateDroppableInput<Data> {
  children?: Snippet<[NeoDroppableZoneContext<Data>]>;
}

export type NeoDraggableContext<Data extends NeoSortableData = NeoSortableData> = ReturnType<typeof createDraggable<Data>>;

export interface NeoDraggableProps<Data extends NeoSortableData = NeoSortableData> extends CreateDraggableInput<Data> {
  children?: Snippet<[NeoDraggableContext<Data>]>;
}
