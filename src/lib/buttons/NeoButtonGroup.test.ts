import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import Harness from './NeoButtonGroupHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getGroup(scope: ParentNode = document): HTMLElement | null {
  return scope.querySelector<HTMLElement>('.neo-button-group');
}

describe('neoButtonGroup — render', () => {
  it('renders a div.neo-button-group by default with children', async () => {
    const { container } = render(Harness, {});
    await tick();
    const grp = getGroup(container);
    expect(grp).not.toBeNull();
    expect(grp?.tagName).toBe('DIV');
    expect(container.querySelector('[data-testid="grp-btn-1"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="grp-btn-2"]')).not.toBeNull();
  });

  it('uses caller-supplied tag', async () => {
    const { container } = render(Harness, { props: { tag: 'section' } as never });
    await tick();
    expect(getGroup(container)?.tagName).toBe('SECTION');
  });
});

describe('neoButtonGroup — style flags', () => {
  it('vertical=true applies .neo-vertical', async () => {
    const { container } = render(Harness, { props: { vertical: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-vertical')).toBe(true);
  });

  it('rounded=true applies .neo-rounded', async () => {
    const { container } = render(Harness, { props: { rounded: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-rounded')).toBe(true);
  });

  it('glass=true applies .neo-glass', async () => {
    const { container } = render(Harness, { props: { glass: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-glass')).toBe(true);
  });

  it('tinted=true applies .neo-tinted', async () => {
    const { container } = render(Harness, { props: { tinted: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-tinted')).toBe(true);
  });

  it('skeleton=true applies .neo-skeleton', async () => {
    const { container } = render(Harness, { props: { skeleton: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-skeleton')).toBe(true);
  });

  it('nowrap=true applies .neo-nowrap', async () => {
    const { container } = render(Harness, { props: { nowrap: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-nowrap')).toBe(true);
  });

  it('text=true → borderless defaults to true and applies .neo-borderless', async () => {
    const { container } = render(Harness, { props: { text: true } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-borderless')).toBe(true);
  });

  it('text=true with explicit borderless=false leaves .neo-borderless off', async () => {
    const { container } = render(Harness, { props: { text: true, borderless: false } as never });
    await tick();
    expect(getGroup(container)?.classList.contains('neo-borderless')).toBe(false);
  });
});
