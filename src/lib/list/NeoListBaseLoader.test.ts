import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoListBaseLoader from './NeoListBaseLoader.svelte';

afterEach(() => {
  cleanup();
});

function getLoaders(scope: ParentNode = document): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>('.neo-list-base-loader'));
}

describe('neoListBaseLoader — render', () => {
  it('renders 3 loader rows by default when loading=true', async () => {
    const { container } = render(NeoListBaseLoader, {});
    await tick();
    expect(getLoaders(container)).toHaveLength(3);
  });

  it('renders no loader rows when loading=false', async () => {
    const { container } = render(NeoListBaseLoader, { props: { loading: false } as never });
    await tick();
    expect(getLoaders(container)).toHaveLength(0);
  });

  it('items prop changes the number of placeholder rows', async () => {
    const { container } = render(NeoListBaseLoader, { props: { items: 7 } as never });
    await tick();
    expect(getLoaders(container)).toHaveLength(7);
  });

  it('select=true adds the .neo-select modifier and a checkmark placeholder per row', async () => {
    const { container } = render(NeoListBaseLoader, { props: { select: true, items: 2 } as never });
    await tick();
    expect(container.querySelectorAll('.neo-list-base-loader.neo-select')).toHaveLength(2);
    expect(container.querySelectorAll('.neo-list-base-loader-checkmark-skeleton')).toHaveLength(2);
  });

  it('checkmark=false explicitly hides the checkmark placeholder', async () => {
    const { container } = render(NeoListBaseLoader, { props: { select: true, checkmark: false, items: 2 } as never });
    await tick();
    expect(container.querySelectorAll('.neo-list-base-loader-checkmark-skeleton')).toHaveLength(0);
  });

  it('before=true renders a leading skeleton placeholder', async () => {
    const { container } = render(NeoListBaseLoader, { props: { before: true, items: 1 } as never });
    await tick();
    expect(container.querySelector('.neo-list-base-loader-before-skeleton')).not.toBeNull();
  });

  it('after=true renders a trailing skeleton placeholder', async () => {
    const { container } = render(NeoListBaseLoader, { props: { after: true, items: 1 } as never });
    await tick();
    expect(container.querySelector('.neo-list-base-loader-after-skeleton')).not.toBeNull();
  });

  it('description=true adds the .neo-description modifier on the content row', async () => {
    const { container } = render(NeoListBaseLoader, { props: { description: true, items: 1 } as never });
    await tick();
    expect(container.querySelector('.neo-list-base-loader-content.neo-description')).not.toBeNull();
  });

  it('description=false omits .neo-description', async () => {
    const { container } = render(NeoListBaseLoader, { props: { description: false, items: 1 } as never });
    await tick();
    expect(container.querySelector('.neo-list-base-loader-content.neo-description')).toBeNull();
  });
});
