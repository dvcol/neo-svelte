import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import AnimationHarness from './TestListAnimation.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const ROW = 32;

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i + 1, value: i + 1, label: `Item ${i + 1}` }));
}

function counting() {
  let calls = 0;
  const use = () => {
    calls += 1;
    return { duration: 0 };
  };
  return { wrapper: { use }, get calls() {
    return calls;
  } };
}

async function settle() {
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
}

function getScroller(): HTMLElement {
  return (document.querySelector<HTMLElement>('.neo-virtual-list')
    ?? document.querySelector<HTMLElement>('.neo-list-items'))!;
}

/*
 * Browser tests for NeoList row transitions.
 *
 * Virtual mode gates transitions per-key against two snapshots of
 * `flatItems` keys (NeoList.svelte). Non-virtual mode does not gate —
 * every #each block (un)mount triggers in/out — but the test pins the
 * shape of "first paint" behavior in the gold path.
 *
 * Counting `{ use }` wrappers replace the default scale/fade transitions
 * so we can observe gate decisions directly: each `use` call equals one
 * "real" intro/outro the gate let through.
 */
describe('neoList virtual — row transitions (browser)', { tags: ['browser'] }, () => {
  it('no intro/outro on first paint', async () => {
    const inSpy = counting();
    const outSpy = counting();
    render(AnimationHarness, {
      props: {
        items: makeItems(200),
        virtual: true,
        itemHeight: ROW,
        inAction: inSpy.wrapper,
        outAction: outSpy.wrapper,
      } as never,
    });
    await settle();
    await new Promise(r => setTimeout(r, 50));
    expect(inSpy.calls).toBe(0);
    expect(outSpy.calls).toBe(0);
  });

  it('no intro/outro while scrolling brings new rows into the cursor window', async () => {
    const inSpy = counting();
    const outSpy = counting();
    render(AnimationHarness, {
      props: {
        items: makeItems(500),
        virtual: true,
        itemHeight: ROW,
        inAction: inSpy.wrapper,
        outAction: outSpy.wrapper,
      } as never,
    });
    await settle();
    const list = getScroller();
    /*
     * Drive a scroll burst: cursor advances and new rows mount / old
     * rows unmount. Neither edge should play a transition because both
     * keys remain present in `flatItems`.
     */
    for (let y = 0; y <= ROW * 200; y += ROW * 10) {
      list.scrollTop = y;
      await settle();
    }
    await new Promise(r => setTimeout(r, 50));
    expect(inSpy.calls).toBe(0);
    expect(outSpy.calls).toBe(0);
  });

  it('intro plays exactly once when an item is added at the top', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const { rerender } = render(AnimationHarness, {
      props: {
        items: makeItems(200),
        virtual: true,
        itemHeight: ROW,
        inAction: inSpy.wrapper,
        outAction: outSpy.wrapper,
      } as never,
    });
    await settle();
    expect(inSpy.calls).toBe(0);
    const next = [{ id: 9999, value: 9999, label: 'new' }, ...makeItems(200)];
    await rerender({
      items: next,
      virtual: true,
      itemHeight: ROW,
      inAction: inSpy.wrapper,
      outAction: outSpy.wrapper,
    } as never);
    await settle();
    await new Promise(r => setTimeout(r, 50));
    expect(inSpy.calls).toBe(1);
    expect(outSpy.calls).toBe(0);
  });

  it('outro plays for a removed visible row (no intros for the cursor shift)', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const { rerender } = render(AnimationHarness, {
      props: {
        items: makeItems(200),
        virtual: true,
        itemHeight: ROW,
        inAction: inSpy.wrapper,
        outAction: outSpy.wrapper,
      } as never,
    });
    await settle();
    const initial = makeItems(200);
    const next = initial.slice(1);
    await rerender({
      items: next,
      virtual: true,
      itemHeight: ROW,
      inAction: inSpy.wrapper,
      outAction: outSpy.wrapper,
    } as never);
    await settle();
    await new Promise(r => setTimeout(r, 50));
    expect(outSpy.calls).toBeGreaterThanOrEqual(1);
    expect(inSpy.calls).toBe(0);
  });
});

describe('neoList non-virtual — row transitions (browser)', { tags: ['browser'] }, () => {
  /*
   * Non-virtual rows have no per-key gate — every #each mount/unmount
   * runs the user's transitions. NB: NeoList.svelte:595-596 wires the
   * `in` / `out` props onto reversed directives (`out:inFn` / `in:outFn`),
   * so the unit "intro vs. outro" is muddled. These tests therefore
   * assert on the *combined* call count, which maps cleanly to "this
   * many row mount/unmount events fired transitions".
   */

  it('no transitions on first paint (Svelte intros are skipped on root mount)', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const items = makeItems(5);
    render(AnimationHarness, {
      props: {
        items,
        virtual: false,
        inAction: inSpy.wrapper,
        outAction: outSpy.wrapper,
      } as never,
    });
    await settle();
    await new Promise(r => setTimeout(r, 50));
    expect(inSpy.calls).toBe(0);
    expect(outSpy.calls).toBe(0);
  });

  it('rows fire additional transitions when items are added or removed', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const initial = makeItems(5);
    const { rerender } = render(AnimationHarness, {
      props: {
        items: initial,
        virtual: false,
        inAction: inSpy.wrapper,
        outAction: outSpy.wrapper,
      } as never,
    });
    await settle();
    const callsAfterPaint = inSpy.calls + outSpy.calls;
    const added = [...initial, { id: 9999, value: 9999, label: 'new' }];
    await rerender({
      items: added,
      virtual: false,
      inAction: inSpy.wrapper,
      outAction: outSpy.wrapper,
    } as never);
    await settle();
    const callsAfterAdd = inSpy.calls + outSpy.calls;
    expect(callsAfterAdd).toBeGreaterThan(callsAfterPaint);
    const removed = added.slice(1);
    await rerender({
      items: removed,
      virtual: false,
      inAction: inSpy.wrapper,
      outAction: outSpy.wrapper,
    } as never);
    await settle();
    await new Promise(r => setTimeout(r, 50));
    expect(inSpy.calls + outSpy.calls).toBeGreaterThan(callsAfterAdd);
  });
});
