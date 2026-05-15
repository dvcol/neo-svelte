import { describe, expect, it } from 'vitest';

import { NeoPortalContext } from '~/floating/portal/neo-portal-context.svelte.js';

describe('neoPortalContext', { tags: ['jsdom'] }, () => {
  it('exposes the id passed to the constructor', () => {
    const ctx = new NeoPortalContext('ctx-1');
    expect(ctx.id).toBe('ctx-1');
  });

  it('starts with open=0 and undefined placement/ref', () => {
    const ctx = new NeoPortalContext('ctx-2');
    expect(ctx.open).toBe(0);
    expect(ctx.placement).toBeUndefined();
    expect(ctx.ref).toBeUndefined();
  });

  it('updateRef sets and clears the ref', () => {
    const ctx = new NeoPortalContext('ctx-3');
    const el = document.createElement('div');
    ctx.updateRef(el);
    expect(ctx.ref).toBe(el);
    ctx.updateRef(undefined);
    expect(ctx.ref).toBeUndefined();
  });

  it('openDialog increments the derived open count', () => {
    const ctx = new NeoPortalContext('ctx-4');
    ctx.openDialog('a', 'top');
    expect(ctx.open).toBe(1);
    ctx.openDialog('b', 'bottom');
    expect(ctx.open).toBe(2);
  });

  it('placement is updated to the most recently opened dialog placement', () => {
    const ctx = new NeoPortalContext('ctx-5');
    ctx.openDialog('a', 'top');
    expect(ctx.placement).toBe('top');
    ctx.openDialog('b', 'right-start');
    expect(ctx.placement).toBe('right-start');
    ctx.openDialog('c', 'center');
    expect(ctx.placement).toBe('center');
  });

  it('closeDialog decrements the open count', () => {
    const ctx = new NeoPortalContext('ctx-6');
    ctx.openDialog('a', 'top');
    ctx.openDialog('b', 'bottom');
    expect(ctx.open).toBe(2);
    ctx.closeDialog('a');
    expect(ctx.open).toBe(1);
    ctx.closeDialog('b');
    expect(ctx.open).toBe(0);
  });

  it('closeDialog on an unknown id is a no-op', () => {
    const ctx = new NeoPortalContext('ctx-7');
    ctx.openDialog('a', 'top');
    expect(ctx.open).toBe(1);
    ctx.closeDialog('does-not-exist');
    expect(ctx.open).toBe(1);
  });

  it('closing an already-closed dialog is a no-op (does not go below 0)', () => {
    const ctx = new NeoPortalContext('ctx-8');
    ctx.openDialog('a', 'top');
    ctx.closeDialog('a');
    expect(ctx.open).toBe(0);
    ctx.closeDialog('a');
    expect(ctx.open).toBe(0);
  });

  it('reopening a previously-closed dialog brings it back into the count', () => {
    const ctx = new NeoPortalContext('ctx-9');
    ctx.openDialog('a', 'top');
    ctx.closeDialog('a');
    expect(ctx.open).toBe(0);
    ctx.openDialog('a', 'bottom');
    expect(ctx.open).toBe(1);
    expect(ctx.placement).toBe('bottom');
  });

  it('openDialog called twice with the same id keeps a single entry but updates placement', () => {
    const ctx = new NeoPortalContext('ctx-10');
    ctx.openDialog('a', 'top');
    ctx.openDialog('a', 'bottom');
    expect(ctx.open).toBe(1);
    expect(ctx.placement).toBe('bottom');
  });
});
