import type { NeoInputState } from '~/inputs/common/neo-input.model.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoPin.test.svelte';

interface PinInstance {
  clear: () => Promise<void>;
  validate: () => NeoInputState<HTMLInputElement>;
}

afterEach(() => {
  cleanup();
});

function getCells(scope: ParentNode = document): HTMLInputElement[] {
  return Array.from(scope.querySelectorAll<HTMLInputElement>('input.neo-input-pin'));
}

function getGroups(scope: ParentNode = document): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>('.neo-pin-group'));
}

function getHidden(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-pin-hidden');
}

function captureInstance(props: Record<string, unknown> = {}): { instance: PinInstance; container: HTMLElement } {
  let instance: PinInstance | undefined;
  const { container } = render(Harness, {
    props: {
      ...props,
      onInstance: (i: unknown) => {
        instance = i as never;
      },
    } as never,
  });
  return { instance: instance as PinInstance, container };
}

describe('neoPin — render', { tags: ['jsdom'] }, () => {
  it('renders a single group with the default 4 cells', async () => {
    const { container } = render(Harness, {});
    await tick();
    expect(getGroups(container)).toHaveLength(1);
    expect(getCells(container)).toHaveLength(4);
  });

  it('count prop changes the number of cells per group', async () => {
    const { container } = render(Harness, { props: { count: 6 } as never });
    await tick();
    expect(getCells(container)).toHaveLength(6);
  });

  it('groups prop renders multiple groups separated by .neo-pin-separator', async () => {
    const { container } = render(Harness, { props: { groups: 2, count: 3 } as never });
    await tick();
    expect(getGroups(container)).toHaveLength(2);
    expect(getCells(container)).toHaveLength(6);
    expect(container.querySelectorAll('.neo-pin-separator')).toHaveLength(1);
  });

  it('vertical=true is auto-set when groups > 1 (.neo-vertical)', async () => {
    const { container } = render(Harness, { props: { groups: 2, count: 2 } as never });
    await tick();
    expect(container.querySelector('.neo-pin-group-wrapper.neo-vertical')).not.toBeNull();
  });

  // TODO: dynamic resize of `groups`/`count` is an explicit non-goal — the
  // matrices snapshot at mount because they hold writable per-cell bindings
  // (bind:value, bind:this). Skipped: the assertion describes the desired
  // future contract once a resize-preserving implementation exists. Until
  // then, prop changes are silently ignored at the matrix level. See plan
  // file `build-svelte-check-sparkling-teacup.md`.
  it.skip('changing groups after mount resizes the rendered grid', async () => {
    const { container, rerender } = render(Harness, { props: { groups: 1, count: 4 } as never });
    await tick();
    expect(getCells(container)).toHaveLength(4);
    await rerender({ groups: 2, count: 4 } as never);
    await tick();
    expect(getCells(container)).toHaveLength(8);
  });

  it('renders a hidden combined input that mirrors the value', async () => {
    const { container } = render(Harness, { props: { value: '12' } as never });
    await tick();
    const hidden = container.querySelector<HTMLInputElement>('input.neo-pin-hidden');
    expect(hidden).not.toBeNull();
    expect(hidden?.hidden).toBe(true);
  });
});

describe('neoPin — interaction', { tags: ['jsdom'] }, () => {
  it('typing into a cell advances focus to the next cell', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { count: 4, type: 'text' } as never });
    await tick();
    const cells = getCells(container);
    cells[0].focus();
    await user.keyboard('a');
    await tick();
    expect(document.activeElement).toBe(cells[1]);
  });

  it('backspace on an empty cell moves focus to the previous cell', async () => {
    const user = userEvent.setup();
    const { container } = render(Harness, { props: { count: 3, type: 'text' } as never });
    await tick();
    const cells = getCells(container);
    cells[1].focus();
    await user.keyboard('{Backspace}');
    await tick();
    expect(document.activeElement).toBe(cells[0]);
  });
});

describe('neoPin — component instance API', { tags: ['jsdom'] }, () => {
  it('exposes clear/validate on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.clear).toBe('function');
    expect(typeof instance.validate).toBe('function');
  });

  it('does not attach component methods onto the hidden DOM ref', async () => {
    const { container } = render(Harness, {});
    await tick();
    const hidden = getHidden(container)!;
    expect(hidden).not.toBeNull();
    for (const m of ['clear', 'validate'] as const) {
      expect(Object.hasOwn(hidden, m)).toBe(false);
      expect((hidden as unknown as Record<string, unknown>)[m]).toBeUndefined();
    }
  });

  it('instance.clear() empties every cell across the grid', async () => {
    const user = userEvent.setup();
    const { instance, container } = captureInstance({ count: 3, groups: 2, type: 'text' });
    await tick();
    const cells = getCells(container);
    cells[0].focus();
    await user.keyboard('abcdef');
    await tick();
    expect(cells.every(c => !!c.value.length)).toBe(true);
    await instance.clear();
    await tick();
    expect(cells.every(c => c.value === '')).toBe(true);
  });

  it('instance.validate() reflects checkValidity on the hidden ref', async () => {
    const { instance, container } = captureInstance({ count: 4, type: 'text', minlength: 4, required: true, value: '' });
    await tick();
    const hidden = getHidden(container)!;
    const stateInvalid = instance.validate();
    expect(stateInvalid.valid).toBe(hidden.checkValidity());
    expect(stateInvalid.valid).toBe(false);
  });
});
