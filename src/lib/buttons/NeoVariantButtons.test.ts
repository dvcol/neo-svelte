import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoArrowButton from './NeoArrowButton.svelte';
import NeoCancelButton from './NeoCancelButton.svelte';
import NeoCloseButton from './NeoCloseButton.svelte';

afterEach(() => {
  cleanup();
});

function getButton(scope: ParentNode = document): HTMLButtonElement | null {
  return scope.querySelector<HTMLButtonElement>('button.neo-button');
}

describe('neoArrowButton', () => {
  it('renders a NeoButton with an arrow icon (default direction=right)', async () => {
    const { container } = render(NeoArrowButton, { props: { label: 'Next' } as never });
    await tick();
    const btn = getButton(container);
    expect(btn).not.toBeNull();
    expect(btn?.querySelector('.neo-icon-arrow-line, .neo-icon-arrow-chevron')).not.toBeNull();
    expect(btn?.textContent).toContain('Next');
  });

  it('reverse layout is applied for direction=right (icon after text)', async () => {
    const { container } = render(NeoArrowButton, { props: { label: 'Next', direction: 'right' } as never });
    await tick();
    expect(container.querySelector('.neo-content.neo-reverse')).not.toBeNull();
  });

  it('direction=left does not reverse content', async () => {
    const { container } = render(NeoArrowButton, { props: { label: 'Back', direction: 'left' } as never });
    await tick();
    expect(container.querySelector('.neo-content.neo-reverse')).toBeNull();
  });

  it('clicking fires onclick', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoArrowButton, { props: { label: 'Next', onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).toHaveBeenCalledTimes(1);
  });
});

describe('neoCancelButton', () => {
  it('clicking fires onclick', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoCancelButton, { props: { onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('passes aria-label through to the inner button', async () => {
    const { container } = render(NeoCancelButton, { props: { 'aria-label': 'Cancel action' } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-label')).toBe('Cancel action');
  });
});

describe('neoCloseButton', () => {
  it('size prop is reflected on the wrapper data-size', async () => {
    const { container } = render(NeoCloseButton, { props: { size: 'sm' } as never });
    await tick();
    expect(container.querySelector<HTMLElement>('.neo-close-button')?.dataset.size).toBe('sm');
  });

  it('inline=true applies .neo-inline on the wrapper', async () => {
    const { container } = render(NeoCloseButton, { props: { inline: true } as never });
    await tick();
    expect(container.querySelector('.neo-close-button.neo-inline')).not.toBeNull();
  });

  it('clicking fires onclick', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoCloseButton, { props: { onclick } as never });
    await tick();
    await user.click(getButton(container)!);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('passes aria-label through to the inner button', async () => {
    const { container } = render(NeoCloseButton, { props: { 'aria-label': 'Close panel' } as never });
    await tick();
    expect(getButton(container)?.getAttribute('aria-label')).toBe('Close panel');
  });
});
