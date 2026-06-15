import { move, swap } from '@dnd-kit/helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NeoSortableContext, NeoSortableInvalidItemError } from '~/sortable/neo-sortable-context.svelte.js';

// ---------------------------------------------------------------------------
// Mock @dnd-kit/helpers to give move / swap a predictable, controlled outcome.
// The mock swaps the first two items of an array (passthrough for records).
// ---------------------------------------------------------------------------
vi.mock('@dnd-kit/helpers', () => ({
  move: vi.fn((items: unknown, _event: unknown): unknown => {
    if (!Array.isArray(items) || items.length < 2) return items;
    const copy: unknown[] = [...(items as unknown[])];
    const temp: unknown = copy[0];
    copy[0] = copy[1];
    copy[1] = temp;
    return copy;
  }),
  swap: vi.fn((items: unknown, _event: unknown): unknown => {
    if (!Array.isArray(items) || items.length < 2) return items;
    const copy: unknown[] = [...(items as unknown[])];
    const temp: unknown = copy[0];
    copy[0] = copy[1];
    copy[1] = temp;
    return copy;
  }),
}));

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

interface TestData {
  label: string;
}

interface TestItem {
  id: string;
  data: TestData;
}

const BASE_ITEMS: TestItem[] = [
  { id: 'item-1', data: { label: 'One' } },
  { id: 'item-2', data: { label: 'Two' } },
  { id: 'item-3', data: { label: 'Three' } },
];

/** Build a context wired to a plain reactive items variable + spy handlers. */
function makeContext() {
  let items: TestItem[] = BASE_ITEMS.map(i => ({ ...i }));
  const handlers = {
    onDragStart: vi.fn(),
    onDragOver: vi.fn(),
    onDragEnd: vi.fn(),
  };
  const ctx = new NeoSortableContext<TestData>({
    get items() {
      return items;
    },

    set items(v) {
      items = v;
    },
    get handlers() {
      return handlers;
    },
  });
  return {
    ctx,
    handlers,
    /** Read the items variable (reflects setter-writes by the context). */
    getItems: () => items,
  };
}

/** Minimal fake `Sortable` instance — only `.id` is required by add / remove. */
function fakeInstance(id: string) {
  return { id } as never;
}

// ---------------------------------------------------------------------------
// Instance registry
// ---------------------------------------------------------------------------

describe('neoSortableContext — instance registry', { tags: ['jsdom'] }, () => {
  it('add() registers an instance; has()/get() confirm presence', () => {
    const { ctx } = makeContext();
    const inst = fakeInstance('x');
    ctx.add(inst);
    expect(ctx.has('x')).toBe(true);
    expect(ctx.get('x')).toBe(inst);
  });

  it('add() returns a cleanup function that deregisters the instance', () => {
    const { ctx } = makeContext();
    const inst = fakeInstance('y');
    const cleanup = ctx.add(inst);
    expect(ctx.has('y')).toBe(true);
    cleanup();
    expect(ctx.has('y')).toBe(false);
  });

  it('add() with an undefined id throws NeoSortableInvalidItemError', () => {
    const { ctx } = makeContext();
    expect(() => ctx.add({ id: undefined } as never)).toThrow(NeoSortableInvalidItemError);
  });

  it('add() with an empty-string id throws NeoSortableInvalidItemError', () => {
    const { ctx } = makeContext();
    expect(() => ctx.add({ id: '' } as never)).toThrow(NeoSortableInvalidItemError);
  });

  it('remove() by object deregisters', () => {
    const { ctx } = makeContext();
    const inst = fakeInstance('z');
    ctx.add(inst);
    ctx.remove(inst);
    expect(ctx.has('z')).toBe(false);
  });

  it('remove() by UniqueIdentifier string deregisters', () => {
    const { ctx } = makeContext();
    ctx.add(fakeInstance('q'));
    ctx.remove('q');
    expect(ctx.has('q')).toBe(false);
  });

  it('remove() with an object that has no id throws NeoSortableInvalidItemError', () => {
    const { ctx } = makeContext();
    expect(() => ctx.remove({ id: undefined } as never)).toThrow(NeoSortableInvalidItemError);
  });

  it('has() returns false for an id that was never registered', () => {
    const { ctx } = makeContext();
    expect(ctx.has('nonexistent')).toBe(false);
  });

  it('get() returns undefined for an id that was never registered', () => {
    const { ctx } = makeContext();
    expect(ctx.get('nonexistent')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// ids derivation
// ---------------------------------------------------------------------------

describe('neoSortableContext — ids derivation', { tags: ['jsdom'] }, () => {
  it('array items: ids is an ordered array of item ids', () => {
    const { ctx } = makeContext();
    expect(ctx.ids).toEqual(['item-1', 'item-2', 'item-3']);
  });

  it('record items: ids is a record of id arrays mirroring the items structure', () => {
    let items: Record<string, TestItem[]> = {
      listA: [
        { id: 'a1', data: { label: 'A1' } },
        { id: 'a2', data: { label: 'A2' } },
      ],
      listB: [{ id: 'b1', data: { label: 'B1' } }],
    };
    const ctx = new NeoSortableContext<TestData>({
      get items() {
        return items;
      },

      set items(v) {
        items = v;
      },
      get handlers() {
        return {};
      },
    });
    expect(ctx.ids).toEqual({ listA: ['a1', 'a2'], listB: ['b1'] });
  });
});

// ---------------------------------------------------------------------------
// Drag lifecycle
// ---------------------------------------------------------------------------

describe('neoSortableContext — drag lifecycle', { tags: ['jsdom'] }, () => {
  afterEach(() => vi.clearAllMocks());

  it('isDragging is false initially', () => {
    const { ctx } = makeContext();
    expect(ctx.isDragging).toBe(false);
  });

  it('dragStart sets isDragging to true', () => {
    const { ctx } = makeContext();
    ctx.dragStart({} as never, null as never);
    expect(ctx.isDragging).toBe(true);
  });

  it('dragEnd resets isDragging to false', () => {
    const { ctx } = makeContext();
    ctx.dragStart({} as never, null as never);
    ctx.dragEnd({} as never, null as never);
    expect(ctx.isDragging).toBe(false);
  });

  it('dragEnd with canceled=true restores the pre-drag snapshot', () => {
    const { ctx, getItems } = makeContext();
    const originalIds = getItems().map(i => i.id);

    ctx.dragStart({} as never, null as never);
    // dragOver → mock move swaps first two items
    ctx.dragOver({ type: 'drag-over' } as never, null as never);
    const reorderedIds = getItems().map(i => i.id);
    expect(reorderedIds).not.toEqual(originalIds); // sanity: items did change

    ctx.dragEnd({ canceled: true } as never, null as never);
    expect(getItems().map(i => i.id)).toEqual(originalIds);
  });

  it('dragEnd with canceled=false keeps the reordered items', () => {
    const { ctx, getItems } = makeContext();
    ctx.dragStart({} as never, null as never);
    ctx.dragOver({ type: 'drag-over' } as never, null as never);
    const reorderedIds = getItems().map(i => i.id);

    ctx.dragEnd({ canceled: false } as never, null as never);
    expect(getItems().map(i => i.id)).toEqual(reorderedIds);
  });

  it('dragStart forwards the event and manager to the onDragStart handler', () => {
    const { ctx, handlers } = makeContext();
    const event = { type: 'drag-start' } as never;
    const manager = { id: 'mgr' } as never;
    ctx.dragStart(event, manager);
    expect(handlers.onDragStart).toHaveBeenCalledTimes(1);
    expect(handlers.onDragStart).toHaveBeenCalledWith(event, manager);
  });

  it('dragOver with a null/undefined event is a no-op (does not call move or the handler)', () => {
    const { ctx, handlers } = makeContext();
    ctx.dragOver(null as never, null as never);
    expect(move).not.toHaveBeenCalled();
    expect(handlers.onDragOver).not.toHaveBeenCalled();
  });

  it('dragOver calls @dnd-kit/helpers move and forwards the event to onDragOver', () => {
    const { ctx, handlers } = makeContext();
    const event = { type: 'drag-over' } as never;
    ctx.dragOver(event, null as never);
    expect(move).toHaveBeenCalledTimes(1);
    expect(handlers.onDragOver).toHaveBeenCalledWith(event, null);
  });

  it('dragEnd forwards the event and manager to the onDragEnd handler', () => {
    const { ctx, handlers } = makeContext();
    const event = { canceled: false } as never;
    const manager = { id: 'mgr' } as never;
    ctx.dragEnd(event, manager);
    expect(handlers.onDragEnd).toHaveBeenCalledTimes(1);
    expect(handlers.onDragEnd).toHaveBeenCalledWith(event, manager);
  });

  it('handlers that are undefined are silently skipped (no-handler context)', () => {
    let items: TestItem[] = BASE_ITEMS.map(i => ({ ...i }));
    const ctx = new NeoSortableContext<TestData>({
      get items() {
        return items;
      },

      set items(v) {
        items = v;
      },
      get handlers() {
        return {};
      },
    });
    expect(() => {
      ctx.dragStart({} as never, null as never);
      ctx.dragOver({ type: 'drag-over' } as never, null as never);
      ctx.dragEnd({} as never, null as never);
    }).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// move / swap delegation
// ---------------------------------------------------------------------------

describe('neoSortableContext — move and swap delegation', { tags: ['jsdom'] }, () => {
  beforeEach(() => vi.clearAllMocks());

  it('move() passes current items and the event to @dnd-kit/helpers move then stores the result', () => {
    const { ctx, getItems } = makeContext();
    const originalFirst = getItems()[0].id;
    const event = { source: { index: 0 }, target: { index: 1 } } as never;

    ctx.move(event);

    // The mock swaps first two items — verify the update propagated to the items variable
    expect(getItems()[0].id).not.toBe(originalFirst);
    expect(move).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 'item-1' })]), event);
  });

  it('swap() passes current items and the event to @dnd-kit/helpers swap then stores the result', () => {
    const { ctx, getItems } = makeContext();
    const originalFirst = getItems()[0].id;
    const event = { source: { index: 0 }, target: { index: 1 } } as never;

    ctx.swap(event);

    expect(getItems()[0].id).not.toBe(originalFirst);
    expect(swap).toHaveBeenCalledTimes(1);
    expect(swap).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 'item-1' })]), event);
  });

  it('move() on a record items shape is a passthrough (mock returns record unchanged)', () => {
    let items: Record<string, TestItem[]> = {
      listA: [{ id: 'a1', data: { label: 'A1' } }],
      listB: [{ id: 'b1', data: { label: 'B1' } }],
    };
    const ctx = new NeoSortableContext<TestData>({
      get items() {
        return items;
      },

      set items(v) {
        items = v;
      },
      get handlers() {
        return {};
      },
    });

    const snapshot = { ...items };
    ctx.move({} as never);

    // Mock returns non-array input unchanged — verify nothing was lost
    expect(items).toEqual(snapshot);
    expect(move).toHaveBeenCalledTimes(1);
  });
});
