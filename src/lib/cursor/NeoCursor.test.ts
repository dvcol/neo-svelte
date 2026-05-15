import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import { getClosestClickable, getFirstDataNeoCursor } from './neo-cursor.model.js';
import NeoCursorHarness from './NeoCursor.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoCursor — container rendering', { tags: ['jsdom'] }, () => {
  it('with children but no target → wraps children in a .neo-cursor-container <div>', async () => {
    const { container } = render(NeoCursorHarness, {
      props: { childrenText: 'inside' } as never,
    });
    await tick();
    const wrapper = container.querySelector<HTMLElement>('.neo-cursor-container');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper?.querySelector('[data-testid="cursor-children"]')?.textContent).toBe('inside');
  });

  it('tag override changes the wrapper element', async () => {
    const { container } = render(NeoCursorHarness, {
      props: { childrenText: 'x', tag: 'section' } as never,
    });
    await tick();
    expect(container.querySelector('.neo-cursor-container')?.tagName).toBe('SECTION');
  });

  it('with target provided → does NOT render its own container, just renders the children pass-through', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    const { container } = render(NeoCursorHarness, {
      props: { childrenText: 'x', target } as never,
    });
    await tick();
    // No wrapper, but children pass-through (rendered as a sibling fragment of host)
    expect(container.querySelector('.neo-cursor-container')).toBeNull();
    target.remove();
  });

  it('no children, no target → falls back to document.body and renders no container', async () => {
    const { container } = render(NeoCursorHarness, { props: {} as never });
    await tick();
    expect(container.querySelector('.neo-cursor-container')).toBeNull();
  });
});

describe('neoCursor — model helpers', { tags: ['jsdom'] }, () => {
  it('getFirstDataNeoCursor returns the first ancestor data-neo-cursor attribute', () => {
    const root = document.createElement('div');
    const parent = document.createElement('div');
    parent.setAttribute('data-neo-cursor', 'snap');
    const child = document.createElement('span');
    parent.appendChild(child);
    root.appendChild(parent);
    expect(getFirstDataNeoCursor(child)).toBe('snap');
  });

  it('getFirstDataNeoCursor returns undefined when no ancestor has the attribute', () => {
    const root = document.createElement('div');
    const child = document.createElement('span');
    root.appendChild(child);
    expect(getFirstDataNeoCursor(child)).toBeUndefined();
  });

  it('getFirstDataNeoCursor stops at the boundary element', () => {
    const root = document.createElement('div');
    root.setAttribute('data-neo-cursor', 'snap');
    const child = document.createElement('span');
    root.appendChild(child);
    expect(getFirstDataNeoCursor(child, root)).toBeUndefined();
  });

  it('getClosestClickable treats data-neo-cursor="false" as not clickable', () => {
    const root = document.createElement('div');
    root.setAttribute('data-neo-cursor', 'false');
    document.body.appendChild(root);
    const button = document.createElement('button');
    root.appendChild(button);
    expect(getClosestClickable(root)).toBeUndefined();
    root.remove();
  });

  it('getClosestClickable treats data-neo-cursor="snap" as snap-clickable', () => {
    const root = document.createElement('div');
    root.setAttribute('data-neo-cursor', 'snap');
    document.body.appendChild(root);
    expect(getClosestClickable(root)).toBe(root);
    root.remove();
  });
});
